import type { DomainEmployeeSummary } from "@/domain/models/Employee";
import type { DailyAttendance } from "@/domain/types/AttendanceAttributes";

export type UIScheduler = {
    schedule_uuid: string;
    employee_uuid: DomainEmployeeSummary[];
    effective_date: number;
    has_schedule: boolean;
}


export type UpdateShiftAtt = {
    employee: DomainEmployeeSummary;
    shift: DailyAttendance;
    date: Date;
};