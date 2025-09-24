<script setup lang="ts">
import Categories from '../components/Categories.vue';
import Products from '@/components/Products.vue';
import Header from '@/components/Header.vue';
import BannerView from '@/components/BannerView.vue';

 import { useRouter } from 'vue-router'

const router = useRouter()

const handleSearch = () => {
  router.push('/search')
}

</script>

<template>
  <Header class="mb-5" />

  <!-- Mobile-only Search Bar -->
  <div class="w-full relative block sm:hidden mb-5">
    <input
      type="text"
      placeholder="Search what you want"
      class="w-full bg-gray-50 border-0 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-green-500 focus:bg-white transition-all"
      readonly
      @click="handleSearch"
    />
    <i
      class="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
    ></i>
  </div>

  <BannerView />
  <Categories />
  <Products />
</template>

