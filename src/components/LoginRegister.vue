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
          {{ isLogin ? 'Login' : 'Register' }}
        </button>
      </form>

      <p class="text-center text-lg mt-3 mb-3">---------------or---------------</p>

      <!-- Google Login -->
      <button
        @click="handleGoogleLogin"
        class="w-full flex items-center justify-center gap-2 bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition mt-3"
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

      <!-- User Info -->
    </div>
  </div>
</template>

<script setup>
import { ref, toRefs } from 'vue'
import { auth, googleProvider } from '@/firebase'
import { signInWithPopup } from 'firebase/auth'
import Cookies from 'js-cookie'
import authorization from '@/composables/auth'
import loginModal from '@/composables/loginmodal'

const { checkAuthorization } = authorization()
const Modal = loginModal()
const { isModal, toogleModal } = Modal

const isLogin = ref(true)
const form = ref({ name: '', username: '', password: '' })
const user = ref(null)

// API base URL (for your custom backend)
const API_URL = 'http://localhost:5001'

// 📌 Register (custom backend)
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

// 📌 Login (custom backend)
async function handleLogin() {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Login failed')
    // localStorage.removeItem("token", data.token)
    Cookies.set('token', data.token, { expires: 1, secure: true, sameSite: 'Strict' })
    toogleModal()
    checkAuthorization()

    // await fetchUser()
  } catch (err) {
    alert('❌ ' + err.message)
  }
}

// 📌 Fetch User (protected route from backend)
// async function fetchUser() {
//   const token = localStorage.getItem("token")
//   if (!token) return
//   try {
//     const res = await fetch(`${API_URL}/me`, {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//     const data = await res.json()
//     if (!res.ok) throw new Error(data.error || "Failed to fetch user")
//     user.value = data.user || data
//   } catch (err) {
//     console.error(err.message)
//   }
// }

// 📌 Google Login (Firebase)
async function handleGoogleLogin() {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    console.log('result', result)
    const userData = result.user
    console.log('result', userData)

    // Get Firebase token
    const token = await userData.getIdToken()
    // localStorage.setItem("token", token)

    // Save user details
    user.value = {
      username: userData.displayName,
      email: userData.email,
    }

    Cookies.set('token', token, { expires: 1, secure: true, sameSite: 'Strict' })
    toogleModal()
    checkAuthorization()
  } catch (err) {
    alert('❌ Google Login Failed: ' + err.message)
  }
}

// Auto-fetch user on reload (for backend)
// fetchUser()
</script>
<style scoped>
.fixed {
  position: fixed;
  inset: 0;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.w-full {
  width: 100%;
}
.max-w-md {
  max-width: 400px;
}
.bg-white {
  background: white;
}
.shadow-2xl {
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}
.rounded-2xl {
  border-radius: 16px;
}
.p-8 {
  padding: 32px;
}

.text-center {
  text-align: center;
}
.mb-6 {
  margin-bottom: 24px;
}

.text-3xl {
  font-size: 24px;
  font-weight: 800;
  color: #16a34a;
}

.text-gray-500 {
  color: #6b7280;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 8px 16px;
  margin-top: 4px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  box-sizing: border-box;
  font-size: 16px;
}

button {
  width: 100%;
  background-color: #16a34a;
  color: white;
  font-weight: 600;
  padding: 10px 0;
  border-radius: 8px;
  margin-top: 10px;
  cursor: pointer;
}

button:hover {
  background-color: #15803d;
}

@media (max-width: 768px) {
  .max-w-md {
    max-width: 350px;
  }
  .text-3xl {
    font-size: 20px;
  }
  input[type="text"],
  input[type="password"] {
    font-size: 14px;
  }
  button {
    font-size: 14px;
    padding: 8px 0;
  }
}

@media (max-width: 480px) {
  .max-w-md {
    max-width: 100%;
    padding: 20px;
  }
  .text-3xl {
    font-size: 18px;
  }
  button {
    font-size: 13px;
  }
}
</style>
