import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createConvexVue } from "convex-vue";

const app = createApp(App);
const convex = createConvexVue({
  url: import.meta.env.VITE_CONVEX_URL,
});

app.use(convex);
app.mount('#app');
