import { createRouter, createWebHistory } from "vue-router";
//import MeChats from "../pages/MeChats.vue";

import Mypage from "../pages/mypage.vue";
import PurchaseList from "../pages/PurchaseList.vue";

const routes = [
  { path: "/mypage", component: Mypage }, //회원정보 수정
  { path: "/purchaselist", component: PurchaseList }, //구매내역
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
