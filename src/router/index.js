import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import SearchResultPage from "../pages/SearchResultPage.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomePage
  },
  {
    path: "/search",
    name: "search-results",
    component: SearchResultPage
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});