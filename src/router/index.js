import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";
import Login from "../pages/Login.vue";
import Signup from "../pages/Signup.vue";
import HomePage from "../pages/HomePage.vue";
import SearchResultPage from "../pages/SearchResultPage.vue";
import MeChats from "../pages/MeChats.vue";
import PurchaseList from "../pages/PurchaseList.vue";
import SalesList from "../pages/SalesList.vue";
import ChatRoom from "../pages/ChatRoom.vue";
import WritePage from "../pages/WritePage.vue";
import UpdeateMypage from "../pages/UpdateMypage.vue";
import ReviewWrite from "../pages/ReviewWrite.vue";

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
    path: "/review/write",
    component: ReviewWrite,
    meta: { requiresAuth: true },
  },
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
  { path: "/me/edit", component: UpdeateMypage }, //회원정보 수정
  { path: "/me/buy", component: PurchaseList }, //구매내역
  { path: "/me/posts", component: SalesList }, //판매 내역
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 전역 네비게이션 가드
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // 게스트만 접근 가능한 페이지 (로그인, 회원가입)로 가는 경우
  if (to.meta.requiresGuest) {
    if (authStore.isAuthenticated) {
      next("/");
      return;
    }
    next();
    return;
  }

  // 모든 페이지에서 토큰 상태 확인 및 자동 재발급
  // 리프레시 토큰이 있고 유효한 경우
  if (authStore.refreshToken && !authStore.isRefreshTokenExpired) {
    // 액세스 토큰이 없거나 만료된 경우 자동 재발급 시도
    if (!authStore.accessToken || authStore.isAccessTokenExpired) {
      try {
        console.log("액세스 토큰이 없거나 만료됨. 자동 재발급 시도...");
        await authStore.refreshAuthTokens();
        console.log("토큰 재발급 성공!");
      } catch (error) {
        console.error("토큰 재발급 실패:", error);
        // 재발급 실패 시 로그아웃은 store에서 처리됨
      }
    }
  }

  // requiresAuth가 true인 페이지의 경우 추가 검증
  if (to.meta.requiresAuth) {
    // 리프레시 토큰도 없거나 만료된 경우 - 로그인 필요
    if (!authStore.refreshToken || authStore.isRefreshTokenExpired) {
      authStore.logout();
      next("/login");
      return;
    }

    // 인증되지 않은 경우 로그인 페이지로
    if (!authStore.isAuthenticated) {
      next("/login");
      return;
    }
  }

  next();
});

export default router;
