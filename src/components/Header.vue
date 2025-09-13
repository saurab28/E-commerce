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
          <span  v-show="cartCount"
            class="absolute -top-2 -right-2 bg-white text-black font-bold text-xs px-1.5 py-0.5 rounded-full"
            :class="badgeSizeClass"
  :aria-label="`Cart: ${cartCount} item${cartCount === 1 ? '' : 's'}`"
          >
            {{ badgeText }}
          </span>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
// No script needed yet; can later connect props or API
import { watchEffect, ref, computed} from 'vue';
import { useRouter } from 'vue-router';
import { useCart } from '@/stores/cart'

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




const cart = useCart()
// use whichever your store exposes: itemCount or count
const cartCount = computed(() => (cart.itemCount ?? cart.count ?? 0))
const badgeText = computed(() => (cartCount.value > 99 ? '99+' : String(cartCount.value)))
const badgeSizeClass = computed(() =>
  cartCount.value > 9 ? 'min-w-[22px] h-[18px] px-1.5 text-[10px]' : 'w-5 h-5 text-[11px]'
)


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

@keyframes pop { 0% { transform: scale(.8); } 100% { transform: scale(1); } }
.badge-pop { animation: pop .15s ease-out; }


</style>
