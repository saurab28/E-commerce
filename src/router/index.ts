import Productslist from '@/components/Productslist.vue'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
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
      component:Productslist
    }
  ],
})

export default router
