<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Header from './Header.vue'
import Checkbox from './Checkbox.vue'
import Products from './Products.vue'

const route = useRoute<'products'>()
const { params } = useRoute()
const selectedCategory = ref<string>(params.title as string)
watch(selectedCategory, () => {
  console.log(selectedCategory.value)
})
</script>

<template>
  <!-- Wrap entire page inside container for consistent padding & centering -->
  <div class="w-full">
    <Header :param="params.title as string" />
    <div class="flex relative p-5">
      <div class="w-64 flex-shrink-0">
        <div class="sticky top-0 p-4 bg-amber-50 shadow">
          <Checkbox v-model="selectedCategory" />
        </div>
      </div>

      <!-- Products Section -->
      <div class="flex-1 p-5">
        <Products :selectedCategory="selectedCategory" />
      </div>
    </div>
  </div>
</template>


<style scoped>
.container {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 24px;
  padding-right: 24px;
  box-sizing: border-box;
}

.flex {
  display: flex;
  position: relative;
  padding: 20px;
  gap: 16px;
  flex-wrap: nowrap;
}

.w-64 {
  width: 256px;
  flex-shrink: 0;
}

.flex-1 {
  flex: 1 1 auto;
  padding: 20px;
}

/* Tablet (<= 1024px) */
@media (max-width: 1100px) {
  .container {
    padding-left: 0;  
    padding-right: 0; 
  }
  .flex {
    flex-direction: column;
    flex-wrap:nowrap;
    gap: 12px;
    padding: 12px;
  }

  .w-64 {
    width: 100%;
    margin-bottom:12px;
    position:static;     
  }
  .flex-1 {
    width:100%;
    padding: 6px 0;  
  }
}

/* Mobile (<= 768px) */
@media (max-width: 768px) {
  .flex {
    flex-direction: column;
    flex-wrap: nowrap;
    gap: 12px;
    padding: 12px;     
  }
  .w-64 {
    width: 100%;
    margin-bottom: 6px;
    position: static; 
  }
  .flex-1 {
    width: 100%;
    padding: 6px 0;
  }
}
</style>
