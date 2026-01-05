// src/router/modules/settings.routes.ts
import type { RouteRecordRaw } from "vue-router";

const companyRoutes: RouteRecordRaw = {
    path: "company",
    children: [
        {
            path: "",
            name: "Company",
            component: () => import("@/settings/company/Company.index.vue"),
        },
        {
            path: "form",
            name: "CompanyForm",
            component: () => import("@/settings/company/Company.form.vue"),
        },
        {
            path: ":uuid",
            children: [
                {
                    path: "",
                    name: "CompanyDetail",
                    component: () =>
                        import("@/settings/company/Company.detail.vue"),
                },
                {
                    path: "Branch", // sesuai kode awalmu (case-sensitive)
                    children: [
                        {
                            path: "",
                            name: "Branch",
                            component: () =>
                                import("@/settings/branch/Branch.index.vue"),
                        },
                        {
                            path: "form",
                            name: "BranchForm",
                            component: () =>
                                import("@/settings/branch/Branch.form.vue"),
                        },
                        {
                            path: ":uuidBranch",
                            name: "BranchDetail",
                            component: () =>
                                import("@/settings/branch/Branch.form.vue"),
                        },
                        {
                            path: ":uuidBranch/edit",
                            name: "BranchEdit",
                            component: () =>
                                import("@/settings/branch/Branch.form.vue"),
                        },
                        {
                            path: ":uuidBranch/configuration",
                            name: "BranchConfiguration",
                            component: () =>
                                import("@/settings/branch/Branch.config.vue"),
                        },
                    ],
                },
            ],
        },
        {
            path: ":uuid/edit",
            name: "CompanyEdit",
            component: () => import("@/settings/company/Company.form.vue"),
        },
    ],
};

const userRoutes: RouteRecordRaw = {
    path: "user",
    children: [
        {
            path: "",
            name: "Users",
            component: () => import("@/user/User.index.vue"),
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
};

const departmentRoutes: RouteRecordRaw = {
    path: "department",
    children: [
        {
            path: "",
            name: "Department",
            component: () => import("@/settings/Department.index.vue"),
        },
        {
            path: "form",
            name: "DepartmentForm",
            component: () => import("@/settings/Department.form.vue"),
        },
    ],
};

const timeOffRoutes: RouteRecordRaw = {
    path: "time-off",
    children: [
        {
            path: "",
            name: "TimeOff",
            component: () => import("@/settings/time/TimeOff.index.vue"),
        },
        {
            path: "form",
            name: "TimeOffForm",
            component: () => import("@/settings/time/TimeOff.form.vue"),
        },
        {
            path: ":uuid",
            name: "TimeOffDetail",
            component: () => import("@/settings/time/TimeOff.form.vue"),
        },
    ],
};

const timeOffPolicyRoutes: RouteRecordRaw = {
    path: "time-off-policy",
    children: [
        {
            path: "",
            name: "TimeOffPolicy",
            component: () =>
                import("@/settings/time/TimeOffPolicy.index.vue"),
        },
        {
            path: "form",
            name: "TimeOffPolicyForm",
            component: () =>
                import("@/settings/time/TimeOffPolicy.form.vue"),
        },
    ],
}

const overtimeRoutes: RouteRecordRaw = {
    path: "overtime",
    children: [
        {
            path: "",
            name: "Overtime",
            component: () =>
                import("@/settings/time/Overtime.index.vue"),
        },
    ],
};

const holidayRoutes: RouteRecordRaw = {
    path: "holiday",
    children: [
        {
            path: "",
            name: "Holiday",
            component: () =>
                import("@/settings/time/Holiday.index.vue"),
        },
    ],
};

export const settingsRoutes: RouteRecordRaw = {
    path: "settings",
    name: "Settings",
    component: () => import("@/settings/Settings.index.vue"),
    children: [
        companyRoutes,
        userRoutes,
        departmentRoutes,
        timeOffRoutes,
        overtimeRoutes,
        holidayRoutes,
        timeOffPolicyRoutes
    ],
};
