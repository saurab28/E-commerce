<template>
  <div
    @click.self="toogleModal"
    class="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm"
  >
    <div class="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 relative">

      <!-- Logo / Title -->
      <div>
        <button
          @click.stop="toogleModal"
          class="absolute top-2 size-[30px] right-2 text-black bg-gray-50 rounded-[50%] p-1 hover:text-gray-700"
        >
          ✕
        </button>
        <div class="text-center mb-6">
          <h1 class="text-3xl font-extrabold text-green-600">Pickzy 🥦</h1>
          <p class="text-gray-500">
            {{ isLogin ? 'Login to your account' : 'Create a new account' }}
          </p>
        </div>

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
            class="mt-1 w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <!-- Username -->
        <div v-if="!isLogin">
          <label class="block text-sm font-medium text-gray-700">Username</label>
          <input
            v-model="form.username"
            type="text"
            required
            class="mt-1 w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <!-- Email (only for register) -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="form.email"
            type="email"
            required
            class="mt-1 w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <input
            v-model="form.password"
            type="password"
            required
            class="mt-1 w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
        >
          {{ isLogin ? 'Login' : 'Register' }}
        </button>
      </form>

      <p class="text-center text-lg mt-3 mb-3">---------------or---------------</p>

      <!-- Google Login -->
      <button
        @click="handleGoogleLogin"
        class="w-full flex items-center justify-center gap-2 bg-gray-400 text-white py-2 px-4 rounded-lg mt-3"
      >
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-5 h-5" />
        Sign in with Google
      </button>

      <!-- Switch -->
      <p class="text-center mt-6 text-sm text-gray-600">
        {{ isLogin ? "Don't have an account?" : 'Already have an account?' }}
        <button @click="isLogin = !isLogin" class="text-green-600 font-semibold hover:underline">
          {{ isLogin ? 'Register' : 'Login' }}
        </button>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { auth, googleProvider } from '@/firebase'
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth'
import Cookies from 'js-cookie'
import authorization from '@/composables/auth'
import loginModal from '@/composables/loginmodal'

const { checkAuthorization } = authorization()
const Modal = loginModal()
const { isModal, toogleModal } = Modal

const isLogin = ref(true)
const form = ref({ name: '', username: '', email: '', password: '' })
const user = ref(null)

const API_URL = 'http://localhost:4000'

// 📌 Register
async function handleRegister() {
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
    })
    if (!res.ok) throw new Error(await res.text())
    alert('✅ Registered successfully! Now login.')
    isLogin.value = true
  } catch (err) {
    alert('❌ ' + err.message)
  }
}

// 📌 Login (via Firebase SDK)
async function handleLogin() {
  try {
    const userCred = await signInWithEmailAndPassword(auth, form.value.email, form.value.password)
    const token = await userCred.user.getIdToken()
    Cookies.set('token', token, { expires: 1, secure: true, sameSite: 'Strict' })
    toogleModal()
    checkAuthorization()
  } catch (err) {
    alert('❌ ' + err.message)
  }
}

// 📌 Google Login
async function handleGoogleLogin() {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const token = await result.user.getIdToken()
    Cookies.set('token', token, { expires: 1, secure: true, sameSite: 'Strict' })
    user.value = { username: result.user.displayName, email: result.user.email }
    toogleModal()
    checkAuthorization()
  } catch (err) {
    alert('❌ Google Login Failed: ' + err.message)
  }
}
</script>

<style scoped>
/* Tablet screens */
@media (max-width: 800px) {
  .max-w-md {
    max-width: 96vw;
  }
  .p-8 {
    padding: 1.2rem !important;
  }
  .text-3xl {
    font-size: 1.7rem !important;
  }
}

/* Phones */
@media (max-width: 500px) {
  .max-w-md {
    max-width: 99vw !important;
  }
  .p-8 {
    padding: 0.75rem !important;
  }
  .rounded-2xl {
    border-radius: 11px !important;
  }
  .text-3xl {
    font-size: 1.2rem !important;
  }
  .py-2 {
    padding-top: 0.4rem !important;
    padding-bottom: 0.4rem !important;
  }
  .px-4 {
    padding-left: 0.5rem !important;
    padding-right: 0.5rem !important;
  }
  .gap-2 {
    gap: 0.4rem !important;
  }
}

/* Smallest phones */
@media (max-width: 350px) {
  .max-w-md {
    max-width: 100vw !important;
    min-width: 100vw !important;
  }
  .p-8 {
    padding: 0.35rem !important;
  }
  .text-3xl {
    font-size: 1rem !important;
  }
  .rounded-2xl {
    border-radius: 7px !important;
  }
}
</style>

