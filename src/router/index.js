import { createRouter, createWebHistory } from "vue-router";
import MeChats from "@/pages/MeChats.vue";

const routes = [
  { path: "/me/chats", component: MeChats },
  {
    path: "/me",
    name: "MyPage",
    component: () => import("@/pages/MyPage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/post/:postId",
    name: "PostDetail",
    component: () => import("@/pages/PostDetail.vue"),
  },
  {
    path: "/user/:userId",
    name: "UserDetail",
    component: () => import("@/pages/MyPage.vue"),
  },
  {
    path: "/reviews/:userId",
    name: "UserReviews",
    component: () => import("@/pages/ReviewPage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
