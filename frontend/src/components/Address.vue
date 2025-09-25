<template>
  <div
    v-if="isModal"
    @click.self="toggleModal"
    class="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm"
  >
    <div class="w-full max-w-4xl bg-white shadow-2xl rounded-2xl p-6 relative flex gap-4">
      <!-- Close Button -->
      <button
        @click.stop="toggleModal"
        class="absolute top-2 right-2 text-black bg-gray-50 rounded-full p-2 hover:text-gray-700"
      >
        ✕
      </button>

      <!-- Left Panel -->
      <div class="w-[350px] flex flex-col gap-3 z-20">
        <div class="flex items-center gap-2 mb-2">
          <img
            class="w-6 h-6"
            src="https://fonts.gstatic.com/s/i/googlematerialicons/location_pin/v5/24px.svg"
            alt="icon"
          />
          <span class="font-medium text-gray-800">Delivery Address Selection</span>
        </div>

        <input
          v-model="form.location"
          type="text"
          placeholder="Search address"
          class="border-b border-gray-400 focus:border-blue-500 outline-none text-sm py-1"
          @input="searchPlaces(form.location)"
        />

        <!-- Suggestions -->
        <ul
          v-if="suggestions.length"
          class="mt-1 border rounded-md max-h-40 overflow-y-auto bg-white shadow"
        >
          <li
            v-for="s in suggestions"
            :key="s.place_id"
            class="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            @click="selectSuggestion(s)"
          >
            {{ s.description }}
          </li>
        </ul>

        <input
          v-model="form.apt"
          type="text"
          placeholder="Apt, Suite, etc (optional)"
          class="border-b border-gray-400 focus:border-blue-500 outline-none text-sm py-1"
        />
        <input
          v-model="form.locality"
          type="text"
          placeholder="City"
          class="border-b border-gray-400 focus:border-blue-500 outline-none text-sm py-1"
        />

        <div class="flex gap-3">
          <input
            v-model="form.state"
            type="text"
            placeholder="State/Province"
            class="flex-1 border-b border-gray-400 focus:border-blue-500 outline-none text-sm py-1"
          />
          <input
            v-model="form.postalCode"
            type="text"
            placeholder="Zip/Postal code"
            class="flex-1 border-b border-gray-400 focus:border-blue-500 outline-none text-sm py-1"
          />
        </div>

        <input
          v-model="form.country"
          type="text"
          placeholder="Country"
          class="border-b border-gray-400 focus:border-blue-500 outline-none text-sm py-1"
        />

        <div class="flex justify-between mt-4">
          <button
            @click="useCurrentLocation"
            class="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
          >
            📍 Use My Location
          </button>
          <button
            @click="checkout"
            class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm"
          >
            Checkout
          </button>
        </div>
      </div>

      <!-- Map -->
      <div class="flex-1">
        <div id="map" class="w-full h-[400px] rounded-lg"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from "vue"
import { useCart } from "@/stores/cart"

const isModal = ref(true)
const cart = useCart()
interface AddressForm {
  location: string
  apt: string
  locality: string
  state: string
  postalCode: string
  country: string
}

const form = reactive<AddressForm>({
  location: "",
  apt: "",
  locality: "",
  state: "",
  postalCode: "",
  country: "",
})

const suggestions = ref<{ description: string; place_id: string }[]>([])
const map = ref<google.maps.Map | null>(null)
const marker = ref<google.maps.Marker | null>(null)
const selectedLocation = ref<{ lat: number; lng: number } | null>(null)

let googleMapsLoaded = false

// --- Load Google Maps dynamically ---
const loadGoogleMaps = () => {
  return new Promise<void>((resolve, reject) => {
    if (googleMapsLoaded) return resolve()

    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    }&libraries=places`
    script.async = true
    script.defer = true

    script.onload = () => {
      googleMapsLoaded = true
      resolve()
    }
    script.onerror = () => reject("Google Maps failed to load")
    document.head.appendChild(script)
  })
}

// --- Initialize map ---
const initMap = () => {
  const defaultCenter = { lat: 37.4221, lng: -122.0841 }
  map.value = new google.maps.Map(document.getElementById("map") as HTMLElement, {
    center: defaultCenter,
    zoom: 14,
  })
  marker.value = new google.maps.Marker({
    map: map.value,
    position: defaultCenter,
  })
}

// --- Search Autocomplete ---
async function searchPlaces(input: string) {
  if (!input) return (suggestions.value = [])
  try {
    const res = await fetch(
      `http://localhost:4001/api/autocomplete?input=${encodeURIComponent(input)}`
    )
    const data = await res.json()
    suggestions.value = data.predictions || []
  } catch (err) {
    console.error("Autocomplete failed:", err)
    suggestions.value = []
  }
}

async function selectSuggestion(s: { description: string; place_id: string }) {
  suggestions.value = []
  try {
    const res = await fetch(
      `http://localhost:4001/api/place-details?placeId=${s.place_id}`
    )
    const data = await res.json()

    if (data.result?.geometry?.location) {
      const { lat, lng } = data.result.geometry.location
      selectedLocation.value = { lat, lng }
      map.value?.setCenter(selectedLocation.value)
      marker.value?.setPosition(selectedLocation.value)
    }

    if (data.result?.formatted_address) form.location = data.result.formatted_address
    if (data.result?.address_components) fillAddressComponents(data.result.address_components)
  } catch (err) {
    console.error("Place details failed:", err)
  }
}

// --- Current Location ---
async function useCurrentLocation() {
  if (!navigator.geolocation) return alert("Geolocation not supported.")

  navigator.geolocation.getCurrentPosition(async (pos) => {
    const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
    selectedLocation.value = coords
    map.value?.setCenter(coords)
    marker.value?.setPosition(coords)

    try {
      const res = await fetch(
        `http://localhost:4001/api/geocode?lat=${coords.lat}&lng=${coords.lng}`
      )
      const data = await res.json()
      if (data.results && data.results[0]) {
        form.location = data.results[0].formatted_address
        fillAddressComponents(data.results[0].address_components)
      }
    } catch (err) {
      console.error("Geocode failed:", err)
    }
  })
}

// --- Fill form ---
function fillAddressComponents(components: any[]) {
  const getComp = (type: string) =>
    components.find((c: any) => c.types.includes(type))?.long_name || ""

  form.locality = getComp("locality")
  form.state = getComp("administrative_area_level_1")
  form.postalCode = getComp("postal_code")
  form.country = getComp("country")
}

// --- Checkout ---
function checkout() {
  if (!selectedLocation.value) {
    alert("Please select a location first.")
    return
  }
  console.log("Checkout with:", form, selectedLocation.value)
  
  // Save order to localStorage before payment
  saveOrderToLocalStorage()
  
  toggleModal()
  startPayment()
}

// --- Save Order to localStorage ---
function saveOrderToLocalStorage() {
  const order = {
    id: generateOrderId(),
    date: new Date().toISOString(),
    items: cart.cartItems.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      qty: item.qty,
      image: item.image,
      weight: item.weight
    })),
    subtotal: cart.cartTotal,
    shipping: 0, // Free shipping for pickup
    total: cart.cartTotal,
    status: 'Processing' as const,
    address: {
      location: form.location,
      apt: form.apt,
      locality: form.locality,
      state: form.state,
      postalCode: form.postalCode,
      country: form.country
    }
  }

  // Get existing orders
  const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]')
  
  // Add new order
  existingOrders.push(order)
  
  // Save back to localStorage
  localStorage.setItem('orders', JSON.stringify(existingOrders))
}

// --- Generate Order ID ---
function generateOrderId(): string {
  return 'ORD' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase()
}

// --- Modal toggle with map resize ---
function toggleModal() {
  isModal.value = !isModal.value
  if (isModal.value && map.value) {
    setTimeout(() => {
      google.maps.event.trigger(map.value!, "resize")
      if (selectedLocation.value) map.value?.setCenter(selectedLocation.value)
    }, 300)
  }
}
const startPayment = async () => {
  try {
    // 1. Create order on backend with cart items
    const res = await fetch('http://localhost:5000/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartItems: cart.cartItems }),
    })

    const order = await res.json()
    console.log('✅ Order:', order)

    // 2. Razorpay checkout options
    const options = {
      key: 'rzp_test_RGeGMOEnLzUqYw', // Your Razorpay Key ID
      amount: order.amount, // from backend
      currency: order.currency,
      name: 'Grocery Store',
      description: 'Cart Checkout',
      order_id: order.id, // order id from backend
      handler: function (response: any) {
        // 3. Verify payment with backend
        verifyPayment(response)
      },
      prefill: {
        name: 'B.Sri.Lalithadhitya',
        email: 'bompallysrilalithadhitya@example.com',
        contact: '6301168711',
      },
      theme: {
        color: '#F43F5E', // rose-500
      },
    }

    const rzp = new (window as any).Razorpay(options)
    rzp.open()
  } catch (err) {
    console.error('Payment failed', err)
  }
}

// Verify payment
const verifyPayment = async (response: any) => {
  const res = await fetch('http://localhost:5000/verify-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
    }),
  })

  const data = await res.json()
  if (data.success) {
    alert('✅ Payment Verified! Thank you for shopping 🛒')
    
    // Update order status to 'Delivered' after successful payment
    updateOrderStatus('Delivered')
    
    cart.clearCart() // optional: empty cart after payment
  } else {
    alert(' Payment Verification Failed')
  }
}
onMounted(async () => {
  await loadGoogleMaps()
  initMap()
})
</script>

// --- Update Order Status ---
function updateOrderStatus(status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled') {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]')
  if (orders.length > 0) {
    // Update the most recent order (last in array)
    orders[orders.length - 1].status = status
    localStorage.setItem('orders', JSON.stringify(orders))
  }
}
