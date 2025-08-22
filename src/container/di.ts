// src/container/container.ts
import { Container } from 'brandi';
import { TOKENS } from './tokens';

import { HttpRequest } from '@/api/httpRequest';
import { AuthRepositoryImp } from '@/infrastructure/repositories/AuthRepositoryImp';

export const container = new Container();

container
    .bind(TOKENS.httpRequest)
    .toInstance(() => new HttpRequest('https://your-api-url.com'))
    .inSingletonScope();

container
    .bind(TOKENS.authRepository)
    .toInstance(AuthRepositoryImp)
    .inSingletonScope();

// container
//     .bind(TOKENS.attendanceRepository)
//     .toInstance(AttendanceRepository)
//     .inSingletonScope();