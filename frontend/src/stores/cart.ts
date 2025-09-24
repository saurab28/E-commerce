import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { ICard } from '@/models/Card'

interface CartItem {
  id: string | number
  name: string
  price: number | string
  image?: string
  weight?: string | number
  qty: number
}

// A product you want to add, without the qty yet
// type ProductForCart = Omit<CartItem, 'qty'>

export const useCart = defineStore('cart', () => {
  const cartItems = ref<CartItem[]>(JSON.parse(localStorage.getItem('cart') || '[]'))

  // ✅ Load saved cart from localStorage on init
  // const savedCart = localStorage.getItem('cart')
  // if (savedCart) {
  //   try {
  //     cartItems.value = JSON.parse(savedCart)
  //   } catch {
  //     cartItems.value = []
  //   }
  // }

  // ✅ Persist cart to localStorage whenever it changes
  watch(
    cartItems,
    (newCart) => {
      localStorage.setItem('cart', JSON.stringify(newCart))
    },
    { deep: true },
  )

  function addItem(product: ICard, quantity = 1) {
    // const existingItem = cartItems.value.find((line) => line.id === product.id)
    // if (existingItem) {
    //   existingItem.qty += quantity
    // } else {
    //   cartItems.value.push({ ...product, qty: quantity })
    // }
    cartItems.value.push({ ...product, qty: quantity })
  }

  // function updateQuantity(id: string | number, quantity: number) {
  //   const item = cartItems.value.find((line) => line.id === id)
  //   if (!item) return
  //   if (quantity <= 0) removeItem(id)
  //   else item.qty = quantity
  // }

  function incrementQuantity(id: string | number) {
    const item = cartItems.value.find((eachItem) => eachItem.id === id)
    if (item) item.qty += 1
  }

  function decrementQuantity(id: string | number) {
    const item = cartItems.value.find((eachItem) => eachItem.id === id)
    // if (!item) return
    // item.qty -= 1
    // if (item.qty <= 0) removeItem(id)
    if (item) {
      if (item.qty > 0) {
        item.qty -= 1
      } else {
        removeItem(id)
      }
    }
  }

  function removeItem(id: string | number) {
    cartItems.value = cartItems.value.filter((eachItem) => eachItem.id !== id)
  }

  function clearCart() {
    cartItems.value = []
  }

  // 🔥 NEW: Replace entire cart (used when syncing from Firestore)
  function setCart(newCart: CartItem[]) {
    cartItems.value = [...newCart]
  }

  const itemCount = computed(() =>
    cartItems.value.reduce((totalUnits, eachItem) => totalUnits + eachItem.qty, 0),
  )

  const cartTotal = computed(() =>
    cartItems.value.reduce(
      (totalAmount, eachItem) => totalAmount + (eachItem.price as number) * eachItem.qty,
      0,
    ),
  )

  return {
    cartItems,
    addItem,
    incrementQuantity,
    decrementQuantity,
    removeItem,
    clearCart,
    setCart,
    itemCount,
    cartTotal,
  }
})
