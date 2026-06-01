import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { convexVue } from 'convex-vue'

const app = createApp(App)

app.use(convexVue, {
  url: import.meta.env.VITE_CONVEX_URL
})

app.mount('#app')
