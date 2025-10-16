<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Header from './Header.vue'
import Checkbox from './Checkbox.vue'
import Products from './Products.vue'

const route = useRoute<'products'>()
const selectedCategory = ref<string>(route.params.title as string)
watch(
  () => route.params.title,
  (newVal) => {
    selectedCategory.value = newVal as string
  },
)
</script>

<template>
  <Header :param="route.params.title as string" />
  <div class="flex relative p-5">
    <div class="w-64 flex-shrink-0">
      <div class="sticky top-[93px] p-4 bg-amber-50 shadow">
        <Checkbox v-model="selectedCategory" />
      </div>
    </div>

    <div class="flex-1">
      <Products  :selectedCategory="selectedCategory as string" />
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

@media (max-width: 1100px) {
  .container {
    padding-left: 0;
    padding-right: 0;
  }
  .flex {
    flex-direction: column;
    flex-wrap: nowrap;
    gap: 12px;
    padding: 12px;
  }

  .w-64 {
    width: 100%;
    margin-bottom: 12px;
    position: static;
  }
  .flex-1 {
    width: 100%;
    padding: 6px 0;
  }
}

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
