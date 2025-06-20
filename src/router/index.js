import { createRouter, createWebHistory } from "vue-router";
import MeChats from "../pages/MeChats.vue";

const routes = [{ path: "/me/chats", component: MeChats }];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
