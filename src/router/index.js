import { createRouter, createWebHistory } from "vue-router";
//import MeChats from "../pages/MeChats.vue";

import mypage from "../pages/mypage.vue";
import Mypage from "../pages/mypage.vue";

const routes = [{ path: "/mypage", component: Mypage }];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
