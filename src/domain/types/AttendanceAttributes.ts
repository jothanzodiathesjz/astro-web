import type { DomainEmployeeSummary } from "../models/Employee";
import type { DomainOvertime } from "../models/Overtime";
import type { DomainShift } from "../models/Shift";
import type { DomainTimeOff } from "../models/TimeOff";
import type { BaseEntity } from "../shared/Base";

export type Attendance = BaseEntity & {
    uuid: string;
    employee: DomainEmployeeSummary;
    shift: DomainShift;
    actual_check_in: string;
    actual_check_out: string;
    time_off: DomainTimeOff | null;
    over_time: DomainOvertime | null;
    status: string;
    attendance_date: string;
    date: number;
    is_late: boolean;
    notes?: string | null;
    is_modify?: string;
    minutes_late?: number;
    minutes_early?: number;
    is_early_leave?: boolean;
};

export type DailyAttendance = {
    uuid: string;
    attendance_date: string;
    shift: DomainShift;
};

export type AttendanceLogs = {
    uuid: string;
    attendance_uuid: string;
    logs: LogsType[];
    created_at: number;
    updated_at?: number;
};

export type LogsType = BaseEntity & {
    field: string;
    old_value: string;
    new_value: string;
    notes: string;
};

export type AttendanceSummary = {
    total_employee: number;
    present: PresentSummary;
    absent: AbsentSummary;
};

export type PresentSummary = {
    total: number;
    on_time: number;
    late: number;
    early_leave: number;
    over_time: number;
    incomplete: IncompleteSummary;
};

export type IncompleteSummary = {
    no_check_in: number;
    no_check_out: number;
};

export type AbsentSummary = {
    total: number;
    time_off: number;
    day_off: number;
};
