// src/domain/repositories/IAttendanceRepository.ts
import type { IQueryMetadata } from "@/http-client/query-metadata";
import type {
    DomainAttendance,
    DomainAttendanceLogs,
} from "../models/Attendance";

export interface AttendanceRepository {
    getAttendanceList(
        query?: IQueryMetadata,
    ): Promise<[DomainAttendance[], string | undefined]>;
    checkIn(userId: string): Promise<DomainAttendance>;
    update(attendance: DomainAttendance): Promise<DomainAttendance>;
    getLogs(uuid: string): Promise<DomainAttendanceLogs>;
}
