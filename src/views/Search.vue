<script setup lang="ts">
import {ref} from 'vue'
import Header from '@/components/Header.vue';
import { useRoute } from 'vue-router';
import Products from '@/components/Products.vue';
const route = useRoute()
const path = ref<string>(route.path)

</script> 

<template>
    <Header :param="path" class="sticky top-0"/>
    <div class="p-5">
        <Products />
    </div>

</template>