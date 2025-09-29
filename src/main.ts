import { createApp } from 'vue'
import './assets/main.css'
import App from './App.vue'
import router from './router'
import 'remixicon/fonts/remixicon.css'
import { createPinia } from 'pinia'

// ✅ Import Toastification
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const app = createApp(App)

const toastOptions = {
  position: "top-center",
  timeout: 4000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "colored"
}

app.use(createPinia())
app.use(router)
app.use(Toast, toastOptions) // ✅ register plugin

app.mount('#app')

export default app
