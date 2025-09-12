<template>
  <div class="relative w-full bg-white py-6">
    <!-- Title -->
    <div class="text-center pb-5">
      <h1 class="font-bold text-3xl">Our Categories</h1>
    </div>

    <!-- Wrapper with arrows -->
    <div class="relative flex items-center">
      <!-- Left Arrow -->
      <button
        @click="scrollLeft"
        
        class="absolute left-0 z-10 bg-white shadow-xl rounded-full hover:bg-gray-100 ml-3 pl-3 pt-2 pb-2 pr-3"
      >
        <i class="ri-arrow-left-s-line text-2xl"></i>
      </button>

      <!-- Scrollable Carousel -->
      <div
        ref="carousel"
        class="flex gap-12 overflow-x-auto scroll-smooth no-scrollbar px-12"
      >
        <div
          v-for="(item, index) in items"
          :key="index"
          class="flex-shrink-0 w-37 flex flex-col items-center text-center cursor-pointer group"
        >
          <!-- Image -->
          <img
            :src="item.image"
            :alt="item.title"
            class="w-52 h-50 object-contain group-hover:scale-110 transition-transform duration-300"
          />
          
        </div>
      </div>

      <!-- Right Arrow -->
      <button
        @click="scrollRight"
        class="absolute right-0 z-10 rounded-full bg-white shadow-xl hover:bg-gray-100 mr-3 pl-3 pt-2 pb-2 pr-3"
      >
        <i class="ri-arrow-right-s-line text-2xl"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"

const items = [
  { title: "Fruits & Vegetables", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,w=270/layout-engine/2022-11/Slice-3_9.png" },
  {title: "Cold Drinks & Juices", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-4_9.png"},
  { title: "Dairy, Bread & Eggs", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,w=270/layout-engine/2022-11/Slice-2_10.png" },
  { title: "Meat, Fish & Eggs", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,w=270/layout-engine/2022-11/Slice-13.png" },
  { title: "Masala & Oil", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,w=270/layout-engine/2022-11/Slice-11.png" },
  { title: "Breakfast & Sauces", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,w=270/layout-engine/2022-11/Slice-12.png" },
  { title: "Atta, Rice & Dal", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,w=270/layout-engine/2022-11/Slice-10.png" },
  { title: "Snacks & Branded Foods", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-5_4.png" },
  { title: "Tea, Coffee & More", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,w=270/layout-engine/2022-11/Slice-9_3.png" },
  { title: "Cleaning Essentials", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-17.png" },

]

const carousel = ref(null)

const scrollLeft = () => {
  carousel.value.scrollBy({ left: -300, behavior: "smooth" })
}

const scrollRight = () => {
  carousel.value.scrollBy({ left: 300, behavior: "smooth" })
}
</script>

<style scoped>
/* Hide scrollbar but keep scroll functionality */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;  /* IE/Edge */
  scrollbar-width: none;     /* Firefox */
}
</style>
