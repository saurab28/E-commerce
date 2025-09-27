<template>
  <div class="relative  bg-white py-6 container mx-auto px-[104px] ">
    <!-- Title -->
    <div class="text-center pb-5">
      <h1 class="font-bold text-2xl sm:text-3xl">Our Categories</h1>
    </div>

    <!-- Wrapper with arrows -->
    <div class="relative flex items-center">
      <!-- Left Arrow -->
      <button
        @click="scrollLeft"
        class="absolute left-0 z-10 bg-white shadow-xl rounded-full hover:bg-gray-100 ml-2 sm:ml-3 p-2 sm:p-3"
      >
        <i class="ri-arrow-left-s-line text-lg sm:text-2xl"></i>
      </button>

      <!-- Scrollable Carousel -->
      <div
        ref="carousel"

        class="flex  gap-6 overflow-x-auto overflow-y-hidden scroll-smooth no-scrollbar px-12 pt-3 "

      >
        <div
          v-for="(item, index) in items"
          :key="index"

          class="flex-shrink-0 w-37 flex flex-col items-center text-center cursor-pointer group "
        >

           <RouterLink  :to="{ name: 'products', params: { title: item.title } }">

             <img
               :src="item.image"
               :alt="item.title"
               class="w-52 h-50 object-contain group-hover:scale-110 transition-transform duration-300  object-bottom"
             />
           </RouterLink>



        </div>
      </div>

      <!-- Right Arrow -->
      <button
        @click="scrollRight"
        class="absolute right-0 z-10 bg-white shadow-xl rounded-full hover:bg-gray-100 mr-2 sm:mr-3 p-2 sm:p-3"
      >
        <i class="ri-arrow-right-s-line text-lg sm:text-2xl"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { RouterLink } from "vue-router"

const items = [
  { title: "Fruits & Vegetables", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,w=270/layout-engine/2022-11/Slice-3_9.png" },
  {title: "Cold Drinks & Juices", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-4_9.png"},
  { title: "Bakery, Cakes & Dairy", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,w=270/layout-engine/2022-11/Slice-2_10.png" },
  { title: "Eggs, Meat & Fish", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,w=270/layout-engine/2022-11/Slice-13.png" },
  { title: "Foodgrains, Oil & Masala", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,w=270/layout-engine/2022-11/Slice-11.png" },
  { title: "Beauty & Hygiene", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-19.png" },
  { title: "Snacks & Branded Foods", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-5_4.png" },
  { title: "Beverages", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,w=270/layout-engine/2022-11/Slice-9_3.png" },
  { title: "Sweet Tooth", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-7_3.png" },
  {title:"Gormet & World Food", image:"https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-6_5.png"},
  { title: "Cleaning & Houshold", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-17.png" },
  { title: "Baby Care", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-15.png" },
  { title: "Dry Fruits", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-14.png" },
  { title: "Kitchen, Garden & Pets", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-20.png" },
]

const carousel = ref(null)

const scrollLeft = () => {
  carousel.value.scrollBy({ left: -250, behavior: "smooth" })
}

const scrollRight = () => {
  carousel.value.scrollBy({ left: 250, behavior: "smooth" })
}
</script>





<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Responsive tweaks for tablets and laptops (unchanged) */
@media (max-width: 1024px) {
  h1 {
    font-size: 20px;
  }
  img {
    width: 120px;
    height: auto;
  }
  .flex.gap-12 {
    gap: 2rem;
    padding: 0 2rem;
  }
   .container {
    padding-left: 0.8rem !important;
    padding-right: 0.8rem !important;
  }
}

/* Phone responsive adjustments */
@media (max-width: 560px) {
  h1 {
    font-size: 18px;
  }
  img {
    width: 80px;
  }
  .flex.gap-6 {
    gap: 0.5rem;
    padding: 0 1rem;
  }

  .container {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }


  button.absolute {
    padding: 0.5rem !important;
  }

  /* Prevent images from being too large inside flex-shrink container */
  .flex-shrink-0.w-37 {
    width: 100px !important;
  }

  /* Reduce carousel padding inside scrollable for better fit */
  .flex.gap-6.px-12.pt-3 {
    padding-left: 0.5rem !important;
    padding-right: 0.5rem !important;
  }
}

/* @media (max-width: 400px) {
  .container {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  .flex.gap-6.px-12.pt-3 {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
}

@media (max-width: 370px) {
  .container {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  .flex.gap-6.px-12.pt-3,
  .flex.gap-12,
  .flex.gap-6 {
    padding-left: 0 !important;
    padding-right: 0 !important;
    gap: 0.4rem !important;
  }
  .flex-shrink-0.w-37 {
    width: 94px !important;
    max-width: 100%;
  }
  button.absolute {
    padding: 0.3rem !important;
    min-width: 2rem !important;
    min-height: 2rem !important;
  }
  img {
    width: 85px !important;
    height: auto;
  }
} */


</style>
