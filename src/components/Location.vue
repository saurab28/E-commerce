<script setup lang="ts">
import { ref,provide } from "vue";

interface Location {
  lat: number;
  lng: number;
  address: string;
}

const location = ref<Location | null>(null);
const query = ref("");
const suggestions = ref<{ description: string; place_id: string }[]>([]);
const loading = ref(false);
const emit = defineEmits(['update:address','close'])
// provide('Address',location.value?.address)
// Detect my location (via backend proxy)
const detectLocation = () => {
  if (!navigator.geolocation) {
    alert("Geolocation not supported.");
    return;
  }

  loading.value = true;
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const { latitude, longitude } = pos.coords;

      try {
        // Try new endpoint first
        // let res = await fetch(
        //   `http://localhost:5003/api/reverse-geocode?lat=${latitude}&lng=${longitude}`
        // );


        const res = await fetch(
            `http://localhost:5003/api/geocode?lat=${latitude}&lng=${longitude}`
          );


        if (!res.ok) throw new Error("Geocode API error");

        const data = await res.json();
        console.log(data)
        if (data.results && data.results[0]) {
          location.value = {
            lat: latitude,
            lng: longitude,
            address: data.results[0].formatted_address,
          };

        }
        emit('update:address', location.value?.address)
      } catch (err) {
        console.error("Geocoding failed:", err);
      } finally {
        loading.value = false;
      }
    },
    (err) => {
      console.error("Geolocation error:", err);
      loading.value = false;
    }
  );
};

// Search places (via backend proxy)
const searchPlaces = async (input: string) => {
  query.value = input;
  if (!input) {
    suggestions.value = [];
    return;
  }

  try {
    const res = await fetch(
      `http://localhost:5003/api/autocomplete?input=${encodeURIComponent(
        input
      )}`
    );
    if (!res.ok) throw new Error("Autocomplete API error");

    const data = await res.json();
    suggestions.value = data.predictions || [];
  } catch (err) {
    console.error("Autocomplete failed:", err);
    suggestions.value = [];
  }
};

// Select place (via backend proxy)
const selectPlace = async (placeId: string, description: string) => {
  try {
    const res = await fetch(
      `http://localhost:5003/api/place-details?placeId=${placeId}`
    );
    if (!res.ok) throw new Error("Place details API error");

    const data = await res.json();

    if (data.result) {
      const loc = data.result.geometry.location;
      location.value = {
        lat: loc.lat,
        lng: loc.lng,
        address: data.result.formatted_address,
      };
      query.value = description;
      suggestions.value = [];
      emit('update:address', location.value?.address)
    }
  } catch (err) {
    console.error("Place details failed:", err);
  }
};

const close = () => {
  emit('close')
}
</script>

<template>
  <div class="p-4 max-w-lg mx-auto bg-white shadow rounded-md">
    <!-- Header -->
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-gray-700 font-semibold">Change Location</h2>
      <button class="text-gray-500 hover:text-gray-700 text-xl" @click="close">&times;</button>
    </div>

    <!-- Detect or Search -->
    <div class="flex items-center gap-2">
      <button
        @click="detectLocation"
        class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
        :disabled="loading"
      >
        {{ loading ? "Detecting..." : "Detect my location" }}
      </button>

      <span class="text-gray-400">OR</span>

      <input
        type="text"
        placeholder="Search delivery location"
        class="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
        v-model="query"
        @input="searchPlaces(query)"
      />
    </div>

    <!-- Suggestions -->
    <ul
      v-if="suggestions.length"
      class="mt-2 border rounded-md max-h-40 overflow-y-auto bg-white shadow"
    >
      <li
        v-for="s in suggestions"
        :key="s.place_id"
        class="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
        @click="selectPlace(s.place_id, s.description)"
      >
        {{ s.description }}
      </li>
    </ul>

    <!-- Selected Location -->
    <div v-if="location" class="mt-3 text-sm text-gray-600">
      <p><strong>Delivery Address:</strong> {{ location.address }}</p>

    </div>
  </div>
</template>
