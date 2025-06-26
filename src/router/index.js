import { createRouter, createWebHistory } from "vue-router";
import MeChats from "@/pages/MeChats.vue";

const routes = [
  { path: "/me/chats", component: MeChats },
  {
    path: "/me",
    name: "MyPage",
    component: () => import("@/pages/MyPage.vue"),
    // meta: { requiresAuth: true },
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
  {
    path: "/post/update/:postId",
    name: "PostEditPage",
    component: () => import("@/pages/PostEditPage.vue"),
  },
  {
    path: "/seller/:sellerId",
    name: "SellerDetail",
    component: () => import("@/pages/SellerDetailPage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem("token");

  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ path: "/login" }); // TODO 수정 필요(로그인 페이지의 경로에 따라서)
  } else {
    next();
  }
});

export default router;
