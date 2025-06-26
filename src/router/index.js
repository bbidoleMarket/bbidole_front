import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";
import Login from "../pages/Login.vue";
import Signup from "../pages/Signup.vue";
import HomePage from "../pages/HomePage.vue";
import SearchResultPage from "../pages/SearchResultPage.vue";
import MeChats from "../pages/MeChats.vue";
import ChatRoom from "../pages/ChatRoom.vue";
import WritePage from "../pages/WritePage.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomePage,
  },
  {
    path: "/write",
    name: "write",
    component: WritePage,
  },
  {
    path: "/search",
    name: "search-results",
    component: SearchResultPage,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { requiresGuest: true, hideLayout: true }, // 로그인된 사용자는 접근 불가
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
    meta: { requiresGuest: true, hideLayout: true },
  },
  {
    path: "/me/chats",
    component: MeChats,
  },
  { path: "/chat/:chatId", component: ChatRoom },
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

// 전역 네비게이션 가드
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // 인증이 필요한 페이지
  if (to.meta.requiresAuth) {
    // 리프레시 토큰도 없거나 만료된 경우 - 로그인 필요
    if (!authStore.refreshToken || authStore.isRefreshTokenExpired) {
      authStore.logout();
      next("/login");
      return;
    }

    // 액세스 토큰이 없거나 만료된 경우 - 자동 재발급 시도
    if (!authStore.accessToken || authStore.isAccessTokenExpired) {
      try {
        console.log("액세스 토큰이 없거나 만료됨. 자동 재발급 시도...");
        await authStore.refreshAuthTokens();
        console.log("토큰 재발급 성공!");
        next();
        return;
      } catch (error) {
        console.error("토큰 재발급 실패:", error);
        authStore.logout();
        next("/login");
        return;
      }
    }

    // 액세스 토큰이 유효한 경우
    next();
    return;
  }

  // 게스트만 접근 가능한 페이지 (로그인, 회원가입)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next("/");
    return;
  }

  next();
});

export default router;
