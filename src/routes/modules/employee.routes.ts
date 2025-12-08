// src/router/modules/employee.routes.ts
import type { RouteRecordRaw } from "vue-router";

export const employeeRoutes: RouteRecordRaw = {
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
        {
            path: ":uuid",
            name: "EmployeeDetail",
            component: () => import("@/employee/Employee.form.vue"),
        },
    ],
};
