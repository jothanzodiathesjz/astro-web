import type { DomainEmployeeSummary } from "../models/Employee";
import type { DomainOvertime } from "../models/Overtime";
import type { DomainShift } from "../models/Shift";
import type { DomainTimeOff } from "../models/TimeOff";
import type { TimestampsAttributes } from "../shared/TimestampsAttributes";

export type Attendance = TimestampsAttributes & {
    uuid: string;
    employee: DomainEmployeeSummary;
    shift: DomainShift;
    actual_check_in: string;
    actual_check_out: string;
    time_off: DomainTimeOff | null;
    over_time: DomainOvertime | null;
    status: string;
    attendance_date: string;
    is_late: boolean;
    notes?: string | null;
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

export type LogsType = TimestampsAttributes & {
    field: string;
    old_value: string;
    new_value: string;
    notes: string;
    inserted_by: string;
};
