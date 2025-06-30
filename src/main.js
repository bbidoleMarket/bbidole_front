import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import "./assets/tailwind.css";
import "./css/components.css";
import "./css/layout.css";
import router from "./router";
// import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import "./css/product.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const app = createApp(App);
const pinia = createPinia();
// pinia.use(piniaPluginPersistedstate);
app.use(pinia); // Pinia 등록
app.use(router); // Vue Router 등록
app.mount("#app"); // index.html의 app에 마운트

// 전역 오류 핸들러 설정 -> Vue 3 방식
app.config.errorHandler = (err, vm, info) => {
    console.error("🐛 전역 오류 발생:", err);
    console.warn("컴포넌트 인스턴스:", vm);
    console.info("오류 정보:", info);
};
// 전역 Promise 오류 핸들러 설정 -> 비동기 오류 핸들러
window.addEventListener("error", (event) => {
    console.error("전역 window error:", event.error);
});

window.addEventListener("unhandledrejection", (event) => {
    console.error("Promise 오류:", event.reason);
});
