<template>
  <div class="overflow-hidden relative w-full bg-white py-4">
    <!-- Carousel wrapper -->
    <div
      class="flex gap-6 animate-scroll"
      :style="{ animationDuration: duration + 's' }"
    >
      <div
        v-for="(item, index) in items.concat(items)" 
        :key="index"
        class="flex-shrink-0 w-32 flex flex-col cursor-pointer"
      >
        <img
          :src="item.image"
          :alt="item.title"
          class="w-24 h-24 object-contain rounded-xl shadow"
        />
        <!-- <span class="mt-2 text-sm font-medium text-gray-700">{{ item.title }}</span> -->
      </div>
    </div>
  </div>
</template>

<script setup>
const items = [
  { title: "Fruits & Vegetables", image: "https://cdn.zeptonow.com/production/cms/category/38047553-95f3-47c6-a1ff-4794e1227d3a.png" },
  { title: "Dairy, Bread & Eggs", image: "https://cdn.zeptonow.com/production/cms/category/474e6e58-1894-4378-86f1-168cc7266d1a.png" },
  { title: "Atta, Rice, Oil & Dals", image: "https://cdn.zeptonow.com/production/cms/category/dc4a299d-521f-4a64-8205-c5ba8e1d13e3.png" },
  { title: "Meat, Fish & Eggs", image: "https://cdn.zeptonow.com/production/cms/category/1237afd6-40bf-4942-a266-25f23025e86c.png" },
  { title: "Masala & Dry Fruits", image: "https://cdn.zeptonow.com/production/cms/category/8d4d3977-5197-49d9-9867-8a670524e48b.png" },
  { title: "Breakfast & Sauces", image: "https://cdn.zeptonow.com/production/cms/category/ab241d87-da5b-4830-b38f-1a6cd30d0d41.png" },
  { title: "Packaged Food", image: "https://cdn.zeptonow.com/production/cms/category/3b0ce887-3b38-4450-b7da-9da0ad8b799d.png" },
//   { title: "Zepto Cafe", image: "cafe.png" },
  { title: "Tea, Coffee & More", image: "https://cdn.zeptonow.com/production/cms/category/f078a8dc-a9b6-41a6-9c6f-721d4892b8ee.png" },
  { title: "Ice Creams & More", image: "https://cdn.zeptonow.com/production/cms/category/db346f5e-644f-426a-85af-92d707e086ac.png" },
  { title: "Frozen Food", image: "https://cdn.zeptonow.com/production/cms/category/366e5b7d-2028-4935-b9f1-75bfa085c3d7.png" }
]

// Animation speed (bigger = slower)
const duration = 30
</script>

<style scoped>
@keyframes scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

.animate-scroll {
  display: flex;
  animation: scroll linear infinite;
}
</style>
