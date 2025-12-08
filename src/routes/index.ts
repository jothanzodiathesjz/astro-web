// src/router/index.ts
import {
    createWebHistory,
    createRouter,
    type RouteRecordRaw,
} from "vue-router";

import Login from "@/auth/Login.vue";
import { appRoute } from "./app.route";
import { useAuthStore } from "@/auth/store/Auth.store";

const routes: RouteRecordRaw[] = [
    appRoute,
    {
        path: "/login",
        name: "Login",
        component: Login,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to) => {
    const authStore = useAuthStore();
    await authStore.getUser();

    const isAuthenticated = authStore.isAuthenticated;
    const requiresAuth = to.meta.requiresAuth;
    const requiresGuest = to.meta.requiresGuest;

    // Custom redirect rules (tetap sama seperti kode awalmu)
    const customRedirects: Record<string, string> = {
        Settings: "Users",
        ScheduleIndex: "Schedule",
    };

    if (to.name && to.name in customRedirects) {
        return { name: customRedirects[to.name as string] };
    }

    // Handle root path
    if (to.path === "/") {
        return isAuthenticated ? "/app" : "/login";
    }

    // Auth checks
    if (requiresAuth && !isAuthenticated) {
        return { name: "Login" };
    }

    if (requiresGuest && isAuthenticated) {
        return { name: "Main" };
    }

    return true;
});

export default router;
