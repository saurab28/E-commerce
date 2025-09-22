<template>
  <nav
    :class="$attrs.class"
    class="w-full h-25 shadow-sm border-none bg-gradient-to-b from-purple-300 to-purple-0"
  >
    <!-- Top Row -->
    <div class="flex items-center justify-between px-4 md:px-6 py-3">
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
      <div class="flex items-center gap-4 md:gap-6">
        <div
          class="hidden sm:flex flex-col items-center cursor-pointer"
          @click="isModalOpen = true"
        >
          <i class="ri-account-circle-line text-2xl"></i>
          <button class="text-sm font-medium">Login</button>
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
    <div class="block md:hidden px-4 pb-3 mobile-search-bar" >
      <div class="w-full relative">
        <input
          type="text"
          placeholder="Search what you want"
          class="w-full bg-white border-0 rounded-md pl-10 pr-4 py-2 focus:outline-none text-sm"
        />
        
      </div>
    </div>
  </nav>

  <!-- Modal -->
  <Teleport to="body">
    <LoginRegister v-if="isModalOpen" />
  </Teleport>
</template>

<script setup lang="ts">
// No script needed yet; can later connect props or API
import { watchEffect, ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '@/stores/cart'
import filter from '@/composables/filter.ts'
import Login from '@/views/Login.vue'
import LoginRegister from './LoginRegister.vue'

const router = useRouter()
const props = defineProps<{ param?: string }>()
const isModalOpen = ref(false)
const scrollY = ref(0)
const cart = useCart()
const { filterCategory } = filter()

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

watch(isModalOpen, (newVal) => {
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
.header-bar {
  width: 100%;
  background: linear-gradient(to bottom, #d8b4fe, #f3e8ff 80%);
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  box-sizing: border-box;
}

/* Left: logo group */
.header-logo-group {
  display: flex;
  align-items: center;
  gap: 10px;
}
.header-logo {
  height: 48px;
  width: 48px;
  border-radius: 50%;
}
.header-title {
  font-size: 28px;
  font-weight: 700;
  color: #374151;
  margin-left: 4px;
}

/* Center: search bar */
.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}
.header-search {
  position: relative;
  width: 480px;
  max-width: 100%;
}
.header-search input {
  width: 100%;
  padding: 12px 16px 12px 40px;
  border: none;
  border-radius: 10px;
  background: #fff;
  font-size: 18px;
  color: #222;
  box-sizing: border-box;
}
.header-search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 22px;
  color: #222;
}

/* Right: actions group */
.header-actions {
  display: flex;
  align-items: center;
  gap: 32px;
}
.header-action {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 16px;
  cursor: pointer;
}
.header-icon {
  font-size: 24px;
}
.header-cart-badge {
  background: #fff;
  color: #222;
  border-radius: 8px;
  font-size: 12px;
  margin-left: 2px;
  padding: 2px 7px;
  font-weight: bold;
  display: inline-block;
  min-width: 18px;
  text-align: center;
}

/* Always hide hamburger/menu */
.header-menu-btn {
  display: none !important;
}

/* Responsive adjustments for laptop/tablet */
@media (max-width: 1024px) {
  .header-bar {
    padding: 0 16px;
  }
  .header-logo {
    height: 38px;
    width: 38px;
  }
  .header-title {
    font-size: 22px;
  }
  .header-search {
    width: 340px;
  }
  .header-search input {
    font-size: 16px;
    padding-left: 38px;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .header-icon {
    font-size: 20px;
  }
}

@media (max-width: 600px) {
  /* Give space below header */
  nav {
    margin-bottom: 20px;
  }

  /* Top bar layout: keep logo + cart + menu only */
  .header-bar {
    min-height: 44px;
    padding: 6px 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    flex-wrap: nowrap;
    background: linear-gradient(to bottom, #d8b4fe, #f3e8ff 80%);
  }

  .header-logo-group {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .header-logo {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
  }
  .header-title {
    font-size: 14px;
    font-weight: bold;
    color: #374151;
    flex-shrink: 1;
  }

  .header-center {
    display: none; /* Hide inline search from top bar */
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .header-icon {
    font-size: 20px;
  }
  .header-cart-badge {
    font-size: 10px;
    padding: 2px 4px;
    min-width: 16px;
  }

  /* Move mobile search bar below the nav */
    .mobile-search-bar {
    display: block;
    padding: 8px 12px;
    background: #ffffff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 1;
  }

  .mobile-search-bar input {
    width: 100%;
    padding: 10px 12px 10px 36px; /* enough space for icon */
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background: #f9f9f9;
    box-sizing: border-box;
    outline: none;
    position: relative;
    z-index: 1;
  }

  .mobile-search-bar i {
    position: absolute;
    top: 50%;
    left: 16px;
    transform: translateY(-50%);
    font-size: 16px;
    color: #666;
    z-index: 2;
    pointer-events: none;
  }



}

</style>
