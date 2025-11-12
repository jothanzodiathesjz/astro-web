import type { BaseEntity } from "../shared/Base";

export type Gender = "M" | "F";

export type UserAttributes = BaseEntity & {
    uuid?: string;
    branch_uuid: string;
    username: string;
    email: string;
    name: string;
    gender: string;
    dob: string;
    employee_id: string;
    role: Role;
};

export type Role = {
    name: string;
    access_codes: string[];
};

export type UserWithPassword = UserAttributes & {
    password: string;
    confirm_password: string;
};
