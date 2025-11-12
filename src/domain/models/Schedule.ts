import { nanoid } from "nanoid";
import type { DailyAttendance } from "../types/AttendanceAttributes";
import type {
    DaySchedules,
    Schedule,
    SchedulerCalendar,
} from "../types/ScheduleAttributes";
import type { DomainEmployeeSummary } from "./Employee";
import type { DomainShift } from "./Shift";

export class DomainSchedule {
    uuid: string;
    name: string;
    effective_date: number;
    description: string;
    cycle_days: number;
    day_schedules: DomainDaySchedule[];
    inserted_by: string;
    is_assigned: boolean;
    created_at: number;
    updated_at?: number;
    deleted_at?: number;

    constructor(init: Schedule) {
        this.uuid = init.uuid;
        this.name = init.name;
        this.effective_date = init.effective_date;
        this.description = init.description;
        this.cycle_days = init.cycle_days;
        this.is_assigned = init.is_assigned;
        this.day_schedules = init.day_schedules.map(
            (day_schedule) => new DomainDaySchedule(day_schedule),
        );
        this.inserted_by = init.inserted_by;
        this.created_at = init.created_at;
        this.updated_at = init.updated_at;
        this.deleted_at = init.deleted_at;
    }
}

export class DomainDaySchedule {
    day: number;
    shift: DomainShift | null;

    constructor(init: DaySchedules) {
        this.day = init.day;
        this.shift = init.shift;
    }
}

export class DomainSchedulerCalendar {
    employee: DomainEmployeeSummary;
    daily_attendance: DailyAttendance[];

    constructor(init: SchedulerCalendar) {
        this.employee = init.employee;
        this.daily_attendance = init.daily_attendance;
    }
}

export class DomainEmployeeSchedule {
    uuid: string;
    branch_uuid: string;
    full_name: string;
    nick_name: string;
    employee_id: string;
    fingerprint_id: string;
    employee_schedule_uuid: string;
    schedule: DomainSchedule | null;
    employment_type: string | null;
    updated_at?: number;
    deleted_at?: number;

    constructor(init: {
        uuid?: string;
        branch_uuid: string;
        full_name: string;
        nick_name: string;
        employee_id: string;
        fingerprint_id: string;
        employee_schedule_uuid: string;
        schedule: DomainSchedule | null;
        employment_type?: string | null;
        updated_at?: number;
        deleted_at?: number;
    }) {
        this.uuid = init.uuid ?? nanoid();
        this.branch_uuid = init.branch_uuid;
        this.full_name = init.full_name;
        this.nick_name = init.nick_name;
        this.employee_id = init.employee_id;
        this.fingerprint_id = init.fingerprint_id;
        this.employee_schedule_uuid = init.employee_schedule_uuid;
        this.schedule = init.schedule;
        this.employment_type = init.employment_type ?? null;
        this.updated_at = init.updated_at;
        this.deleted_at = init.deleted_at;
    }
}
