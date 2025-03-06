import {
    createRouter,
    createWebHistory,
    createWebHashHistory,
    RouterOptions,
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
        {
            name: "MainView",
            path: "/main_view/index",
            component: () => import("../views/main_view/index.vue"),
        },
        {
            name: "SettingsView",
            path: "/settings_view/index",
            component: () => import("../views/settings_view/index.vue"),
        },
    ],
} as RouterOptions);

export default router;
