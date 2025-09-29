import type { Attendance, DailyAttendance } from "../types/AttendanceAttributes";
import type { DomainEmployeeSummary } from "./Employee";
import type { DomainShift } from "./Shift";

// src/domain/models/attendance.ts
export class DomainAttendance {
    uuid: string;
    employee: DomainEmployeeSummary;
    shift: DomainShift;
    actual_check_in: string;
    actual_check_out: string;
    time_off: string;
    over_time: string;
    status: string;
    attendance_date: string;
    created_at?: number;
    updated_at?: number;
    deleted_at?: number;

    constructor(init: Attendance) {
        this.uuid = init.uuid;
        this.employee = init.employee;
        this.shift = init.shift;
        this.actual_check_in = init.actual_check_in;
        this.actual_check_out = init.actual_check_out;
        this.time_off = init.time_off;
        this.over_time = init.over_time;
        this.status = init.status;
        this.attendance_date = init.attendance_date;
        this.created_at = init.created_at;
        this.updated_at = init.updated_at;
        this.deleted_at = init.deleted_at;
    }
}

export class DomainDailyAttendance {
    uuid: string;
    attendance_date: string;
    shift: DomainShift;

    constructor(init: DailyAttendance) {
        this.uuid = init.uuid;
        this.attendance_date = init.attendance_date;
        this.shift = init.shift;
    }
}
