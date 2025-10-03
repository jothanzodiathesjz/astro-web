import type { HttpRequest } from "@/api/httpRequest";
import { TOKENS } from "@/container/tokens";
import type {
    DomainAttendance,
    DomainAttendanceLogs,
} from "@/domain/models/Attendance";
import type { AttendanceRepository } from "@/domain/repositories/AttendanceRepository";
import type { IQueryMetadata } from "@/http-client/query-metadata";
import { injected } from "brandi";

export class AttendanceRepositoryImp implements AttendanceRepository {
    http: HttpRequest;

    constructor(http: HttpRequest) {
        this.http = http;
    }

    async getAttendanceList(
        query?: IQueryMetadata,
    ): Promise<[DomainAttendance[], string | undefined]> {
        const response = await this.http.GET<DomainAttendance[]>(
            `/attendances`,
            { ...query },
        );
        if (!response.data) {
            return [[], undefined];
        }
        return [response.data, response.next_cursor];
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
}

injected(AttendanceRepositoryImp, TOKENS.httpRequest);
