<template>
  <nav
    class="w-full shadow-sm border-none bg-gradient-to-b from-purple-300 to-purple-0"
  >
    <!-- Top Row -->
    <div class="flex items-center justify-between px-4 md:px-6 py-3">
      <!-- Left: Logo -->
      <div class="flex items-center gap-2">
        <img
          src="./../assets/logo.png"
          alt="Zepto"
          class="h-12 w-12 border-0 rounded-full object-cover"
        />
        <span
          class="text-lg md:text-xl font-extrabold text-gray-700 px-2 py-1 rounded-lg"
        >
          pickzy
        </span>
      </div>

      <!-- Center: Search (hidden on small screens) -->
      <div class="hidden md:flex flex-1 items-center justify-center gap-4">
        <div class="w-1/2 relative">
          <input
            type="text"
            placeholder="Search what you want"
            class="w-full bg-white border-0 rounded-md pl-10 pr-4 py-2 focus:outline-none text-sm md:text-base"
          />
          <i
            class="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-black text-lg"
          ></i>
        </div>
      </div>

      <!-- Right: Login + Cart -->
      <div class="flex items-center gap-4 md:gap-6">
        <div class="hidden sm:flex flex-col items-center cursor-pointer">
          <i class="ri-account-circle-line text-2xl"></i>
          <button class="text-xs md:text-sm font-medium">Login</button>
        </div>

        <div class="relative cursor-pointer">
          <i class="ri-shopping-cart-line text-2xl"></i>
          <span
            class="absolute -top-2 -right-2 bg-white text-black font-bold text-xs px-1.5 py-0.5 rounded-full"
          >
            0
          </span>
        </div>

        <!-- Mobile Menu Button -->
        <button
          class="sm:hidden flex items-center justify-center p-2 rounded-md bg-white shadow"
        >
          <i class="ri-menu-line text-2xl"></i>
        </button>
      </div>
    </div>

    <!-- Mobile Search (only visible on small screens) -->
    <div class="block md:hidden px-4 pb-3">
      <div class="w-full relative">
        <input
          type="text"
          placeholder="Search what you want"
          class="w-full bg-white border-0 rounded-md pl-10 pr-4 py-2 focus:outline-none text-sm"
        />
        <i
          class="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-black text-lg"
        ></i>
      </div>
    </div>
  </nav>
</template>

<script setup>
// Future: you can add mobile menu toggle here
</script>

<style scoped>
::-webkit-scrollbar {
  height: 6px;
}
::-webkit-scrollbar-thumb {
  background: #a855f7;
  border-radius: 10px;
}
</style>
