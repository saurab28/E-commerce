import Productslist from '@/components/Productslist.vue'
import Home from '@/views/Home.vue'

import Cart from '@/components/Cart.vue'
import { createRouter, createWebHistory } from 'vue-router'
import Search from '@/views/Search.vue'
import Orders from '@/components/Orders.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/products/:title',
      name: 'products',
      component: Productslist,
    },
    {
      path: '/cart',
      name: 'cart',
      component: Cart,
    },
    {
      path: '/search',
      name: 'search',
      component: Search,
    },
    {
      path: '/orders',
      name: 'orders',
      component: Orders,
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
    return { top: 0 }
  },
})

export default router
