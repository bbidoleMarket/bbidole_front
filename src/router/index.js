import { createRouter, createWebHistory } from "vue-router";
import MeChats from "../pages/MeChats.vue";
import ChatRoom from "../pages/ChatRoom.vue";

const routes = [
  { path: "/me/chats", component: MeChats },
  { path: "/chat/:chatId", component: ChatRoom },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
