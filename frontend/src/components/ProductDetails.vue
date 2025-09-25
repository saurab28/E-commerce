<script setup lang="ts">
import {ref} from 'vue'
import { useRoute } from 'vue-router';
import Header from './Header.vue';
const route = useRoute()

console.log(typeof(route.params.id))
console.log(route.params)

</script>

<template>
  <Header />


</template>
