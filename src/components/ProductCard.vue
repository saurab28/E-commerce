<script setup lang="ts">
import type { ICard } from '@/models/Card';

const props = defineProps<{ products: ICard }>()


</script>

<template>
  <div class="w-56  rounded-lg bg-white shadow-xl overflow-hidden">
    <!-- Product Image -->
    <img :src="props.products.image" :alt="props.products.name" class="w-full h-60 object-cover bg-gray-50" />

    <!-- Card Body -->
    <div class="p-3 ">
      <!-- Delivery Time -->
      <p class="text-xs text-green-600 font-medium mb-1">⏱ 8 MINS</p>

      <!-- Product Info -->
       <div>
         <h3 class="text-sm font-semibold text-gray-800 truncate w-full">{{ props.products.name }}</h3>
         <p class="text-xs text-gray-500">{{ props.products.weight }}</p>
       </div>
      
      <!-- Footer -->
      <div class="flex items-center justify-between mt-3">
        <span class="text-sm font-bold text-gray-900">{{ props.products.price }}</span>
        <button
          class="px-3 py-1 text-sm font-medium text-green-700 border border-green-700 rounded-md hover:bg-green-700 hover:text-white transition"
        >
          ADD
        </button>
      </div>
    </div>
  </div>
  <!-- <div class="grid grid-cols-3 gap-2 mb-8">
      <div v-for="{ products } in Category" class="contents">
        <ProductCard
          v-for="eachProductcard in products"
          :key="eachProductcard.id"
          :products="eachProductcard"
        />
      </div>
    </div> -->

</template>