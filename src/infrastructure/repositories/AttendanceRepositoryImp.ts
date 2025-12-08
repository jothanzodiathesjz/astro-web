import type { HttpRequest } from "@/http-client/httpRequest";
import { TOKENS } from "@/container/tokens";
import {
    DomainAttendance,
    DomainAttendanceSummary,
    mapAttendanceSummaryToDomain,
    type DomainAttendanceLogs,
} from "@/domain/models/Attendance";
import type { AttendanceRepository } from "@/domain/repositories/AttendanceRepository";
import type { IQueryMetadata } from "@/http-client/query-metadata";
import { injected } from "brandi";
import { useAuthStore } from "@/auth/store/Auth.store";
import type { Attendance, AttendanceSummary } from "@/domain/types/AttendanceAttributes";
import { AttendanceOvertimeDto } from "../dtos/Attendance.dto";
import type { DomainOvertime } from "@/domain/models/Overtime";
import { fetchSse } from "@/http-client/sseFetch";
import { formatDate } from "@/core/utils/DateConverter";
import { DomainEmployeeSummary } from "@/domain/models/Employee";

export class AttendanceRepositoryImp implements AttendanceRepository {
    http: HttpRequest;

    private readonly verifyUrl = new URL(
        "/attendances/verify-attendance",
        import.meta.env.VITE_API_URL,
    ).toString();


    constructor(http: HttpRequest) {
        this.http = http;
    }

    async getAttendanceList(
        query?: IQueryMetadata,
    ): Promise<[DomainAttendance[], string | undefined]> {
        const response = await this.http.GET<Attendance[]>(
            `/attendances`,
            { ...query },
        );
        if (!response.data) {
            return [[], undefined];
        }
        return [response.data.map((u) => new DomainAttendance(u)), response.next_cursor];
    }

    async checkIn(userId: string): Promise<DomainAttendance> {
        const response = await this.http.GET<DomainAttendance>(
            `/attendances/${userId}`,
        );
        return response.data;
    }

    async update(attendance: DomainAttendance): Promise<DomainAttendance> {
        const response = await this.http.PUT<
            DomainAttendance,
            DomainAttendance
        >(`/attendances/${attendance.uuid}/update-attendance`, attendance);
        return response.data;
    }

    async getLogs(uuid: string): Promise<DomainAttendanceLogs> {
        const response = await this.http.GET<DomainAttendanceLogs>(
            `/attendances/${uuid}/logs`,
        );
        return response.data;
    }

    async verifyAttendance(file: File): Promise<Response> {
        const formData = new FormData();
        formData.append("attendance_file", file);

        const headers: HeadersInit = {};
        const authStore = useAuthStore();
        if (authStore.token) headers.Authorization = `Bearer ${authStore.token}`;

        const response = await fetch(this.verifyUrl, {
            method: "POST",
            body: formData,
            headers,
        });

        if (!response.ok) {
            throw new Error(`Verify attendance gagal (status ${response.status})`);
        }

        return response;
    }

    async getAttendanceSse(signal?: AbortSignal): Promise<Response> {
        const url = new URL(
            "/attendances/verify-attendance/stream",
            import.meta.env.VITE_API_URL,
        ).toString();
        const response = await fetchSse(url, { signal });

        if (!response.ok) {
            throw new Error(`Verify attendance gagal (status ${response.status})`);
        }

        return response;
    }

    async delete(uuid: string): Promise<void> {
        await this.http.DELETE(`/attendances/${uuid}`);
    }

    async updateAttendanceOvertime(date: number, uuid: string[], overtime: DomainOvertime): Promise<void> {
        await this.http.PUT<void, AttendanceOvertimeDto>(
            `/attendances/over-time`,
            new AttendanceOvertimeDto({
                date: formatDate(new Date(date)),
                employee_uuid: uuid,
                over_time: overtime
            }),
        )
    }

    async deleteAttendanceOvertime(uuid: string): Promise<void> {
        await this.http.DELETE(`/attendances/${uuid}/over-time`);
    }

    async getTotals(query?: IQueryMetadata): Promise<DomainAttendanceSummary> {
        const response = await this.http.GET<AttendanceSummary
        >(
            `/summary/attendance`, {
            ...query,
        },
        );
        return mapAttendanceSummaryToDomain(response.data);
    }

    async getEmployeeSummary(query?: IQueryMetadata): Promise<[DomainEmployeeSummary[], string | undefined]> {
        const response = await this.http.GET<any[]>(
            `/summary/daily-attendance/employees`, {
            ...query,
        },
        );
        return [response.data.map((u) => new DomainEmployeeSummary(u)), response.next_cursor];
    }
}

injected(AttendanceRepositoryImp, TOKENS.httpRequest);
