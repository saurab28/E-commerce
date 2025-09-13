<script setup lang="ts">
import { computed } from 'vue'
import { useCart } from '@/stores/cart'          // ← IMPORT the store
import type { ICard } from '@/models/Card'

const cart = useCart()                            // ← CREATE the store instance
const props = defineProps<{ products: ICard }>()

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

const inCartQty = computed(() => {
  const item = cart.cartItems.find(i => i.id === props.products.id)
  return item ? item.qty : 0
})

function incrementQty() {
  cart.incrementQuantity(props.products.id)
}
function decrementQty() {
  cart.decrementQuantity(props.products.id)
}

const priceNumber = computed(() => parsePrice(props.products.price))
const priceDisplay = computed(() =>
  priceNumber.value > 0 ? `₹${priceNumber.value.toFixed(2)}` : '—'
)

// prefer image → image_url; blank if none
const imageSrc = computed(
  () => props.products.image ?? (props as any).products?.image_url ?? ''
)

function addToCart() {
  // Ensure you have an id; if your API lacks it, generate one
  const id = (props.products.id ?? props.products.name) as string | number
  cart.addItem(
    {
      id,
      name: props.products.name ?? 'Unnamed',
      price: priceNumber.value,
      image: imageSrc.value || undefined,
      weight: props.products.weight || undefined
    },
    1
  )
}
</script>

<template>
  <div class="w-56 rounded-lg bg-white shadow-xl overflow-hidden">
    <!-- Image (blank area if missing) -->
    <img
      v-if="imageSrc"
      :src="imageSrc"
      :alt="props.products.name"
      class="w-full h-60 object-cover bg-gray-50"
    />
    <div v-else class="w-full h-60 bg-gray-100"></div>

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
        <span class="text-sm font-bold text-gray-900">{{ priceDisplay }}</span>
        <div v-if="inCartQty > 0" class="flex items-center bg-green-600 text-white rounded-md  py-1 ">
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
  </template>

