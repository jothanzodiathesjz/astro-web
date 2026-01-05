// src/router/app.routes.ts
import type { RouteRecordRaw } from "vue-router";
import Main from "@/core/layout/Main.vue";

import { employeeRoutes } from "./modules/employee.routes";
import { settingsRoutes } from "./modules/settings.routes";
import { scheduleRoutes } from "./modules/schedule.routes";
// import { shiftRoutes } from "./modules/shift.routes";
import { calendarRoutes } from "./modules/calendar.routes";
import { EmployeeTimeOffRoutes } from "./modules/employeeTimeOff.routes";

export const appRoute: RouteRecordRaw = {
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

        employeeRoutes,
        settingsRoutes,
        scheduleRoutes,
        // shiftRoutes,
        calendarRoutes,
        EmployeeTimeOffRoutes
    ],
};
