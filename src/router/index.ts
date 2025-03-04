import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      name: "",
      path: "/",
      redirect: "/HomeView",
    },
    {
      name: "HomeView",
      path: "/HomeView",
      component: () => import("../views/HomeView.vue"),
    },
  ],
});

export default router;
