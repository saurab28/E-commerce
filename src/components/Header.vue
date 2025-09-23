<template>
  <nav
    :class="$attrs.class"
    class="w-full sticky h-[93px] top-0 z-[999] bg-white p-2 shadow-sm border-none bg-gradient-to-b from-purple-300 to-purple-0 "
  >
    <!-- Top Row -->
    <div class="flex items-center justify-between px-4 md:px-6 py-3">
      <!-- Left: Logo -->
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2 cursor-pointer" @click="handleLogo">
          <img src="./../assets/logo.png" alt="Zepto" class="h-15 border-0 rounded-full" />
          <span class="text-2xl font-extrabold text-gray-700 px-2 py-1 rounded-lg">pickzy</span>
        </div>

        <div
          class="hidden md:flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
        @click="toggleLocationModal">
          <i class="ri-map-pin-line text-green-600 text-lg"></i>
          <div class="flex flex-col">
            <span class="text-xs text-gray-500">Deliver to</span>
            <span class="text-sm font-semibold text-gray-800 truncate max-w-32">{{
              currentLocation
            }}</span>
          </div>
          <i class="ri-arrow-down-s-line text-gray-400"></i>
        </div>
        <Location v-if="isLocationModal" class="absolute top-[96px]" @update:address="currentLocation = $event" @close="isLocationModal = false"/>
      </div>

      <!-- Center: Location + Search -->
      <div class="flex-1 flex items-center justify-center max-w-2xl mx-4">
        <!-- Search -->
        <div class="w-full relative" v-if="!props.param">
          <!-- Input -->
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
        <div class="w-full relative" v-else-if="props.param === '/search'">
          <!-- Input -->
          <input
            type="text"
            placeholder="Search what you want"
            class="w-full bg-gray-50 border-0 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-green-500 focus:bg-white transition-all"
            v-model="filterCategory"
          />

          <!-- Icon inside input -->
          <i
            class="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
          ></i>
        </div>
      </div>

      <!-- Right: Login + Cart -->
      <!-- Right: Profile + Cart -->
      <div class="flex items-center gap-4">
        <!-- Profile Section -->
        <div class="relative">
          <div
            v-if="!isLoggedIn"
            class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
            @click="toogleModal"
          >
            <i class="ri-user-line text-2xl text-gray-700"></i>
            <div class="hidden sm:flex flex-col">
              <span class="text-xs text-gray-500">Hello User</span>
              <span class="text-sm font-semibold text-gray-800">Sign In</span>
            </div>
          </div>
          <div v-else class="relative">
            <div
              class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
              @click="toggleProfileMenu"
            >
              <div class="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span class="text-white font-semibold text-sm">{{ userInitials }}</span>
              </div>
              <div class="hidden sm:flex flex-col">
                <span class="text-xs text-gray-500">Hello</span>
                <span class="text-sm font-semibold text-gray-800 truncate max-w-24">Saurab</span>
              </div>
              <i class="ri-arrow-down-s-line text-gray-400"></i>
            </div>

            <!-- Profile Dropdown -->
            <div
              v-if="showProfileMenu"
              class="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
            >
              <div class="px-4 py-2 border-b border-gray-100">
                <p class="font-semibold text-gray-800">Saurab</p>
                <p class="text-xs text-gray-500">Saurab@gmail.com</p>
              </div>
              <!-- <button
                class="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2"
              >
                <i class="ri-user-line"></i>
                My Profile
              </button>
              <button
                class="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2"
              >
                <i class="ri-shopping-bag-line"></i>
                My Orders
              </button>
              <button
                class="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2"
              >
                <i class="ri-heart-line"></i>
                Wishlist
              </button> -->
              <hr class="my-2" />
              <button
                @click="handleLogout"
                class="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600 flex items-center gap-2"
              >
                <i class="ri-logout-box-line"></i>
                Logout
              </button>
            </div>
          </div>
        </div>

        <!-- Cart -->
        <div class="relative" @click="handleCart">
          <div
            class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
          >
            <div class="relative">
              <i class="ri-shopping-cart-line text-2xl text-gray-700"></i>
              <span
                v-show="cartCount"
                class="absolute -top-2 -right-2 bg-green-600 text-white font-bold text-xs px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center"
              >
                {{ badgeText }}
              </span>
            </div>
            <div class="hidden sm:flex flex-col">
              <span class="text-xs text-gray-500">Cart</span>
              <span class="text-sm font-semibold text-gray-800">{{ cartCount }} items</span>
            </div>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <button class="sm:hidden flex items-center justify-center p-2 rounded-lg hover:bg-gray-50">
          <i class="ri-menu-line text-2xl text-gray-700"></i>
        </button>
      </div>
    </div>

    <!-- Mobile Location (only visible on small screens) -->
    <div class="block md:hidden px-4 pb-2">
      <div class="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
        <i class="ri-map-pin-line text-green-600"></i>
        <span class="text-sm text-gray-600">Deliver to: Hyderbad</span>
      </div>
    </div>

    <!-- Mobile Search (only visible on small screens) -->
    <div class="block md:hidden px-4 pb-3">
      <div class="w-full relative">
        <input
          type="text"
          placeholder="Search for products..."
          class="w-full bg-gray-50 border-2 border-gray-200 rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:border-green-500 text-sm"
        />
        <i
          class="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg"
        ></i>
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
import { inject, ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '@/stores/cart'
import filter from '@/composables/filter.ts'
import LoginRegister from './LoginRegister.vue'
import authorization from '@/composables/auth'
import Cookies from 'js-cookie'
import loginModal from '@/composables/loginmodal'
import Location from './Location.vue'

const router = useRouter()
const props = defineProps<{ param?: string }>()
const scrollY = ref(0)
const cart = useCart()
const { filterCategory } = filter()
const { isLoggedIn, checkAuthorization } = authorization()
const { isModal, toogleModal } = loginModal()
const currentLocation =  ref('Hyderabad, Telangana')
const showProfileMenu = ref(false)
const isLocationModal = ref(false)

const userInitials = ref('S')

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
}

const toggleLocationModal = () => {
  isLocationModal.value = ! isLocationModal.value
}

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

const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showProfileMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
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
