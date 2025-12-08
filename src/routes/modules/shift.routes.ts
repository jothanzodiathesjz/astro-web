// src/router/modules/shift.routes.ts
import type { RouteRecordRaw } from "vue-router";

export const shiftRoutes: RouteRecordRaw = {
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
};
