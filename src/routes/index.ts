import { createWebHistory, createRouter, type RouteRecordRaw } from "vue-router";
import Login from "../auth/Login.vue";
import Main from "../layout/Main.vue";
import { useAuthStore } from "@/auth/store/Auth.store";
const routes: RouteRecordRaw[] = [
    {
        path: "/app",
        name: "Main",
        component: Main,
        meta: { requiresAuth: true },
        children: [
            {
                path: "dashboard",
                name: "Dashboard",
                component: () => import("@/dashboard/Dashboard.index.vue"),
            },
            {
                path: "attendance",
                name: "Attendance",
                component: () => import("@/attendance/Attendance.index.vue"),
            },
            {
                path: "employee",
                children: [
                    {
                        path: "",
                        name: "Employee",
                        component: () => import("@/employee/Employee.index.vue"),
                    },
                    {
                        path: "form",
                        name: "EmployeeForm",
                        component: () => import("@/employee/Employee.form.vue"),
                    },
                ]
            },
            {
                path: "schedule",
                name: "Schedule",
                component: () => import("@/schedule/Schedule.index.vue"),
            },
            {
                path: "shift",
                name: "Shift",
                component: () => import("@/shift/Shift.index.vue"),
            }
        ]
    },
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

// Navigation Guard Global
router.beforeEach((to, _from, next) => {
    // PENTING: Panggil useAuthStore() di dalam guard, bukan di level atas file.
    // Ini untuk memastikan Pinia sudah terinstall sebelum store diakses.


    if (to.path === '/') {
        next('/app');
        return;
    } else {
        next();
    }




    // const authStore = useAuthStore();

    // const requiresAuth = to.meta.requiresAuth;
    // const requiresGuest = to.meta.requiresGuest;
    // const isAuthenticated = authStore.isAuthenticated;

    // if (requiresAuth && !isAuthenticated) {
    //     // Jika rute butuh login TAPI pengguna belum login,
    //     // alihkan ke halaman login.
    //     next({ name: 'Login' });
    // } else if (requiresGuest && isAuthenticated) {
    //     // Jika rute hanya untuk tamu (seperti halaman login) TAPI pengguna sudah login,
    //     // alihkan ke halaman utama (Attendance).
    //     next({ name: 'Main' });
    // } else {
    //     // Jika tidak ada kondisi di atas yang terpenuhi, izinkan navigasi.
    //     next();
    // }
});

export default router;