import Productslist from '@/components/Productslist.vue'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Cart from '@/components/Cart.vue';
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:"/",
      name:"home",
      component:Home
    },
    {
      path:"/login",
      name:"Login",
      component: Login
    },
    {
      path:'/product/:title',
      name:"products",
      component:Productslist,
      props : true
    },
    {
      path:'/cart',
      name:"cart",
      component:Cart
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    // Case 1: If user used back/forward, restore previous scroll
    if (savedPosition) {
      return savedPosition
    }
    // Case 2: If route has hash (#section), scroll to it
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    // Case 3: Default - scroll to top
    return { top: 0 }
  }
})


export default router
