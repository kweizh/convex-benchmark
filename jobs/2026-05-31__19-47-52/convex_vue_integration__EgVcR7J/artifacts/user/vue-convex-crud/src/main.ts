import { createApp } from "vue";
import { ConvexProvider, ConvexVueClient } from "convex-vue";
import "./style.css";
import App from "./App.vue";

const convex = new ConvexVueClient(import.meta.env.VITE_CONVEX_URL as string);

createApp(App).use(ConvexProvider, { client: convex }).mount("#app");
