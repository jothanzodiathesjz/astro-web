import type { HttpRequest } from "@/http-client/httpRequest";
import { TOKENS } from "@/container/tokens";
import {
    DomainAttendance,
    type DomainAttendanceLogs,
} from "@/domain/models/Attendance";
import type { AttendanceRepository } from "@/domain/repositories/AttendanceRepository";
import type { IQueryMetadata } from "@/http-client/query-metadata";
import { injected } from "brandi";
import { useAuthStore } from "@/auth/store/Auth.store";
import type { Attendance } from "@/domain/types/AttendanceAttributes";
import { AttendanceOvertimeDto } from "../dtos/Attendance.dto";
import type { DomainOvertime } from "@/domain/models/Overtime";

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

    async getAttendanceSse(): Promise<Response> {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/attendances/verify-attendance/stream`,
            {
                headers: {
                    Authorization: `Bearer ${useAuthStore().token}`,
                    "Content-Type": "text/event-stream",
                    'ngrok-skip-browser-warning': 'true',
                },
                referrerPolicy: "no-referrer",
            }
        )

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
                date,
                employee_uuid: uuid,
                over_time: overtime
            }),
        )
    }

}

injected(AttendanceRepositoryImp, TOKENS.httpRequest);
