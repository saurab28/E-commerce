import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ICategorycard } from '@/models/Categorycard'
type ProductCard = {
  categories : ICategorycard[]
  title :string
}

export const useProductStore = defineStore('product', () => {
  const productList = ref<ProductCard>({categories : [] , title : "" })
  const loading = ref<boolean>(true)
  const error = ref<string | null>(null)
  async function fetchProductList() {
    try {
      const res = await fetch('https://apis2.ccbp.in/nxt-mart/category-list-details')
      if (!res.ok) throw new Error('Failed to fetch products')
      productList.value = await res.json()
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return { productList, loading, error, fetchProductList }
})
