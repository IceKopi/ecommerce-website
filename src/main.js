import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import * as bootstrap from 'bootstrap'
import Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const app = createApp(App)
app.use(router)
app.use(Toastify, {
  autoClose: 3000,
  position: 'top-right',
  theme: 'light'
})

window.bootstrap = bootstrap

app.mount('#app')