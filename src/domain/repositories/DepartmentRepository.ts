import type { Department } from "../types/EmployeeAttributes";

export type DepartmentRepository = {
    getDepartments: () => Promise<Department[]>;
    create(department: Department): Promise<Department>;
    delete(code: string): Promise<void>;
};
