// src/router/modules/schedule.routes.ts
import type { RouteRecordRaw } from "vue-router";

export const EmployeeTimeOffRoutes: RouteRecordRaw = {
    path: "employee-time-off",
    children: [
        {
            path: "",
            name: "EmployeeTimeOff",
            component: () => import("@/employee-timeoff/EmployeeTimeOff.index.vue"),
        },
        {
            path: "form",
            name: "EmployeeTimeOffForm",
            component: () => import("@/employee-timeoff/EmployeeTimeOff.form.vue"),
        }
    ],
};
