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
  const cartProducts = Category.value.flatMap((category) => category.products ?? [])
  allProducts.value = cartProducts.slice(0, 30)
  console.log(allProducts)
})
const loading = ref(true);
</script>

<template>
  <div v-if="Productstore.loading">
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div
        class="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"
      ></div>
    </div>
  </div>
  <div v-else-if="Productstore.error">{{ Productstore.error }}</div>
  <div class="container mx-auto px-[104px]">
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-2">
      <ProductCard
        v-for="eachProductcard in allProducts"
        :key="eachProductcard.id"
        :products="eachProductcard"
      />
    </div>
  </div>
</template>
