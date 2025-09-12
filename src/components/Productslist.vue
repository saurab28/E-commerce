<script setup lang="ts">
import { useRoute } from 'vue-router';
const route = useRoute()
const { params } = useRoute();
console.log(params.title)


</script>
<template>
<h2>{{ params.title }}</h2>

</template>
