import { nanoid } from "nanoid";
import type { EmployeeTimeOff, TimeOff, TimeOffPolicy } from "../types/TimeOffAttributes";
import type { DomainEmployee } from "./Employee";

export class DomainTimeOff {
    uuid: string;
    name: string;
    code: string;
    description: string;
    category: string;
    duration_type: string;
    tolerance_minutes: number;
    is_paid: boolean;
    is_deduct_leave: boolean;

    constructor(init: TimeOff) {
        this.uuid = init.uuid || nanoid();
        this.name = init.name;
        this.code = init.code;
        this.description = init.description;
        this.category = init.category;
        this.duration_type = init.duration_type;
        this.tolerance_minutes = init.tolerance_minutes;
        this.is_paid = init.is_paid;
        this.is_deduct_leave = init.is_deduct_leave;
    }

    static empty() {
        return new DomainTimeOff({
            uuid: "",
            name: "",
            code: "",
            description: "",
            category: "",
            duration_type: "",
            tolerance_minutes: 0,
            is_paid: false,
            is_deduct_leave: false,
        });
    }
}

export class EmployeeTimeOffToData {
    date: number[];
    employee_uuid: string;
    time_off: DomainTimeOff;

    constructor(date: number[], employee_uuid: string, time_off: DomainTimeOff) {
        this.date = date;
        this.employee_uuid = employee_uuid;
        this.time_off = time_off;
    }
}

export class DomainEmployeeTimeOff {
    uuid: string;
    branch_uuid: string;
    date: number;
    time_off_date: string;
    employee: DomainEmployee;
    time_off: DomainTimeOff;
    inserted_by: string;
    created_at?: number;

    constructor(init: EmployeeTimeOff) {
        this.uuid = init.uuid;
        this.branch_uuid = init.branch_uuid;
        this.date = init.date;
        this.time_off_date = init.time_off_date;
        this.employee = init.employee;
        this.time_off = init.time_off;
        this.inserted_by = init.inserted_by;
        this.created_at = init.created_at;
    }
}

export class DomainTimeOffPolicy {
    time_off: DomainTimeOff;
    employee_uuid: string[];
    quota: number;
    start_date: number;
    end_date: number;

    constructor(init: TimeOffPolicy) {
        this.time_off = init.time_off;
        this.employee_uuid = init.employee_uuid;
        this.quota = init.quota;
        this.start_date = init.start_date;
        this.end_date = init.end_date;
    }
}

