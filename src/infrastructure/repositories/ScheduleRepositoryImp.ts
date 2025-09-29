import type { HttpRequest } from "@/api/httpRequest";
import { TOKENS } from "@/container/tokens";
import type { DomainDailyAttendance } from "@/domain/models/Attendance";
import {
    DomainEmployeeSchedule,
    DomainSchedulerCalendar,
    type DomainSchedule,
} from "@/domain/models/Schedule";
import type { DomainShift } from "@/domain/models/Shift";
import type { ScheduleRepository } from "@/domain/repositories/ScheduleRepository";
import type { DailyAttendance } from "@/domain/types/AttendanceAttributes";
import type {
    Scheduler,
    SchedulerCalendar,
    TimeOffToData,
} from "@/domain/types/ScheduleAttributes";
import type { IQueryMetadata } from "@/http-client/query-metadata";
import { injected } from "brandi";

export class ScheduleRepositoryImp implements ScheduleRepository {
    http: HttpRequest;

    constructor(http: HttpRequest) {
        this.http = http;
    }

    async getSchedule(uuid: string): Promise<DomainSchedule> {
        const response = await this.http.GET<DomainSchedule>(
            `/schedules/${uuid}`,
        );
        return response.data;
    }

    async createSchedule(schedule: DomainSchedule): Promise<DomainSchedule> {
        const response = await this.http.POST<DomainSchedule, DomainSchedule>(
            "/schedules",
            schedule,
        );
        return response.data;
    }

    async updateSchedule(schedule: DomainSchedule): Promise<DomainSchedule> {
        const response = await this.http.PUT<DomainSchedule, DomainSchedule>(
            `/schedules/${schedule.uuid}`,
            schedule,
        );
        return response.data;
    }

    async getScheduleList(query: IQueryMetadata): Promise<DomainSchedule[]> {
        const response = await this.http.GET<DomainSchedule[]>("/schedules", {
            ...query,
        });
        return response.data;
    }
    async deleteSchedule(uuid: string): Promise<void> {
        await this.http.DELETE(`/schedules/${uuid}`);
    }

    async createScheduler(scheduler: Scheduler, has_schedule: boolean): Promise<void> {
        if (has_schedule) {
            await this.http.PUT<void, Scheduler>(`employee-schedules`, scheduler);
            return;
        }
        await this.http.POST<void, Scheduler>(`employee-schedules`, scheduler);
    }

    async getSchedulers(
        query: IQueryMetadata,
    ): Promise<[DomainSchedulerCalendar[], string | undefined]> {
        const response = await this.http.GET<SchedulerCalendar[]>(
            `attendances/employee-scheduler`,
            { ...query },
        );

        return [
            response.data !== null
                ? response.data.map((u) => new DomainSchedulerCalendar(u))
                : [],
            response.next_cursor,
        ];
    }

    async updateScheduleOnScheduler(dailyAttendance: DomainDailyAttendance): Promise<DailyAttendance> {
        const response = await this.http.PUT<DailyAttendance, DomainShift>(
            `attendances/${dailyAttendance.uuid}`,
            dailyAttendance.shift,
        );
        return response.data;
    }

    async getEmployeeSchedules(query: IQueryMetadata): Promise<[DomainEmployeeSchedule[], string | undefined]> {
        const response = await this.http.GET<DomainEmployeeSchedule[]>(
            `employees/all-scheduler`,
            { ...query },
        );
        return [
            response.data !== null
                ? response.data.map((u) => new DomainEmployeeSchedule(u))
                : [],
            response.next_cursor,
        ];
    }

    async setTimeOffSchedule(uuid: string, data: TimeOffToData): Promise<void> {
        await this.http.POST<void, TimeOffToData>(`employee-timeoffs/${uuid}`, data);
    }
}

injected(ScheduleRepositoryImp, TOKENS.httpRequest);
