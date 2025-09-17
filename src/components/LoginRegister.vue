<template>
  <div class="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm ">
    <div class="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
      <!-- Logo / Title -->
      <div class="text-center mb-6">
        <h1 class="text-3xl font-extrabold text-green-600">FreshCart 🥦</h1>
        <p class="text-gray-500">
          {{ isLogin ? "Login to your account" : "Create a new account" }}
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="isLogin ? handleLogin() : handleRegister()" class="space-y-4">
        <!-- Name (only for register) -->
        <div v-if="!isLogin">
          <label class="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>

        <!-- Username -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Username</label>
          <input
            v-model="form.username"
            type="text"
            required
            class="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <input
            v-model="form.password"
            type="password"
            required
            class="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>

        <!-- Submit -->
        <button
          type="submit"
          class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          {{ isLogin ? "Login" : "Register" }}
        </button>
      </form>

      <!-- Google Login -->
      <button
        @click="handleGoogleLogin"
        class="w-full flex items-center justify-center gap-2 bg-gray-400  text-white font-semibold py-2 px-4 rounded-lg transition mt-3"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          class="w-5 h-5"
        />
        Sign in  with Google
      </button>

      <!-- Switch -->
      <p class="text-center mt-6 text-sm text-gray-600">
        {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
        <button @click="isLogin = !isLogin" class="text-green-600 font-semibold hover:underline">
          {{ isLogin ? "Register" : "Login" }}
        </button>
      </p>

      <!-- User Info -->
      <div v-if="user" class="mt-6 p-4 bg-green-50 rounded-lg text-center">
        <img
          v-if="user.photo"
          :src="user.photo"
          class="w-16 h-16 rounded-full mx-auto mb-2"
        />
        <p class="font-semibold text-green-700">Welcome, {{ user.username }} 🎉</p>
        <p class="text-gray-600 text-sm">{{ user.email }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { auth, googleProvider } from "@/firebase"
import { signInWithPopup } from "firebase/auth"

const isLogin = ref(true)
const form = ref({ name: "", username: "", password: "" })
const user = ref(null)

// API base URL (for your custom backend)
const API_URL = "http://localhost:5001"

// 📌 Register (custom backend)
async function handleRegister() {
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form.value),
    })
    if (!res.ok) throw new Error(await res.text())
    alert("✅ Registered successfully! Now login.")
    isLogin.value = true
  } catch (err) {
    alert("❌ " + err.message)
  }
}

// 📌 Login (custom backend)
async function handleLogin() {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form.value),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || "Login failed")
    localStorage.setItem("token", data.token)
    await fetchUser()
  } catch (err) {
    alert("❌ " + err.message)
  }
}

// 📌 Fetch User (protected route from backend)
async function fetchUser() {
  const token = localStorage.getItem("token")
  if (!token) return
  try {
    const res = await fetch(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || "Failed to fetch user")
    user.value = data.user || data
  } catch (err) {
    console.error(err.message)
  }
}

// 📌 Google Login (Firebase)
async function handleGoogleLogin() {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const userData = result.user

    // Get Firebase token
    const token = await userData.getIdToken()
    localStorage.setItem("token", token)

    // Save user details
    user.value = {
      username: userData.displayName,
      email: userData.email,
      photo: userData.photoURL,
    }

    alert(`🎉 Welcome ${userData.displayName}`)
  } catch (err) {
    alert("❌ Google Login Failed: " + err.message)
  }
}

// Auto-fetch user on reload (for backend)
fetchUser()
</script>
