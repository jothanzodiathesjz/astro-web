import { BaseEntity } from "../shared/Base";
import type {
    Attendance,
    AttendanceLogs,
    DailyAttendance,
    LogsType,
} from "../types/AttendanceAttributes";
import type { DomainEmployeeSummary } from "./Employee";
import type { DomainOvertime } from "./Overtime";
import type { DomainShift } from "./Shift";
import type { DomainTimeOff } from "./TimeOff";

// src/domain/models/attendance.ts
export class DomainAttendance extends BaseEntity {
    uuid: string;
    employee: DomainEmployeeSummary;
    shift: DomainShift;
    actual_check_in: string;
    actual_check_out: string;
    time_off: DomainTimeOff | null;
    over_time: DomainOvertime | null;
    status: string;
    attendance_date: string;
    date: Date;
    is_late: boolean;
    notes: string | null;
    is_modify?: string;
    minutes_late?: number;
    minutes_early?: number;
    is_early_leave?: boolean;

    constructor(init: Attendance) {
       super(init);
        this.uuid = init.uuid;
        this.employee = init.employee;
        this.shift = init.shift;
        this.actual_check_in = init.actual_check_in;
        this.actual_check_out = init.actual_check_out;
        this.time_off = init.time_off;
        this.over_time = init.over_time;
        this.status = init.status;
        this.attendance_date = init.attendance_date;
        this.date = new Date(init.date);
        this.is_late = init.is_late;
        this.notes = init.notes ?? null;
        this.is_modify = init.is_modify;
        this.minutes_late = init.minutes_late;
        this.minutes_early = init.minutes_early;
        this.is_early_leave = init.is_early_leave;
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

export class DomainAttendanceLogs {
    uuid: string;
    attendance_uuid: string;
    logs: LogsType[];
    created_at: number;
    updated_at?: number;

    constructor(init: AttendanceLogs) {
        this.uuid = init.uuid;
        this.attendance_uuid = init.attendance_uuid;
        this.logs = init.logs.map((log) => log);
        this.created_at = init.created_at;
        this.updated_at = init.updated_at;
    }
}
