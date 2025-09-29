<template>
  <div
    v-if="isModal"
    @click.self="toggleModal"
    class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
  >
    <div
      class="w-[60%] sm:w-full  max-w-5xl bg-white/95 shadow-2xl rounded-2xl relative flex flex-col md:flex-row overflow-hidden animate-fadeIn border border-gray-200"
    >
      <!-- Close Button -->
      <button
        @click.stop="toggleModal"
        class="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition-all duration-200 rounded-full p-2 bg-gray-100 hover:bg-red-100"
      >
        ✕
      </button>

      <!-- Left Panel -->
      <div class="w-full sm:w-[350px] bg-gradient-to-b from-gray-50 to-gray-100 border-r p-6 flex flex-col gap-5">
        <!-- Header -->
        <div class="flex items-center gap-2 mb-2">
          <img
            class="w-6 h-6"
            src="https://fonts.gstatic.com/s/i/googlematerialicons/location_pin/v5/24px.svg"
            alt="icon"
          />
          <span class="font-semibold text-xl text-gray-800">Delivery Address</span>
        </div>

        <!-- Input Fields -->
        <div class="flex flex-col gap-3">
          <input
            v-model="form.location"
            type="text"
            placeholder="Search address"
            class="border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
            @input="searchPlaces(form.location)"
          />

          <!-- Suggestions -->
          <ul
            v-if="suggestions.length"
            class="border rounded-lg max-h-40 overflow-y-auto bg-white shadow-lg divide-y animate-fadeIn"
          >
            <li
              v-for="s in suggestions"
              :key="s.place_id"
              class="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm transition-all duration-150"
              @click="selectSuggestion(s)"
            >
              {{ s.description }}
            </li>
          </ul>

          <input
            v-model="form.apt"
            type="text"
            placeholder="Apt, Suite, etc (optional)"
            class="border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            v-model="form.locality"
            type="text"
            placeholder="City"
            class="border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <div class="sm:flex space-y-3 sm:space-y-0 gap-3">
            <input
              v-model="form.state"
              type="text"
              placeholder="State/Province"
              class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              v-model="form.postalCode"
              type="text"
              placeholder="Zip/Postal code"
              class="flex-1 border border-gray-300 rounded-lg px-3 w-0.5 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <input
            v-model="form.country"
            type="text"
            placeholder="Country"
            class="border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:justify-between mt-4">
          <button
            @click="useCurrentLocation"
            class="flex-1 px-3 mr-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm font-medium transition-all duration-200 shadow-sm"
          >
            📍 Use My Location
          </button>
          <button
            @click="checkout"
            class="flex-1 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition-all duration-200"
          >
            Checkout
          </button>
        </div>
      </div>

      <!-- Map -->
      <div class="flex-1 hidden sm:flex">
        <div id="map" class="w-full rounded-lg"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.25s ease-in-out;
}

ul::-webkit-scrollbar {
  width: 6px;
}
ul::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 10px;
}
ul::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue"
import { useCart } from "@/stores/cart"
import { useToast } from "vue-toastification"
import Checkmark from "@/components/Checkmark.vue"

const toast = useToast()
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
      `http://localhost:5003/api/autocomplete?input=${encodeURIComponent(input)}`
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
      `http://localhost:5003/api/place-details?placeId=${s.place_id}`
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
  if (!navigator.geolocation) return toast.error("❌ Geolocation not supported.")

  navigator.geolocation.getCurrentPosition(async (pos) => {
    const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
    selectedLocation.value = coords
    map.value?.setCenter(coords)
    marker.value?.setPosition(coords)

    try {
      const res = await fetch(
        `http://localhost:5003/api/geocode?lat=${coords.lat}&lng=${coords.lng}`
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
    toast.warning("⚠️ Please select a location first.")
    return
  }
  console.log("Checkout with:", form, selectedLocation.value)

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
    shipping: 0,
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

  const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]')
  existingOrders.push(order)
  localStorage.setItem('orders', JSON.stringify(existingOrders))
}

// --- Generate Order ID ---
function generateOrderId(): string {
  return 'ORD' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase()
}

// --- Modal toggle ---
function toggleModal() {
  isModal.value = !isModal.value
  if (isModal.value && map.value) {
    setTimeout(() => {
      google.maps.event.trigger(map.value!, "resize")
      if (selectedLocation.value) map.value?.setCenter(selectedLocation.value)
    }, 300)
  }
}

// --- Payment ---
const startPayment = async () => {
  try {
    const res = await fetch('http://localhost:5002/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartItems: cart.cartItems }),
    })

    const order = await res.json()
    console.log('✅ Order:', order)

    const options = {
      key: 'rzp_test_RGeGMOEnLzUqYw',
      amount: order.amount,
      currency: order.currency,
      name: 'Grocery Store',
      description: 'Cart Checkout',
      order_id: order.id,
      handler: function (response: any) {
        verifyPayment(response)
      },
      prefill: {
        name: 'B.Sri.Lalithadhitya',
        email: 'bompallysrilalithadhitya@example.com',
        contact: '6301168711',
      },
      theme: {
        color: '#F43F5E',
      },
    }

    const rzp = new (window as any).Razorpay(options)
    rzp.open()
  } catch (err) {
    console.error('Payment failed', err)
  }
}

// --- Verify payment ---
const verifyPayment = async (response: any) => {
  const res = await fetch('http://localhost:5002/verify-payment', {
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
    toast.success(" Payment Verified! Thank you for shopping with us. ")
    cart.clearCart()
  } else {
    toast.error("❌ Payment Verification Failed")
  }
}

onMounted(async () => {
  await loadGoogleMaps()
  initMap()
  localStorage.setItem('cartItems', JSON.stringify(cart.cartItems))
})
</script>
