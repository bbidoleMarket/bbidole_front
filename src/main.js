import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import "./assets/tailwind.css";
import "./css/components.css";
import "./css/layout.css";
import router from "./router";
import "./css/product.css";

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.mount("#app");
