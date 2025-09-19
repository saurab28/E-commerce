<template>
  <nav
    :class="$attrs.class"
    class="w-full sticky top-0 z-[999]  bg-white p-2 shadow-sm border-none bg-gradient-to-b from-purple-300 to-purple-0"
  >
    <!-- Top Row -->
    <div class="flex items-center justify-between px-4 md:px-6 py-3">
      <!-- Left: Logo -->

      <div class="flex items-center gap-2 cursor-pointer" @click="handleLogo">
        <img src="./../assets/logo.png" alt="Zepto" class="h-15 border-0 rounded-[50%]" />
        <span class="text-2xl font-extrabold text-gray-700 px-2 py-1 rounded-lg">pickzy</span>
      </div>

      <!-- Center: Location + Search -->
      <div class="flex-1 flex items-center justify-center gap-4">
        <!-- Search -->
        <div class="w-1/2 relative" v-if="!props.param">
          <!-- Input -->
          <input
            type="text"
            placeholder="Search what you want"
            class="w-full bg-white border-0 rounded-md pl-10 pr-4 py-2  focus:outline-none"
            readonly
            @click="handleSearch"
          />
          <i class="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-black text-lg"></i>
        </div>
        <div class="w-1/2 relative" v-else-if="props.param === '/search'">
          <!-- Input -->
          <input
            type="text"
            placeholder="Search what you want"
            class="w-full bg-white border-0 rounded-md pl-10 pr-4 py-2 focus:outline-none"
            v-model="filterCategory"
          />

          <!-- Icon inside input -->
          <i class="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-black text-xl"></i>
        </div>
      </div>

      <!-- Right: Login + Cart -->
      <div class="flex items-center gap-4 md:gap-6 ">
        <div v-if="!isLoggedIn"
          class="hidden sm:flex flex-col items-center cursor-pointer"
          @click="toogleModal"
        >
          <i class="ri-account-circle-line text-2xl"></i>
          <button class="text-sm font-medium">Login</button>
        </div>
        <div v-else>
          <button @click="handleLogout" class="cursor-pointer">Logout</button>

        </div>

        <div class="relative" @click="handleCart">
          <i class="ri-shopping-cart-line text-2xl cursor-pointer"></i>
          <span
            v-show="cartCount"
            class="absolute -top-2 -right-2 bg-white text-black font-bold text-xs px-1.5 py-0.5 rounded-full"
            :class="badgeSizeClass"
            :aria-label="`Cart: ${cartCount} item${cartCount === 1 ? '' : 's'}`"
          >
            {{ badgeText }}
          </span>
        </div>

        <!-- Mobile Menu Button -->
        <button class="sm:hidden flex items-center justify-center p-2 rounded-md bg-white shadow">
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
        <i class="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-black text-lg"></i>
      </div>
    </div>
  </nav>

  <!-- Modal -->
  <Teleport to="body">
    <LoginRegister v-if="isModal" />
  </Teleport>
</template>

<script setup lang="ts">
// No script needed yet; can later connect props or API
import { watchEffect, ref, computed, watch, toRefs, toRef } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '@/stores/cart'
import filter from '@/composables/filter.ts'
import Login from '@/views/Login.vue'
import LoginRegister from './LoginRegister.vue'
import authorization from '@/composables/auth'
import Cookies from "js-cookie"
import loginModal from '@/composables/loginmodal'

const router = useRouter()
const props = defineProps<{ param?: string }>()
const scrollY = ref(0)
const cart = useCart()
const { filterCategory } = filter()
const {isLoggedIn,checkAuthorization} = authorization()
const {isModal,toogleModal} = loginModal()



// console.log(useFilter.filterCategory.value)

const handleLogin = () => {
  router.push('/login')
}

const handleLogo = () => {
  router.push('/')
}

// use whichever your store exposes: itemCount or count
const cartCount = computed(() => cart.itemCount)
const badgeText = computed(() => (cartCount.value > 99 ? '99+' : String(cartCount.value)))
const badgeSizeClass = computed(() =>
  cartCount.value > 9 ? 'min-w-[22px] h-[18px] px-1.5 text-[10px]' : 'w-5 h-5 text-[11px]',
)

const handleCart = () => {
  router.push('/cart')
}

const handleSearch = () => {
  router.push('/search')
}

const handleLogout = () => {

   Cookies.remove('token')
   checkAuthorization()
   router.push('/')
}

watch(isModal, (newVal) => {
  if (newVal) {
    // Save current scroll
    scrollY.value = window.scrollY

    // Lock body
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.left = '0'
    document.body.style.right = '0'
    document.body.style.overflow = 'hidden'
    document.body.style.width = '100%' // prevent content shift
  } else {
    // Unlock body
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.left = ''
    document.body.style.right = ''
    document.body.style.overflow = ''
    document.body.style.width = ''

    // Restore scroll
    window.scrollTo(0, scrollY.value)
  }
})
</script>

<style scoped>
::-webkit-scrollbar {
  height: 6px;
}
::-webkit-scrollbar-thumb {
  background: #a855f7;
  border-radius: 10px;
}

@keyframes pop {
  0% {
    transform: scale(0.8);
  }
  100% {
    transform: scale(1);
  }
}
.badge-pop {
  animation: pop 0.15s ease-out;
}
</style>
