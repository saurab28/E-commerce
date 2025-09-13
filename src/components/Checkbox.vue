<script setup lang="ts">
import { ref } from "vue";
const model = defineModel<string>()

const categories = ref([
  { name: "Fruits & Vegetables"},
  { name: "Cold Drinks & Juices"},
  { name: "Beverages"},
  { name: "Foodgrains, Oil & Masala"},
  { name: "Bakery, Cakes & Dairy"},
  { name: "Snacks & Branded Foods"},
  { name: "Eggs, Meat & Fish"},
  { name: "Gourmet & World Food"},
  { name: "Baby Care"},
  { name: "Cleaning & Household"},
  { name: "Beauty & Hygiene"},
  { name: "Kitchen, Garden & Pets"},
  { name: "Chocolates & Candies"},
  { name: "Dry Fruits"},
  { name: "Indian Mithai"},
]);

// keep track of selected categories
const selected = ref<string | null>();
</script>

<template>
  <div >
    <h2 class="font-bold mb-2">Categories</h2>
    <ul>
      <li v-for="(category, index) in categories" :key="index" class="mb-2">
          <!-- checkbox -->
          <!-- router link -->
          
          <div class="flex items-center gap-2">
            <label>
            <input
            type="checkbox"
            :checked="model === category.name"
            @change="model = category.name"
            />
            {{ category.name }} 
            </label>
          </div>
          
        
      </li>
    </ul>

    
  </div>
</template>

