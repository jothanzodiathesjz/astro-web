// src/domain/repositories/IAttendanceRepository.ts
import type { IQueryMetadata } from "@/http-client/query-metadata";
import type {
    DomainAttendance,
    DomainAttendanceLogs,
} from "../models/Attendance";
import type { DomainOvertime } from "../models/Overtime";

export interface AttendanceRepository {
    getAttendanceList(
        query?: IQueryMetadata,
    ): Promise<[DomainAttendance[], string | undefined]>;
    checkIn(userId: string): Promise<DomainAttendance>;
    update(attendance: DomainAttendance): Promise<DomainAttendance>;
    getLogs(uuid: string): Promise<DomainAttendanceLogs>;
    verifyAttendance(file: File): Promise<Response>;
    getAttendanceSse(signal?: AbortSignal): Promise<Response>;
    delete(uuid: string): Promise<void>;
    updateAttendanceOvertime(
        date: number,
        uuid: string[],
        overtime: DomainOvertime,
    ): Promise<void>;
    deleteAttendanceOvertime(uuid: string): Promise<void>;
}
