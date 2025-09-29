// src/container/tokens.ts
import { token } from 'brandi';
import type { HttpRequest } from '@/api/httpRequest';
import type { AttendanceRepository } from '@/domain/repositories/AttendanceRepository';
import type { AuthRepository } from '@/domain/repositories/AuthRepository';
import type { UserRepository } from '@/domain/repositories/UserRepository';
import type { UserFormViewModel } from '@/user/UserFormViewModel';
import type { EmployeeRepository } from '@/domain/repositories/EmployeeRepository';
import type { EmployeeFormViewModel } from '@/employee/EmployeeForm.vm';
import type { DepartmentRepository } from '@/domain/repositories/DepartmentRepository';
import type { TimeOffRepository } from '@/domain/repositories/TimeOffRepository';
import type { CompanyRepository } from '@/domain/repositories/CompanyRepository';
import type { BranchRepository } from '@/domain/repositories/BranchRepository';
import type { ShiftRepository } from '@/domain/repositories/ShiftRepository';
import type { ScheduleRepository } from '@/domain/repositories/ScheduleRepository';
import type { ScheduleFormViewModel } from '@/schedule/ScheduleForm.vm';
export const TOKENS = {
    // Services
    httpRequest: token<HttpRequest>('httpRequest'),

    // Repositories
    authRepository: token<AuthRepository>('AUTH_REPOSITORY'),
    attendanceRepository: token<AttendanceRepository>('ATTENDANCE_REPOSITORY'),
    UserRepository: token<UserRepository>('USER_REPOSITORY'),
    EmployeeRepository: token<EmployeeRepository>('EMPLOYEE_REPOSITORY'),
    DepartmentRepository: token<DepartmentRepository>('DEPARTMENT_REPOSITORY'),
    TimeOffRepository: token<TimeOffRepository>('TIME_OFF_REPOSITORY'),
    CompanyRepository: token<CompanyRepository>('COMPANY_REPOSITORY'),
    BranchRepository: token<BranchRepository>('BRANCH_REPOSITORY'),
    ShiftRepository: token<ShiftRepository>('SHIFT_REPOSITORY'),
    ScheduleRepository: token<ScheduleRepository>('SCHEDULE_REPOSITORY'),


    // View Models
    UserFormViewModel: token<UserFormViewModel>('USER_FORM_VIEW_MODEL'),
    EmployeeFormViewModel: token<EmployeeFormViewModel>('EMPLOYEE_FORM_VIEW_MODEL'),
    ScheduleFormViewModel: token<ScheduleFormViewModel>('SCHEDULE_FORM_VIEW_MODEL'),
};
