// src/container/container.ts
import { Container } from 'brandi';
import { TOKENS } from './tokens';

import { HttpRequest } from '@/api/httpRequest';
import { AuthRepositoryImp } from '@/infrastructure/repositories/AuthRepositoryImp';
import { UserRepositoryImp } from '@/infrastructure/repositories/UserRepositoryImp';
import { UserFormViewModel } from '@/user/UserFormViewModel';
import { EmployeeRepositoryImp } from '@/infrastructure/repositories/EmployeeRepositoryImp';
import { EmployeeFormViewModel } from '@/employee/EmployeeForm.vm';
import { DepartmentRepositoryImp } from '@/infrastructure/repositories/DepartmentRepositoryImp';
import { TimeOffRepositoryImp } from '@/infrastructure/repositories/TimeOffRepositoryImp';
import { CompanyRepositoryImp } from '@/infrastructure/repositories/CompanyRepositoryImp';
import { BranchRepositoryImp } from '@/infrastructure/repositories/BranchRepositoryImp';
import { ShiftRepositoryImp } from '@/infrastructure/repositories/ShiftRepositoryImp';
import { ScheduleRepositoryImp } from '@/infrastructure/repositories/ScheduleRepositoryImp';
import { ScheduleFormViewModel } from '@/schedule/ScheduleForm.vm';
import { AttendanceRepositoryImp } from '@/infrastructure/repositories/AttendanceRepositoryImp';

export const container = new Container();

container
    .bind(TOKENS.httpRequest)
    .toInstance(() => new HttpRequest(import.meta.env.VITE_API_URL))
    .inSingletonScope();

container
    .bind(TOKENS.authRepository)
    .toInstance(AuthRepositoryImp)
    .inSingletonScope();
container
    .bind(TOKENS.UserRepository)
    .toInstance(UserRepositoryImp)
    .inSingletonScope();
container
    .bind(TOKENS.EmployeeRepository)
    .toInstance(EmployeeRepositoryImp)
    .inSingletonScope();
container
    .bind(TOKENS.DepartmentRepository)
    .toInstance(DepartmentRepositoryImp)
    .inSingletonScope();
container
    .bind(TOKENS.TimeOffRepository)
    .toInstance(TimeOffRepositoryImp)
    .inSingletonScope();
container
    .bind(TOKENS.CompanyRepository)
    .toInstance(CompanyRepositoryImp)
    .inSingletonScope();
container
    .bind(TOKENS.BranchRepository)
    .toInstance(BranchRepositoryImp)
    .inSingletonScope();
container
    .bind(TOKENS.ShiftRepository)
    .toInstance(ShiftRepositoryImp)
    .inSingletonScope();
container
    .bind(TOKENS.ScheduleRepository)
    .toInstance(ScheduleRepositoryImp)
    .inSingletonScope();
container
    .bind(TOKENS.attendanceRepository)
    .toInstance(AttendanceRepositoryImp)
    .inSingletonScope();


// view models

container
    .bind(TOKENS.UserFormViewModel)
    .toInstance(UserFormViewModel)
    .inTransientScope();
container
    .bind(TOKENS.EmployeeFormViewModel)
    .toInstance(EmployeeFormViewModel)
    .inTransientScope();
container
    .bind(TOKENS.ScheduleFormViewModel)
    .toInstance(ScheduleFormViewModel)
    .inTransientScope();