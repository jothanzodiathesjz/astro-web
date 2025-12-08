// src/router/modules/schedule.routes.ts
import type { RouteRecordRaw } from "vue-router";

export const scheduleRoutes: RouteRecordRaw = {
    path: "schedule",
    children: [
        {
            path: "",
            name: "ScheduleIndex",
            component: () => import("@/schedule/Schedule.index.vue"),
            children: [
                {
                    path: "index",
                    name: "Schedule",
                    component: () => import("@/schedule/Schedule.vue"),
                },
                {
                    path: "main",
                    name: "Scheduler",
                    component: () => import("@/schedule/Scheduler.vue"),
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
};
