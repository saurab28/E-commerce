<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Header from './Header.vue'
import Checkbox from './Checkbox.vue'
import Products from './Products.vue'


const route = useRoute<'products'>()
const selectedCategory = ref<string>(route.params.title as string)
console.log(selectedCategory.value)
watch(selectedCategory,()=>{
    // console.log(selectedCategory.value)
})
</script>
<template>
  <Header :param="route.params.title as string" />
  <div class="flex relative p-5">
    <div class="w-64 flex-shrink-0">
      <div class="sticky top-0 p-4 bg-amber-50 shadow">
        <Checkbox v-model="selectedCategory" />
      </div>
    </div>

    <!-- Products Section -->
    <div class="flex-1 p-5">
      <Products :selectedCategory="route.params.title as string"/>
    </div>
  </div>



</template>
