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
</template>

<style scoped></style>
