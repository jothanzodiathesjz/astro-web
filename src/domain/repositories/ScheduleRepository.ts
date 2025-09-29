import type { IQueryMetadata } from "@/http-client/query-metadata"
import type { DomainEmployeeSchedule, DomainSchedule, DomainSchedulerCalendar } from "../models/Schedule"
import type { Scheduler, TimeOffToData } from "../types/ScheduleAttributes";
import type { DomainDailyAttendance } from "../models/Attendance";

export type ScheduleRepository = {
    getSchedule(uuid: string): Promise<DomainSchedule>;
    getScheduleList(query: IQueryMetadata): Promise<DomainSchedule[]>;
    createSchedule(schedule: DomainSchedule): Promise<DomainSchedule>;
    updateSchedule(schedule: DomainSchedule): Promise<DomainSchedule>;
    deleteSchedule(uuid: string): Promise<void>;
    createScheduler(scheduler: Scheduler, has_schedule: boolean): Promise<void>;
    getSchedulers(query: IQueryMetadata): Promise<[DomainSchedulerCalendar[], string | undefined]>;
    updateScheduleOnScheduler(dailyAttendance: DomainDailyAttendance): Promise<DomainDailyAttendance>;
    getEmployeeSchedules(query: IQueryMetadata): Promise<[DomainEmployeeSchedule[], string | undefined]>;
    setTimeOffSchedule(uuid: string, data: TimeOffToData): Promise<void>;
}