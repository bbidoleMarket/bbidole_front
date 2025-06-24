import { createRouter, createWebHistory } from "vue-router";
import MeChats from "@/pages/MeChats.vue";
import MyPage from "@/pages/MyPage.vue";

const routes = [
  { path: "/me/chats", component: MeChats },
  { path: "/me", component: MyPage },
  {
    path: "/post/:postId",
    name: "PostDetail",
    component: () => import("@/pages/PostDetail.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
