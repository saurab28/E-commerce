<script setup lang="ts">
import type { ICategorycard } from '@/models/Categorycard'
import { useProductStore } from '@/stores/products'
import { ref, onMounted, watch } from 'vue'
import ProductCard from './ProductCard.vue'
import filter from '@/composables/filter.ts'
const { filterCategory } = filter()
import type { ICard } from '@/models/Card'
const Productstore = useProductStore()
const Category = ref<ICategorycard[]>([])
const allProducts = ref<ICard[]>([])
const props = defineProps<{ selectedCategory?: string }>()
watch(
  () => props.selectedCategory,
  () => {
    const filterProducts = Category.value.filter((eachCategory: ICategorycard) => {
      if (props.selectedCategory === 'Sweet Tooth') {
        return eachCategory.name === 'Chocolates & Candies' || eachCategory.name === 'Indian Mithai'
      } else if (props.selectedCategory === 'All Categories') {
        return eachCategory.name
      } else {
        return eachCategory.name === props.selectedCategory
      }
    })
    allProducts.value = filterProducts.flatMap((category) => category.products ?? [])
  },
)
watch(filterCategory, () => {
  const cartProducts = Category.value.flatMap((category) => category.products ?? [])
  const query = filterCategory.value.trim().toLowerCase()
  const filterhomeProducts = cartProducts.filter(
    (eachcategory) => !query || eachcategory.name?.toLowerCase().includes(query),
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
// const loading = ref(true)
</script>

<template>
  <div v-if="Productstore.loading">
    <div class="flex justify-center items-center h-64">
      <div
        class="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"
      ></div>
    </div>
  </div>
  <div v-else-if="Productstore.error">{{ Productstore.error }}</div>
  <div class="container mx-auto">
    <div class="grid gap-6 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
      <div  v-for="eachProductcard in allProducts">

            <ProductCard :key="eachProductcard.id" :products="eachProductcard"/>
        
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
  box-sizing: border-box;
}

.grid {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(4, 1fr); /* 4 columns for laptop/desktop */
  box-sizing: border-box;
}

/* Tablets: 3 columns */
@media (max-width: 1104px) {
  .container {
    padding-left: 24px;
    padding-right: 24px;
  }
  .grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    justify-items: center;
  }
}

/* Phones: 2 columns */
@media (max-width: 768px) {
  .container {
    padding-left: 16px;
    padding-right: 16px;
  }
  .grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    justify-items: center;
  }
}

/* Small phones */
@media (max-width: 540px) {
  .container {
    padding-left: 12px;
    padding-right: 12px;
  }
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    justify-items: center;
  }
}
</style>
