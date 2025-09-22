<!-- src/components/Cart.vue -->
<template>
  <Header :param="routepath.path" />
  <div class="min-h-screen bg-gray-100 py-10">
    <div class="mx-auto w-[min(1200px,95%)]">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-4xl font-extrabold tracking-tight" @click="checkAuthorization">My Cart</h1>
        <button
          class="px-4 py-2 rounded-full bg-white shadow-sm border border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer"
          @click="handleProductcartpath"
        >
          ← Continue shopping
        </button>
      </div>

      <div>
        <!-- Empty state -->
        <div
          v-if="!cart.cartItems.length"
          class="rounded-2xl bg-white shadow-lg p-10 text-center text-gray-600"
        >
          Your cart is empty.
        </div>

        <div>
          <!-- Empty state -->
          <div
            v-if="!cart.cartItems.length"
            class="rounded-2xl bg-white shadow-lg p-10 text-center text-gray-600"
          >
            Your cart is empty.
          </div>

          <!-- Main card -->
          <div v-else class="rounded-2xl bg-white shadow-lg overflow-hidden">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-2 px-8 py-8">
              <!-- Left: Items -->
              <div class="lg:col-span-8">
                <!-- Table head -->
                <div
                  class="grid grid-cols-[1fr_160px_140px_160px_32px] gap-4 items-center pb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200"
                >
                  <div class="text-left">Product</div>
                  <div class="text-right pr-3">Price</div>
                  <div class="text-center">Qty</div>
                  <div class="text-right pl-3">Total</div>
                  <div></div>
                </div>

                <!-- Rows -->
                <div
                  v-for="eachItem in cart.cartItems"
                  :key="eachItem.id"
                  class="grid grid-cols-[1fr_160px_140px_160px_32px] gap-4 items-center py-6 border-b border-gray-200 tracking-wider"
                >
                  <!-- product cell -->
                  <div class="flex items-center gap-4">
                    <img
                      v-if="eachItem.image"
                      class="w-16 h-16 rounded-md object-contain bg-gray-50"
                      :src="eachItem.image"
                      :alt="eachItem.name"
                    />
                    <div v-else class="w-16 h-16 rounded-md bg-gray-100"></div>

                    <div class="flex items-center gap-2 max-w-[220px] truncate">
                      <div class="text-gray-900 font-semibold truncate">{{ eachItem.name }}</div>
                      <div class="text-gray-400 text-sm">{{ eachItem.weight }}</div>
                    </div>
                  </div>

                  <!-- price -->
                  <div class="text-right font-semibold text-gray-900 text-base pr-3">
                    {{ money(eachItem.price as number) }}
                  </div>

                  <!-- qty -->
                  <div class="flex items-center justify-center">
                    <div
                      class="inline-flex items-center rounded-full border border-gray-300 overflow-hidden"
                    >
                      <button
                        class="px-3 py-1 text-lg cursor-pointer"
                        @click="decrementQuantity(eachItem.id)"
                      >
                        −
                      </button>
                      <div class="w-10 text-center font-semibold">
                        {{ eachItem.qty }}
                      </div>
                      <button
                        class="px-3 py-1 text-lg cursor-pointer"
                        @click="incrementQuantity(eachItem.id)"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <!-- total -->
                  <div class="text-right font-semibold text-gray-900">
                    {{ money((eachItem.price as number) * eachItem.qty) }}
                  </div>

                  <!-- remove -->
                  <button
                    class="text-gray-400 hover:text-gray-600 text-xl cursor-pointer"
                    @click="removeItem(eachItem.id)"
                  >
                    ×
                  </button>
                </div>
              </div>

              <!-- Right: Summary -->
              <div class="lg:col-span-4 flex lg:justify-end items-start">
                <div
                  class="w-full lg:w-[300px] ml-auto rounded-2xl bg-white border border-gray-200 px-8 py-5 shadow-md"
                >
                  <div class="flex justify-between text-gray-600">
                    <span>SUBTOTAL TTC</span>
                    <span class="font-semibold text-gray-900">
                      {{ money(subtotal) }}
                    </span>
                  </div>
                  <div class="flex justify-between py-2 text-gray-600 mt-2">
                    <span>SHIPPING</span>
                    <span class="font-semibold text-gray-900">
                      {{ shipping === 'pickup' ? 'Free' : money(9.9) }}
                    </span>
                  </div>
                  <div class="h-px bg-gray-200 my-3"></div>
                  <div class="flex justify-between text-lg font-semibold">
                    <span>TOTAL</span>
                    <span>{{ money(total) }}</span>
                  </div>

                  <button
                    class="mt-4 w-full rounded-full bg-rose-500 text-white font-semibold py-3 shadow hover:bg-rose-600 flex items-center justify-between px-4 cursor-pointer"
                    v-if="isLoggedIn"
                    @click="toogleAdressModal"
                  >
                    <span>Procceed</span>
                    <span class="rounded-full px-3 py-1 text-sm">{{ money(total) }}</span>
                  </button>
                  <button
                    class="mt-4 w-full text-center rounded-full bg-rose-500 text-white font-semibold py-3 shadow hover:bg-rose-600 px-4 cursor-pointer"
                    v-else
                    @click="toogleModal"
                  >
                    Login to Proceed
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- /card -->
      </div>
    </div>
  </div>

  <Address v-if="isChecked" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import Header from './Header.vue'
import { useCart } from '@/stores/cart'
import { useRouter, useRoute } from 'vue-router'
import authorization from '@/composables/auth'
import loginModal from '@/composables/loginmodal'

import Cookies from 'js-cookie'

import Address from './Address.vue'

const cart = useCart()
const route = useRouter()
const routepath = useRoute()
const auth = authorization()

const { isLoggedIn, checkAuthorization } = auth
const { toogleModal } = loginModal()
const isChecked = ref<boolean>(false)
const scrollY = ref(0)

const shipping = ref<'pickup' | 'delivery'>('pickup')
const shippingCost = computed(() => (shipping.value === 'delivery' ? 9.9 : 0))
const subtotal = computed(() => cart.cartTotal)
const total = computed(() => Number((subtotal.value + shippingCost.value).toFixed(2)))

const API_URL = 'http://localhost:5001'

// ----------------------------------
// Firestore Cart Sync
// ----------------------------------

// 📌 Load cart from backend (when user logs in)
async function fetchUserCart() {
  try {
    const token = Cookies.get('token')
    if (!token) return
    const res = await fetch(`${API_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error)

    // Replace local cart with Firestore cart
    cart.setCart(
      data.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        qty: item.quantity,
        image: item.image || null,
        weight: item.weight || '',
      })),
    )
  } catch (err: any) {
    console.error('❌ Fetch cart failed:', err.message)
  }
}

// 📌 Add/update item in Firestore
async function syncItem(product: any) {
  try {
    const token = Cookies.get('token')
    if (!token) return
    await fetch(`${API_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    })
  } catch (err) {
    console.error('❌ Sync item failed', err)
  }
}

// 📌 Remove item in Firestore
async function removeFromDB(id: string | number) {
  try {
    const token = Cookies.get('token')
    if (!token) return
    await fetch(`${API_URL}/cart/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch (err) {
    console.error('❌ Remove item failed', err)
  }
}

// ----------------------------------
// Cart Actions (local + Firestore)
// ----------------------------------
function incrementQuantity(id: string | number) {
  cart.incrementQuantity(id)
  const item = cart.cartItems.find((i) => i.id === id)
  if (item)
    syncItem({
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: item.qty,
    })
}

function decrementQuantity(id: string | number) {
  cart.decrementQuantity(id)
  const item = cart.cartItems.find((i) => i.id === id)
  if (item && item.qty > 0) {
    syncItem({
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: item.qty,
    })
  } else {
    removeFromDB(id)
  }
}

function removeItem(id: string | number) {
  cart.removeItem(id)
  removeFromDB(id)
}

function money(n: number) {
  return `₹${n.toFixed(2)}`
}

const handleProductcartpath = () => {
  route.go(-1)
}

const toogleAdressModal = (): void => {
  isChecked.value = !isChecked.value
}

watch(isChecked, (newVal) => {
  if (newVal) {
    // Save current scroll
    scrollY.value = window.scrollY

    // Lock body
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.left = '0'
    document.body.style.right = '0'
    document.body.style.overflow = 'hidden'
    document.body.style.width = '100%' // prevent content shift
  } else {
    // Unlock body
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.left = ''
    document.body.style.right = ''
    document.body.style.overflow = ''
    document.body.style.width = ''

    // Restore scroll
    window.scrollTo(0, scrollY.value)
  }
})
</script>
