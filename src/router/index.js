import { createRouter, createWebHistory } from "vue-router";
//import MeChats from "../pages/MeChats.vue";

import Mypage from "../pages/MyPage.vue";
import PurchaseList from "../pages/PurchaseList.vue";
import SalesList from "../pages/SalesList.vue";

const routes = [
  { path: "/me/edit", component: Mypage }, //회원정보 수정
  { path: "/me/buy", component: PurchaseList }, //구매내역
  { path: "/me/posts", component: SalesList }, //판매 내역
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
