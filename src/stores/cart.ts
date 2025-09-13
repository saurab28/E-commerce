import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export interface CartItem {
  id: string | number
  name: string
  price: number
  qty: number
  image?: string
  weight?: string | number
}

// A product you want to add, without the qty yet
type ProductForCart = Omit<CartItem, 'qty'>

export const useCart = defineStore('cart', () => {
  const cartItems = ref<CartItem[]>([])

  // ✅ Load saved cart from localStorage on init
  const savedCart = localStorage.getItem('cart')
  if (savedCart) {
    try {
      cartItems.value = JSON.parse(savedCart)
    } catch {
      cartItems.value = []
    }
  }

  // ✅ Persist cart to localStorage whenever it changes
  watch(
    cartItems,
    (newCart) => {
      localStorage.setItem('cart', JSON.stringify(newCart))
    },
    { deep: true }
  )

  function addItem(product: ProductForCart, quantity = 1) {
    const existingItem = cartItems.value.find((line) => line.id === product.id)
    if (existingItem) {
      existingItem.qty += quantity
    } else {
      cartItems.value.push({ ...product, qty: quantity })
    }
  }

  function updateQuantity(id: string | number, quantity: number) {
    const item = cartItems.value.find((line) => line.id === id)
    if (!item) return
    if (quantity <= 0) removeItem(id)
    else item.qty = quantity
  }

  function incrementQuantity(id: string | number) {
    const item = cartItems.value.find((line) => line.id === id)
    if (item) item.qty += 1
  }

  function decrementQuantity(id: string | number) {
    const item = cartItems.value.find((line) => line.id === id)
    if (!item) return
    item.qty -= 1
    if (item.qty <= 0) removeItem(id)
  }

  function removeItem(id: string | number) {
    cartItems.value = cartItems.value.filter((line) => line.id !== id)
  }

  function clearCart() {
    cartItems.value = []
  }

  const itemCount = computed(() =>
    cartItems.value.reduce((totalUnits, line) => totalUnits + line.qty, 0)
  )

  const cartTotal = computed(() =>
    cartItems.value.reduce(
      (totalAmount, line) => totalAmount + line.price * line.qty,
      0
    )
  )

  return {
    cartItems,
    addItem,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    removeItem,
    clearCart,
    itemCount,
    cartTotal,
  }
})
