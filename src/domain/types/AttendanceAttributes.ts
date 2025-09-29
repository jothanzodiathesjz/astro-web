import type { DomainEmployeeSummary } from "../models/Employee";
import type { DomainShift } from "../models/Shift";
import type { TimestampsAttributes } from "../shared/TimestampsAttributes";

export type Attendance = TimestampsAttributes & {
    uuid: string;
    employee: DomainEmployeeSummary;
    shift: DomainShift;
    actual_check_in: string;
    actual_check_out: string;
    time_off: string;
    over_time: string;
    status: string;
    attendance_date: string;
}

export type DailyAttendance = {
    uuid: string;
    attendance_date: string;
    shift: DomainShift;
}