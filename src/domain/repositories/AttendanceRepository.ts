// src/domain/repositories/IAttendanceRepository.ts
import type { Attendance } from '../models/attendance';

export interface AttendanceRepository {
    getAttendanceList(date: Date): Promise<Attendance[]>;
    checkIn(userId: string): Promise<Attendance>;
}