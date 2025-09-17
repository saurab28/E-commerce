<template>
  <div class="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm">
    <div class="bg-white rounded-lg shadow-lg w-96 p-6 relative">
      <button @click="close" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
        ✕
      </button>

      <h2 class="text-lg font-bold mb-2">Hello from Modal 🎉</h2>
      <p class="text-gray-600 mb-4">This is a Tailwind-powered modal component.</p>
      <button @click="close" class="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700">
        Close
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}
</script>
