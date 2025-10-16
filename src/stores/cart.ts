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

export const useCart = defineStore('cart', () => {
  const cartItems = ref<CartItem[]>(JSON.parse(localStorage.getItem('cart') || '[]'))

  watch(
    cartItems,
    (newCart) => {
      localStorage.setItem('cart', JSON.stringify(newCart))
    },
    { deep: true },
  )

  function addItem(product: ICard, quantity = 1) {
    cartItems.value.push({ ...product, qty: quantity })
  }

  function incrementQuantity(id: string | number) {
    const item = cartItems.value.find((eachItem) => eachItem.id === id)
    if (item) item.qty += 1
  }

  function decrementQuantity(id: string | number) {
    const item = cartItems.value.find((eachItem) => eachItem.id === id)

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
