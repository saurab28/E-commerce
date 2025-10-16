<script setup lang="ts">
import { ref } from 'vue'
import Header from '@/components/Header.vue'
import { useRoute } from 'vue-router'
import Products from '@/components/Products.vue'
import filter from '@/composables/filter.ts'

const route = useRoute()
const path = ref<string>(route.path)

const { filterCategory } = filter()
</script>

<template>
  <Header :param="path" class="mb-5" />

  <div class="w-full relative block sm:hidden mb-5">
    <input
      type="text"
      v-model="filterCategory"
      placeholder="Search what you want"
      class="w-full bg-gray-50 border-0 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-green-500 focus:bg-white transition-all"
    />
    <i class="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"></i>
  </div>

  <div class="p-5">
    <Products />
  </div>
</template>
