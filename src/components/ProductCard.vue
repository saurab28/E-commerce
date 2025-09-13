<template>
  <div
    class="w-full rounded-lg bg-white shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
  >
    <!-- Product Image -->
    <img
      :src="props.products.image"
      :alt="props.products.name"
      class="w-full h-28 sm:h-40 md:h-48 object-cover bg-gray-50"
    />

    <!-- Card Body -->
    <div class="p-2 sm:p-3">
      <!-- Delivery Time -->
      <p class="text-[10px] sm:text-xs text-green-600 font-medium mb-1">⏱ 8 MINS</p>

      <!-- Product Info -->
      <h3 class="text-xs sm:text-sm font-semibold text-gray-800 truncate">
        {{ props.products.name }}
      </h3>
      <p class="text-[10px] sm:text-xs text-gray-500">{{ props.products.weight }}</p>

      <!-- Footer -->
      <div class="flex items-center justify-between mt-2">
        <span class="text-xs sm:text-sm font-bold text-gray-900">
          {{ props.products.price }}
        </span>
        <button
          class="px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-medium text-green-700 border border-green-700 rounded-md hover:bg-green-700 hover:text-white transition"
        >
          ADD
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ICard } from '@/models/Card';

const props = defineProps<{ products: ICard }>();
</script>
