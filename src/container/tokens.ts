// src/container/tokens.ts
import { token } from 'brandi';
import type { HttpRequest } from '@/api/httpRequest';
import type { AttendanceRepository } from '@/domain/repositories/AttendanceRepository';
import type { AuthRepository } from '@/domain/repositories/AuthRepository';
export const TOKENS = {
    // Services
    httpRequest: token<HttpRequest>('httpRequest'),

    // Repositories
    authRepository: token<AuthRepository>('AUTH_REPOSITORY'),
    attendanceRepository: token<AttendanceRepository>('ATTENDANCE_REPOSITORY'),
};