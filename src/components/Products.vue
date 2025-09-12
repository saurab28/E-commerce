<script setup lang="ts">
import type { ICategorycard } from '@/models/Categorycard'
import { useProductStore } from '@/stores/products'
import { ref, onMounted } from 'vue'
import ProductCard from './ProductCard.vue'
import type { ICard } from '@/models/Card'
const Productstore = useProductStore()
const Category = ref<ICategorycard[]>([])
const allProducts = ref<ICard[]>([])
onMounted(async () => {
  await Productstore.fetchProductList()
  Category.value = Productstore.productList.categories
  const cartProducts = Category.value.flatMap(category => category.products ?? [])
  allProducts.value = cartProducts.slice(0,30)
  console.log(Category.value)
})
</script>

<template>
  <div v-if="Productstore.loading">Loading...</div>
  <div v-else-if="Productstore.error">{{ Productstore.error }}</div>
  <div class="container mx-auto px-[104px]">
     <div class="grid gap-6 grid-cols-[repeat(auto-fit,minmax(220px,1fr))] " >
      <ProductCard
          v-for="eachProductcard in allProducts"
          :key="eachProductcard.id"
          :products="eachProductcard"
        />
     </div>
  </div>
</template>
