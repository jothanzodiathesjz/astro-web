
import type { DomainEmployeeSummary } from "../models/Employee";
import type { DomainShift } from "../models/Shift";
import type { TimestampsAttributes } from "../shared/TimestampsAttributes";
import type { DailyAttendance } from "./AttendanceAttributes";

export type Schedule = TimestampsAttributes & {
    uuid: string;
    name: string;
    effective_date: number;
    description: string;
    cycle_days: number;
    day_schedules: DaySchedules[];
    inserted_by: string;
};

export type DaySchedules = {
    day: number;
    shift: DomainShift | null;
}

export type Scheduler = {
    schedule_uuid: string;
    employee_uuid: string[];
    effective_date: number;
}


export type SchedulerCalendar = {
    employee: DomainEmployeeSummary;
    daily_attendance: DailyAttendance[];
}

export type TimeOffToData = {
    date: number[];
    time_off_uuid: string;
}