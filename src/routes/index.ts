import {
    createWebHistory,
    createRouter,
    type RouteRecordRaw,
} from "vue-router";
import {} from "vue-router";
import Login from "../auth/Login.vue";
import Main from "@/core/layout/Main.vue";
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
                        component: () =>
                            import("@/employee/Employee.index.vue"),
                    },
                    {
                        path: "form",
                        name: "EmployeeForm",
                        component: () => import("@/employee/Employee.form.vue"),
                    },
                    {
                        path: ":uuid",
                        name: "EmployeeDetail",
                        component: () => import("@/employee/Employee.form.vue"),
                    },
                ],
            },
            {
                path: "settings",
                component: () => import("@/settings/Settings.index.vue"),
                name: "Settings",
                children: [
                    {
                        path: "company",
                        children: [
                            {
                                path: "",
                                name: "Company",
                                component: () =>
                                    import(
                                        "@/settings/company/Company.index.vue"
                                    ),
                            },
                            {
                                path: "form",
                                name: "CompanyForm",
                                component: () =>
                                    import(
                                        "@/settings/company/Company.form.vue"
                                    ),
                            },
                            {
                                path: ":uuid",
                                children: [
                                    {
                                        path: "",
                                        name: "CompanyDetail",
                                        component: () =>
                                            import(
                                                "@/settings/company/Company.detail.vue"
                                            ),
                                    },
                                    {
                                        path: "Branch",
                                        children: [
                                            {
                                                path: "",
                                                name: "Branch",
                                                component: () =>
                                                    import(
                                                        "@/settings/branch/Branch.index.vue"
                                                    ),
                                            },
                                            {
                                                path: "form",
                                                name: "BranchForm",
                                                component: () =>
                                                    import(
                                                        "@/settings/branch/Branch.form.vue"
                                                    ),
                                            },
                                            {
                                                path: ":uuidBranch",
                                                name: "BranchDetail",
                                                component: () =>
                                                    import(
                                                        "@/settings/branch/Branch.form.vue"
                                                    ),
                                            },
                                            {
                                                path: ":uuidBranch/edit",
                                                name: "BranchEdit",
                                                component: () =>
                                                    import(
                                                        "@/settings/branch/Branch.form.vue"
                                                    ),
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                path: ":uuid/edit",
                                name: "CompanyEdit",
                                component: () =>
                                    import(
                                        "@/settings/company/Company.form.vue"
                                    ),
                            },
                        ],
                    },
                    {
                        path: "user",
                        children: [
                            {
                                path: "",
                                name: "Users",
                                component: () =>
                                    import("@/user/User.index.vue"),
                            },
                            {
                                path: "form",
                                name: "UserForm",
                                component: () => import("@/user/User.form.vue"),
                            },
                            {
                                path: ":uuid",
                                name: "UserDetail",
                                component: () => import("@/user/User.form.vue"),
                            },
                        ],
                    },
                    {
                        path: "department",
                        children: [
                            {
                                path: "",
                                name: "Department",
                                component: () =>
                                    import("@/settings/Department.index.vue"),
                            },
                            {
                                path: "form",
                                name: "DepartmentForm",
                                component: () =>
                                    import("@/settings/Department.form.vue"),
                            },
                        ],
                    },
                    {
                        path: "time-off",
                        children: [
                            {
                                path: "",
                                name: "TimeOff",
                                component: () =>
                                    import("@/settings/time/TimeOff.index.vue"),
                            },
                            {
                                path: "form",
                                name: "TimeOffForm",
                                component: () =>
                                    import("@/settings/time/TimeOff.form.vue"),
                            },
                            {
                                path: ":uuid",
                                name: "TimeOffDetail",
                                component: () =>
                                    import("@/settings/time/TimeOff.form.vue"),
                            },
                        ],
                    },
                    {
                        path: "overtime",
                        children: [
                            {
                                path: "",
                                name: "Overtime",
                                component: () =>
                                    import(
                                        "@/settings/time/Overtime.index.vue"
                                    ),
                            },
                        ],
                    },
                    {
                        path: "holiday",
                        children: [
                            {
                                path: "",
                                name: "Holiday",
                                component: () =>
                                    import("@/settings/time/Holiday.index.vue"),
                            },
                        ],
                    },
                ],
            },
            {
                path: "schedule",
                children: [
                    {
                        path: "",
                        name: "ScheduleIndex",
                        component: () =>
                            import("@/schedule/Schedule.index.vue"),
                        children: [
                            {
                                path: "index",
                                name: "Schedule",
                                component: () =>
                                    import("@/schedule/Schedule.vue"),
                            },
                            {
                                path: "main",
                                name: "Scheduler",
                                component: () =>
                                    import("@/schedule/Scheduler.vue"),
                            },
                        ],
                    },
                    {
                        path: "form",
                        name: "ScheduleForm",
                        component: () => import("@/schedule/Schedule.form.vue"),
                    },
                    {
                        path: ":uuid",
                        name: "ScheduleDetail",
                        component: () => import("@/schedule/Schedule.form.vue"),
                    },
                ],
            },
            {
                path: "shift",
                children: [
                    {
                        path: "",
                        name: "Shift",
                        component: () => import("@/shift/Shift.index.vue"),
                    },
                    {
                        path: "form",
                        name: "ShiftForm",
                        component: () => import("@/shift/Shift.form.vue"),
                    },
                    {
                        path: ":uuid",
                        name: "ShiftDetail",
                        component: () => import("@/shift/Shift.form.vue"),
                    },
                ],
            },
        ],
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

router.beforeEach(async (to) => {
    const authStore = useAuthStore();
    await authStore.getUser();

    const isAuthenticated = authStore.isAuthenticated;
    const requiresAuth = to.meta.requiresAuth;
    const requiresGuest = to.meta.requiresGuest;

    // Custom redirect rules
    const customRedirects: Record<string, string> = {
        Settings: "Users",
        ScheduleIndex: "Schedule",
    };

    // Check custom redirect
    if (to.name && to.name in customRedirects) {
        return { name: customRedirects[to.name as string] };
    }

    // Handle root path
    if (to.path === "/") {
        return isAuthenticated ? "/app" : "/login";
    }

    // // Auth checks
    if (requiresAuth && !isAuthenticated) {
        return { name: "Login" };
    }

    if (requiresGuest && isAuthenticated) {
        return { name: "Main" };
    }

    // Continue navigation
    return true;
});
export default router;
