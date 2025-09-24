// stores/googleMaps.ts
import { defineStore } from "pinia"
import { ref } from "vue"

let googleMapsScriptLoading: Promise<void> | null = null

export const useGoogleMapsStore = defineStore("googleMaps", () => {
  // --- state ---
  const isLoading = ref(false)
  const isLoaded = ref(false)
  const error = ref<string | null>(null)

  // --- actions ---
  async function loadApi(): Promise<void> {
    if (isLoaded.value) return

    // If already available on window
    if (typeof window !== "undefined" && window.google && window.google.maps) {
      isLoaded.value = true
      return
    }

    if (!googleMapsScriptLoading) {
      isLoading.value = true

      googleMapsScriptLoading = new Promise<void>((resolve, reject) => {
        const script = document.createElement("script")
        script.src = `https://maps.googleapis.com/maps/api/js?key=${
          import.meta.env.VITE_GOOGLE_MAPS_API_KEY
        }&libraries=places`
        script.async = true
        script.defer = true

        script.onload = () => {
          isLoading.value = false
          isLoaded.value = true
          resolve()
        }

        script.onerror = () => {
          isLoading.value = false
          error.value = "Google Maps failed to load"
          reject(error.value)
        }

        document.head.appendChild(script)
      })
    }

    return googleMapsScriptLoading
  }

  return {
    // state
    isLoading,
    isLoaded,
    error,
    // actions
    loadApi,
  }
})
