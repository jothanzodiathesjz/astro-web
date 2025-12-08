import type { DomainEmployee } from "../models/Employee";
import type { DomainTimeOff } from "../models/TimeOff";

export type TimeOff = {
    uuid?: string;
    name: string;
    code: string;
    description: string;
    category: string;
    duration_type: string;
    tolerance_minutes: number;
    is_paid: boolean;
    is_deduct_leave: boolean;
};


export type EmployeeTimeOff = {
    uuid: string;
    branch_uuid: string;
    date: number;
    time_off_date: string;
    employee: DomainEmployee;
    time_off: DomainTimeOff;
    inserted_by: string;
    created_at?: number;
}