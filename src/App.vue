<<<<<<< HEAD
<script setup>
import Categories from './components/Categories.vue'
import Header from './components/Header.vue'
// import LoginRegister from './components/LoginRegister.vue'
import PaymentPage from './components/PaymentPage.vue'
import Products from './components/Products.vue'
</script>

<template>
  <div>
    <div class="">
      <Header />
      <Categories />
      <Products />
      <PaymentPage />
      <!-- <LoginRegister /> -->
    </div>
  </div>
=======
<script setup lang="ts">
 import { RouterView } from 'vue-router';
 import Footer from './components/Footer.vue';
</script>

<template>


  <RouterView/>
  <Footer/>

>>>>>>> main
</template>

<style scoped></style>
