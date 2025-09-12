<script setup lang="ts">
import { ref } from "vue";

const categories = ref([
  { name: "Fruits & Vegetables", products: [] },
  { name: "Cold Drinks & Juices", products: [] },
  { name: "Beverages", products: [] },
  { name: "Foodgrains, Oil & Masala", products: [] },
  { name: "Bakery, Cakes & Dairy", products: [] },
  { name: "Snacks & Branded Foods", products: [] },
  { name: "Eggs, Meat & Fish", products: [] },
  { name: "Gourmet & World Food", products: [] },
  { name: "Baby Care", products: [] },
  { name: "Cleaning & Household", products: [] },
  { name: "Beauty & Hygiene", products: [] },
  { name: "Kitchen, Garden & Pets", products: [] },
  { name: "Chocolates & Candies", products: [] },
  { name: "Dry Fruits", products: [] },
  { name: "Indian Mithai", products: [] },
]);

// keep track of selected categories
const selected = ref<string[]>([]);
</script>

<template>
  <div>
    <h2 class="font-bold mb-2">Categories</h2>
    <ul>
      <li v-for="(category, index) in categories" :key="index" class="mb-2">
        <label class="flex items-center gap-2">
          <!-- checkbox -->
          <input
            type="checkbox"
            :value="category.name"
            v-model="selected"
          />
          <!-- router link -->
          <RouterLink
            class="text-blue-500 hover:underline"
            :to="{ name: 'products', params: { title: category.name } }"
          >
            {{ category.name }}
          </RouterLink>
        </label>
      </li>
    </ul>

    <!-- show selected categories -->
    <div class="mt-4">
      <h3 class="font-semibold">Selected:</h3>
      <p>{{ selected }}</p>
    </div>
  </div>
</template>

