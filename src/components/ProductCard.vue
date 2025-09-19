<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCart } from '@/stores/cart' // ← IMPORT the store
import type { ICard } from '@/models/Card'
import gsap from 'gsap'
import authorization from '@/composables/auth'
const cart = useCart() // ← CREATE the store instance
const props = defineProps<{ products: ICard }>()
const auth = authorization()

// Robustly parse prices like "₹507.63", "507,63", etc.
function parsePrice(p: unknown): number {
  if (typeof p === 'number') return p
  if (typeof p === 'string') {
    // keep digits, dots and commas, then unify commas to dots
    const cleaned = p.replace(/[^\d.,-]/g, '').replace(/,/g, '.')
    const n = Number(cleaned)
    return Number.isFinite(n) ? n : 0
  }
  return 0
}

console.log(props.products)
const inCartQty = computed(() => {
  const item = cart.cartItems.find((i) => i.id === props.products.id)
  return item ? item.qty : 0
})

function incrementQty() {
  cart.incrementQuantity(props.products.id)
}
function decrementQty() {
  cart.decrementQuantity(props.products.id)
}

const priceNumber = computed(() => parsePrice(props.products.price))
// const priceDisplay = computed(() =>
//   priceNumber.value > 0 ? `₹${priceNumber.value.toFixed(2)}` : '—',
// )

// prefer image → image_url; blank if none

// ✅ Popup logic
const popup = ref<HTMLElement | null>(null)

function showPopup(message: string) {
  if (!popup.value) return

  popup.value.innerText = message

  // Animate IN
  gsap.fromTo(
    popup.value,
    { y: 50, opacity: 0, pointerEvents: 'none' },
    { y: 0, opacity: 1, pointerEvents: 'auto', duration: 0.5, ease: 'power3.out' },
  )

  // Animate OUT after 2.5s
  setTimeout(() => {
    gsap.to(popup.value, {
      y: 50,
      opacity: 0,
      pointerEvents: 'none',
      duration: 0.5,
      ease: 'power3.in',
    })
  }, 2500)
}

function addToCart() {
  // Ensure you have an id; if your API lacks it, generate one
  cart.addItem(
    {
      id : props.products.id,
      name: props.products.name,
      price: Number(priceNumber.value),
      image: props.products.image,
      weight: props.products.weight,
    },
    1,
  )

  // 🎉 Trigger popup after adding
  showPopup('Product added to cart!')
}
</script>

<template>
  <div class="w-56 rounded-lg bg-white shadow-xl overflow-hidden">
    <!-- Image (blank area if missing) -->
    <img
      :src="props.products.image"
      :alt="props.products.name"
      class="w-full h-60 object-cover bg-gray-50"
    />


    <div class="p-3">
      <p class="text-xs text-green-600 font-medium mb-1">⏱ 8 MINS</p>

      <div>
        <h3 class="text-sm font-semibold text-gray-800 truncate w-full">
          {{ props.products.name }}
        </h3>
        <p v-if="props.products.weight" class="text-xs text-gray-500">
          {{ props.products.weight }}
        </p>
      </div>

      <div class="flex items-center justify-between mt-3">
        <span class="text-sm font-bold text-gray-900">{{ props.products.price }} </span>
        <div v-if="inCartQty > 0" class="flex items-center bg-green-600 text-white rounded-md py-1">
          <button @click="decrementQty" class="px-2 cursor-pointer">−</button>
          <span class="px-1">{{ inCartQty }}</span>
          <button @click="incrementQty" class="px-2 cursor-pointer">+</button>
        </div>

        <button
          v-else
          class="px-3 py-1 text-sm font-medium text-green-700 border border-green-700 rounded-md cursor-pointer transition"
          @click="addToCart"
        >
          ADD
        </button>
      </div>
    </div>
  </div>

  <!-- ✅ Popup Notification -->
  <div
    ref="popup"
    class="fixed bottom-6 right-6 bg-black shadow-xl rounded-xl px-6 py-4 text-md  text-white font-bold opacity-0 pointer-events-none z-50"
  >
    ✅ Item added to cart!
  </div>
</template>
