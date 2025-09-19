<script setup lang="ts">
import type { ICategorycard } from '@/models/Categorycard'
import { useProductStore } from '@/stores/products'
import { ref, onMounted, watch } from 'vue'
import ProductCard from './ProductCard.vue'
import filter from '@/composables/filter.ts'
const {filterCategory} = filter()
import type { ICard } from '@/models/Card'
const Productstore = useProductStore()
const Category = ref<ICategorycard[]>([])
const allProducts = ref<ICard[]>([])
const props = defineProps<{ selectedCategory?: string }>()
watch(
  () => props.selectedCategory, // getter so Vue tracks reactivity
  () => {
    const filterProducts = Category.value.filter((eachCategory: ICategorycard) => {
      if (props.selectedCategory === 'Sweet Tooth') {
        return eachCategory.name === 'Chocolates & Candies' || eachCategory.name === 'Indian Mithai'
      } else {
        return eachCategory.name === props.selectedCategory
      }
    })
    allProducts.value = filterProducts.flatMap((category) => category.products ?? [])
  },
)
watch(filterCategory,()=>{
  const cartProducts = Category.value.flatMap((category) => category.products ?? [])
  const query = filterCategory.value.trim().toLowerCase()
  const filterhomeProducts = cartProducts.filter(eachcategory =>
  !query || eachcategory.name?.toLowerCase().includes(query)
)
  allProducts.value = filterhomeProducts

})
onMounted(async () => {
  await Productstore.fetchProductList()
  Category.value = Productstore.productList.categories

  if (props.selectedCategory) {
    const filterProducts = Category.value.filter((eachCategory: ICategorycard) => {
      if (props.selectedCategory === 'Sweet Tooth') {
        return eachCategory.name === 'Chocolates & Candies' || eachCategory.name === 'Indian Mithai'
      } else {
        return eachCategory.name === props.selectedCategory
      }
    })
    allProducts.value = filterProducts.flatMap((category) => category.products ?? [])
  } else {
    const cartProducts = Category.value.flatMap((category) => category.products ?? [])
    allProducts.value = cartProducts.slice(0, 30)
  }

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

    <div class="grid gap-6 grid-cols-5">

      <ProductCard
        v-for="eachProductcard in allProducts"
        :key="eachProductcard.id"
        :products="eachProductcard"
      />
    </div>
  </div>
</template>

