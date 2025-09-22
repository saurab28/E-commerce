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

      <!-- Loading Overlay -->
      <div
        v-if="mapsStore.isLoading"
        class="absolute inset-0 z-10 flex items-center justify-center bg-white/70 rounded-2xl"
      >
        <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Left Panel -->
      <div class="w-[350px] flex flex-col gap-3 z-20">
        <div class="flex items-center gap-2 mb-2">
          <img
            class="w-6 h-6"
            src="https://fonts.gstatic.com/s/i/googlematerialicons/location_pin/v5/24px.svg"
            alt="icon"
          />
          <span class="font-medium text-gray-800">Address Selection</span>
        </div>

        <input
          id="location-input"
          v-model="form.location"
          type="text"
          placeholder="Address"
          class="border-b border-gray-400 focus:border-blue-500 outline-none text-sm py-1"
        />
        <input
          v-model="form.apt"
          type="text"
          placeholder="Apt, Suite, etc (optional)"
          class="border-b border-gray-400 focus:border-blue-500 outline-none text-sm py-1"
        />
        <input
          id="locality-input"
          v-model="form.locality"
          type="text"
          placeholder="City"
          class="border-b border-gray-400 focus:border-blue-500 outline-none text-sm py-1"
        />

        <div class="flex gap-3">
          <input
            id="administrative_area_level_1-input"
            v-model="form.state"
            type="text"
            placeholder="State/Province"
            class="flex-1 border-b border-gray-400 focus:border-blue-500 outline-none text-sm py-1"
          />
          <input
            id="postal_code-input"
            v-model="form.postalCode"
            type="text"
            placeholder="Zip/Postal code"
            class="flex-1 border-b border-gray-400 focus:border-blue-500 outline-none text-sm py-1"
          />
        </div>

        <input
          id="country-input"
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
import { ref, reactive, onMounted } from 'vue'
import { useGoogleMapsStore } from '@/stores/googleMaps'
import { useCart } from '@/stores/cart'

const mapsStore = useGoogleMapsStore()
const cart = useCart()
const isModal = ref<boolean>(true)

interface AddressForm {
  location: string
  apt: string
  locality: string
  state: string
  postalCode: string
  country: string
}

const form = reactive<AddressForm>({
  location: '',
  apt: '',
  locality: '',
  state: '',
  postalCode: '',
  country: '',
})

const toggleModal = (): void => {
  isModal.value = !isModal.value
}

// Google Maps objects
const map = ref<google.maps.Map | null>(null)
const marker = ref<google.maps.Marker | null>(null)
const geocoder = ref<google.maps.Geocoder | null>(null)
const autocomplete = ref<google.maps.places.Autocomplete | null>(null)
const selectedLocation = ref<{ lat: number; lng: number } | null>(null)

function initMap(): void {
  const defaultCenter = { lat: 37.4221, lng: -122.0841 }

  map.value = new google.maps.Map(document.getElementById('map') as HTMLElement, {
    center: defaultCenter,
    zoom: 14,
  })

  geocoder.value = new google.maps.Geocoder()
  marker.value = new google.maps.Marker({
    map: map.value,
    position: defaultCenter,
  })

  const locationInput = document.getElementById('location-input') as HTMLInputElement

  autocomplete.value = new google.maps.places.Autocomplete(locationInput, {
    fields: ['address_components', 'geometry', 'name'],
    types: ['address'],
  })

  autocomplete.value.addListener('place_changed', () => {
    if (!autocomplete.value) return
    const place = autocomplete.value.getPlace()
    if (!place.geometry || !place.geometry.location) {
      alert(`No details available for input: '${place.name}'`)
      return
    }
    renderAddress(place)
    fillInAddress(place)
  })
}

function fillInAddress(place: google.maps.places.PlaceResult): void {
  const shortNameTypes = new Set(['street_number', 'administrative_area_level_1', 'postal_code'])

  const getComponent = (type: string): string => {
    for (const comp of place.address_components || []) {
      if (comp.types.includes(type)) {
        return shortNameTypes.has(type) ? comp.short_name ?? '' : comp.long_name ?? ''
      }
    }
    return ''
  }

  form.location = `${getComponent('street_number')} ${getComponent('route')}`.trim()
  form.locality = getComponent('locality')
  form.state = getComponent('administrative_area_level_1')
  form.postalCode = getComponent('postal_code')
  form.country = getComponent('country')
}

function renderAddress(place: google.maps.places.PlaceResult): void {
  if (place.geometry?.location && map.value && marker.value) {
    const loc = place.geometry.location
    map.value.setCenter(loc)
    marker.value.setPosition(loc)
    selectedLocation.value = { lat: loc.lat(), lng: loc.lng() }
  }
}

function useCurrentLocation(): void {
  if (!navigator.geolocation) {
    alert('Geolocation not supported.')
    return
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
      if (map.value && marker.value) {
        map.value.setCenter(coords)
        marker.value.setPosition(coords)
        selectedLocation.value = coords
      }

      if (geocoder.value) {
        geocoder.value.geocode({ location: coords }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            fillInAddress(results[0])
            form.location = results[0].formatted_address ?? ''
          }
        })
      }
    },
    () => alert('Unable to get your location.')
  )
}

function checkout(): void {
  if (!selectedLocation.value) {
    alert('Please select a location first.')
    return
  }
  console.log('Checkout with location:', selectedLocation.value, form)
  toggleModal()
  startPayment()
}

const startPayment = async () => {
  try {
    // 1. Create order on backend with cart items
    const res = await fetch('http://localhost:5002/create-order', {
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
    alert('✅ Payment Verified! Thank you for shopping 🛒')
    cart.clearCart() // optional: empty cart after payment
  } else {
    alert(' Payment Verification Failed')
  }
}

onMounted(async () => {
  await mapsStore.loadApi()
  if (mapsStore.isLoaded) initMap()
})
</script>
