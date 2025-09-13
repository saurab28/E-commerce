import { createApp } from 'vue'

<<<<<<< HEAD
import App from '../App.vue'
=======
import './assets/main.css'
import App from './App.vue'
>>>>>>> main
import router from './router'
import 'remixicon/fonts/remixicon.css'
import { createPinia } from 'pinia'


const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')

export default app

