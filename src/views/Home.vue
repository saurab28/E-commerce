<script setup lang="ts">
import Categories from '../components/Categories.vue'
import Products from '@/components/Products.vue'
import Header from '@/components/Header.vue'
import BannerView from '@/components/BannerView.vue'
import Location from '@/components/Location.vue'
import {ref} from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLocationModal = ref(false)
const currentLocation = ref('Hyderabad, Telangana')
const toggleLocationModal = () => {
  isLocationModal.value = !isLocationModal.value
}

const handleSearch = () => {
  router.push('/search')
}
</script>

<template>
  <Header class="mb-5" />

  <!-- <div
    class=" md:hidden items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
    @click="toggleLocationModal"
  >
    <i class="ri-map-pin-line text-green-600 text-lg"></i>
    <div class="flex flex-col">
      <span class="text-xs text-gray-500">Deliver to</span>
      <span class="text-sm font-semibold text-gray-800 truncate max-w-32">
        {{ currentLocation }}
      </span>
    </div>
    <i class="ri-arrow-down-s-line text-gray-400"></i>
  </div>
  <Location
    v-if="isLocationModal"
    class="absolute top-[96px]"
    @update:address="currentLocation = $event"
    @close="isLocationModal = false"
  /> -->

  <!-- Mobile-only Search Bar -->
  <div class="flex justify-center">
    <div class="relative block lg:hidden mb-5">
      <input
        type="text"
        placeholder="Search what you want"
        class="w-[340px] bg-gray-50 border-0 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-green-500 focus:bg-white transition-all"
        readonly
        @click="handleSearch"
      />
      <i class="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"></i>
    </div>
  </div>

  <BannerView />
  <Categories />
  <Products />
</template>

<style scoped>
@media (max-width: 385px) {
  .w-\[340px\] {
    width: 90%;
  }
}
</style>
