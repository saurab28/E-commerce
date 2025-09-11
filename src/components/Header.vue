<template>
  <nav class="w-full h-25 shadow-sm border-none bg-gradient-to-b from-purple-300 to-purple-0">
    <!-- Top Row -->
    <div class="flex items-center justify-between px-6 py-3">
      <!-- Left: Logo -->
      <div class="flex items-center gap-2">
        <img src="./../assets/logo.png" alt="Zepto" class="h-15 border-0 rounded-[50%]" />
        <span class="text-xl font-extrabold text-gray-700 px-2 py-1 rounded-lg">pickzy</span>
      </div>

      <!-- Center: Location + Search -->
      <div class="flex-1 flex items-center justify-center gap-4">
        <!-- Search -->
        <div class="w-1/2 relative">
          <!-- Input -->
          <input
            type="text"
            placeholder="Search what you want"
            class="w-full bg-white border-0 rounded-md pl-10 pr-4 py-2 focus:outline-none"
          />

          <!-- Icon inside input -->
          <i
            class="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-black text-xl"
          ></i>
        </div>
      </div>

      <!-- Right: Login + Cart -->
      <div class="flex items-center gap-6">
        <button class="text-sm font-medium">Login</button>
        <div class="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 cursor-pointer"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9h14l-2-9M10 21h4"
            />
          </svg>
          <span
            class="absolute -top-2 -right-2 bg-purple-600 text-white text-xs px-1.5 py-0.5 rounded-full"
          >
            0
          </span>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
// No script needed yet; can later connect props or API
</script>

<style scoped>
/* Optional scroll styling */
::-webkit-scrollbar {
  height: 6px;
}
::-webkit-scrollbar-thumb {
  background: #a855f7;
  border-radius: 10px;
}
</style>
