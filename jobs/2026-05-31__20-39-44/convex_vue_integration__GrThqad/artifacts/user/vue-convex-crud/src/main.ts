import { createApp } from 'vue'
import { convexVue } from 'convex-vue'
import './style.css'
import App from './App.vue'

const convexUrl = import.meta.env.VITE_CONVEX_URL as string;

const app = createApp(App)
app.use(convexVue, {
  url: convexUrl,
})
app.mount('#app')