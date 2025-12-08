// src/router/modules/calendar.routes.ts
import type { RouteRecordRaw } from "vue-router";

export const calendarRoutes: RouteRecordRaw = {
    path: "calendar",
    children: [
        {
            path: "",
            name: "Calendar",
            component: () => import("@/calendar/Calendar.index.vue"),
        },
    ],
};
