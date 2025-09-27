<template>
  <Header :param="routepath.path" />
  <div class="min-h-screen bg-gray-100 py-10">
    <div class="mx-auto w-[min(1200px,95%)]">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-4xl font-extrabold tracking-tight">My Orders</h1>
        <button
          class="px-4 py-2 rounded-full bg-white shadow-sm border border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer"
          @click="handleBackToHome"
        >
          ← Back to Home
        </button>
      </div>

      <div>
        <!-- Empty state -->
        <div
          v-if="!orders.length"
          class="rounded-2xl bg-white shadow-lg p-10 text-center text-gray-600"
        >
          <i class="ri-file-list-3-line text-6xl text-gray-300 mb-4"></i>
          <h2 class="text-xl font-semibold mb-2">No Orders Yet</h2>
          <p class="text-gray-500 mb-4">You haven't placed any orders yet. Start shopping to see your orders here!</p>
          <button
            @click="handleBackToHome"
            class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Start Shopping
          </button>
        </div>

        <!-- Orders List -->
        <div v-else class="space-y-6">
          <div
            v-for="order in orders"
            :key="order.id"
            class="rounded-2xl bg-white shadow-lg overflow-hidden"
          >
            <!-- Order Header -->
            <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-lg font-semibold text-gray-800">Order #{{ order.id }}</h3>
                  <p class="text-sm text-gray-500">{{ formatDate(order.date) }}</p>
                </div>
                <div class="text-right">
                  <span
                    class="inline-block px-3 py-1 rounded-full text-sm font-medium"
                    :class="getStatusClass(order.status)"
                  >
                    {{ order.status }}
                  </span>
                  <p class="text-lg font-bold text-gray-800 mt-1">{{ money(order.total) }}</p>
                </div>
              </div>
            </div>

            <!-- Delivery Address -->
            <div class="px-6 py-4 border-b border-gray-200 bg-blue-50">
              <h4 class="font-semibold text-gray-800 mb-2">
                <i class="ri-map-pin-line text-blue-600 mr-2"></i>
                Delivery Address
              </h4>
              <p class="text-gray-700">{{ order.address.location }}</p>
              <div class="text-sm text-gray-600 mt-1">
                <span v-if="order.address.apt">{{ order.address.apt }}, </span>
                <span>{{ order.address.locality }}, {{ order.address.state }} {{ order.address.postalCode }}</span>
              </div>
            </div>

            <!-- Order Items -->
            <div class="px-6 py-4">
              <h4 class="font-semibold text-gray-800 mb-4">Order Items ({{ order.items.length }} items)</h4>
              <div class="space-y-3">
                <div
                  v-for="item in order.items"
                  :key="item.id"
                  class="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                >
                  <img
                    v-if="item.image"
                    class="w-16 h-16 rounded-md object-contain bg-white"
                    :src="item.image"
                    :alt="item.name"
                  />
                  <div v-else class="w-16 h-16 rounded-md bg-gray-200 flex items-center justify-center">
                    <i class="ri-image-line text-gray-400 text-2xl"></i>
                  </div>

                  <div class="flex-1">
                    <h5 class="font-semibold text-gray-800">{{ item.name }}</h5>
                    <p class="text-sm text-gray-500" v-if="item.weight">{{ item.weight }}</p>
                    <div class="flex items-center gap-4 mt-1">
                      <span class="text-sm text-gray-600">Qty: {{ item.qty }}</span>
                      <span class="text-sm font-semibold text-gray-800">{{ money(item.price) }} each</span>
                    </div>
                  </div>

                  <div class="text-right">
                    <p class="font-semibold text-gray-800">{{ money(item.price * item.qty) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Order Summary -->
            <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div class="flex justify-between items-center">
                <div class="text-sm text-gray-600">
                  <p>Subtotal: {{ money(order.subtotal) }}</p>
                  <p>Shipping: {{ order.shipping === 0 ? 'Free' : money(order.shipping) }}</p>
                </div>
                <div class="text-right">
                  <p class="text-lg font-bold text-gray-800">Total: {{ money(order.total) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Header from './Header.vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const routepath = useRoute()

interface OrderItem {
  id: string | number
  name: string
  price: number
  qty: number
  image?: string
  weight?: string
}

interface OrderAddress {
  location: string
  apt?: string
  locality: string
  state: string
  postalCode: string
  country: string
}

interface Order {
  id: string
  date: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  status: 'Delivered' | 'Processing' | 'Shipped' | 'Cancelled'
  address: OrderAddress
}

const orders = ref<Order[]>([])

const loadOrders = () => {
  const savedOrders = localStorage.getItem('orders')
  if (savedOrders) {
    try {
      orders.value = JSON.parse(savedOrders)
      // Sort orders by date (newest first)
      orders.value.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    } catch (error) {
      console.error('Error loading orders:', error)
      orders.value = []
    }
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const money = (amount: number) => {
  return `₹${amount.toFixed(2)}`
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Delivered':
      return 'bg-green-100 text-green-800'
    case 'Shipped':
      return 'bg-blue-100 text-blue-800'
    case 'Processing':
      return 'bg-yellow-100 text-yellow-800'
    case 'Cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const handleBackToHome = () => {
  router.push('/')
}

onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
.mx-auto {
  max-width: 1200px;
  margin: auto;
}

@media (max-width: 1024px) {
  .mx-auto {
    width: 99%;
    padding: 0 2px;
  }
}

@media (max-width: 768px) {
  .text-4xl {
    font-size: 2rem;
  }
  
  .flex.items-center.gap-4 {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .w-16.h-16 {
    width: 3rem;
    height: 3rem;
  }
}

@media (max-width: 480px) {
  .px-6 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .text-4xl {
    font-size: 1.5rem;
  }
}
</style>