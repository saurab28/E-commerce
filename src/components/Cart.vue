<!-- src/components/Cart.vue -->
<template>
  <Header :param="routepath.path"/>
  <div  class="min-h-screen bg-gray-100 py-10">
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


        <div >
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
                  class="grid grid-cols-[1fr_160px_140px_160px_32px] items-center pb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200"
                >
                  <div class="text-left">Product</div>
                  <div class="text-right pr-3 ">Price</div>
                  <div class="text-center">Qty</div>
                  <div class="text-right pl-3">Total</div>
                  <div></div>
                </div>

                <!-- Rows -->
                <div
                  v-for="line in cart.cartItems"
                  :key="line.id"
                  class="grid grid-cols-[1fr_160px_140px_160px_32px] gap-4 items-center py-6 border-b border-gray-200"
                >
                  <!-- product cell -->
                  <div class="flex items-center gap-4">
                    <img
                      v-if="line.image"
                      class="w-16 h-16 rounded-md object-contain bg-gray-50"
                      :src="line.image"
                      :alt="line.name"
                    />
                    <div v-else class="w-16 h-16 rounded-md bg-gray-100"></div>

                    <div class="flex items-center gap-2 max-w-[220px] truncate">
                      <div class="text-gray-900 font-semibold truncate">{{ line.name }}</div>
                      <div class="text-gray-400 text-sm ">{{ line.weight }}</div>
                    </div>
                  </div>

                  <!-- price -->
                  <div class="text-right font-semibold text-gray-900 text-base">
                    {{ money(line.price) }}
                  </div>

                  <!-- qty -->
                  <div class="flex items-center justify-center">
                    <div
                      class="inline-flex items-center rounded-full border border-gray-300 overflow-hidden"
                    >
                      <button
                        class="px-3 py-1 text-lg cursor-pointer"
                        @click="decrementQuantity(line.id)"
                      >
                        −
                      </button>
                      <div class="w-10 text-center font-semibold">
                        {{ line.qty }}
                      </div>
                      <button
                        class="px-3 py-1 text-lg cursor-pointer"
                        @click="incrementQuantity(line.id)"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <!-- total -->
                  <div class="text-right font-semibold text-gray-900">
                    {{ money(line.price * line.qty) }}
                  </div>

                  <!-- remove -->
                  <button
                    class="text-gray-400 hover:text-gray-600 text-xl cursor-pointer"
                    @click="removeItem(line.id)"
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
                    @click="startPayment"
                  >
                    <span>Checkout</span>
                    <span
                      class="rounded-full px-3 py-1 text-sm"
                      >{{ money(total) }}</span
                    >
                  </button>
                  <button
                    class="mt-4 w-full rounded-full bg-rose-500 text-white font-semibold py-3 shadow hover:bg-rose-600 flex items-center justify-between px-4 cursor-pointer"
                    v-else
                    @click="toogleModal"
                  >
                    <span>Login to Proceed</span>
                    <span
                      class="rounded-full px-3 py-1 text-sm"
                      >{{ money(total) }}</span
                    >
                  </button>

                </div>
              </div>
            </div>
          </div>



        </div>



      <!-- /card -->
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref, computed, watch, toRef,toRefs} from 'vue'
import Header from './Header.vue'
import { useCart } from '@/stores/cart'
import { useRouter, useRoute } from 'vue-router'
import authorization from '@/composables/auth'
import loginModal from '@/composables/loginmodal'

const cart = useCart()
const route = useRouter()
const routepath = useRoute()
const auth = authorization()
const {isLoggedIn,checkAuthorization} = auth
const {toogleModal} = loginModal()



const shipping = ref<'pickup' | 'delivery'>('pickup')
const shippingCost = computed(() => (shipping.value === 'delivery' ? 9.9 : 0))

const subtotal = computed(() => cart.cartTotal)
const total = computed(() =>
  Number((subtotal.value + shippingCost.value).toFixed(2))
)

function incrementQuantity(id: string | number) {
  cart.incrementQuantity(id)
}
function decrementQuantity(id: string | number) {
  cart.decrementQuantity(id)
}
function removeItem(id: string | number) {
  cart.removeItem(id)
}
function money(n: number) {
  return `₹${n.toFixed(2)}`
}

const handleProductcartpath = () => {
  route.go(-1)

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
    cart.clearCart() // optional: empty cart after payment
  } else {
    alert(' Payment Verification Failed')
  }
}
</script>
