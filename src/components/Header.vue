<template>
  <nav class="w-full h-25 shadow-sm border-none bg-gradient-to-b from-purple-300 to-purple-0">
    <!-- Top Row -->
    <div class="flex items-center justify-between px-6 py-3">
      <!-- Left: Logo -->
      <div class="flex items-center gap-2" @click="handleLogo">
        <img src="./../assets/logo.png" alt="Zepto" class="h-15 border-0 rounded-[50%]" />
        <span class="text-xl font-extrabold text-gray-700 px-2 py-1 rounded-lg">pickzy</span>
      </div>

      <!-- Center: Location + Search -->
      <div class="flex-1 flex items-center justify-center gap-4">
        <!-- Search -->
        <div class="w-1/2 relative" v-if="!props.param">
          <!-- Input -->
          <input
            type="text"
            placeholder="Search what you want"
            class="w-full bg-white border-0 rounded-md pl-10 pr-4 py-2 focus:outline-none"
            v-model="filterProducts"
          />

          <!-- Icon inside input -->
          <i class="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-black text-xl"></i>
        </div>
      </div>

      <!-- Right: Login + Cart -->
      <div class="flex items-center gap-6">
        <div class="flex flex-col items-center cursor-pointer">
          <i class="ri-account-circle-line text-2xl"></i>
          <button class="text-sm font-medium" @click="handleLogin">Login</button>
        </div>

        <div class="relative">
          <i class="ri-shopping-cart-line text-2xl"></i>
          <span
            class="absolute -top-2 -right-2 bg-white text-black font-bold text-xs px-1.5 py-0.5 rounded-full"
          >
            0
          </span>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
// No script needed yet; can later connect props or API
import { watchEffect, ref} from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()
const handleLogin = () => {
  router.push("/login")
}
const handleLogo = () => {
  router.push("/")
}

const props = defineProps<{param ?: string}>()
watchEffect( () => {
  console.log(props.param)

})
const filterProducts = ref<string>("")
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
