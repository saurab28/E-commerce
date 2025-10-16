<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
const model = defineModel<string>()

const categories = ref([
  { name: 'All Categories' },
  { name: 'Fruits & Vegetables' },
  { name: 'Cold Drinks & Juices' },
  { name: 'Beverages' },
  { name: 'Foodgrains, Oil & Masala' },
  { name: 'Bakery, Cakes & Dairy' },
  { name: 'Snacks & Branded Foods' },
  { name: 'Eggs, Meat & Fish' },
  { name: 'Gourmet & World Food' },
  { name: 'Baby Care' },
  { name: 'Cleaning & Household' },
  { name: 'Beauty & Hygiene' },
  { name: 'Kitchen, Garden & Pets' },
  { name: 'Chocolates & Candies' },
  { name: 'Dry Fruits' },
  { name: 'Indian Mithai' },
])
</script>

<template>
  <div>
    <h2 class="font-bold mb-2 text-lg">Categories</h2>
    <ul>
      <li v-for="(category, index) in categories" :key="index" class="mb-2">
        <router-link :to="{ name: 'products', params: { title: category.name } }">
          <div class="flex items-center gap-2 font-sans text-lg">
            <label>
              <input
                type="checkbox"
                :checked="model === category.name"
                @change="model = category.name"
              />
              {{ category.name }}
            </label>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<style scoped>
h2 {
  font-size: 18px;
}
ul {
  list-style: none;
  padding: 0;
}
label {
  font-size: 14px;
}

@media (max-width: 768px) {
  h2 {
    font-size: 16px;
  }
  label {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  h2 {
    font-size: 15px;
  }
  label {
    font-size: 12px;
  }
}
</style>
