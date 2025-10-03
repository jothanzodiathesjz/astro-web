import type { Response } from "./response";

export class UnprocessableEntityException extends Error {
    constructor(public readonly response: Response) {
        super(response.message);
    }
}

export class InternalServerErrorException extends Error {
    constructor(public readonly response: Response) {
        super(response.message);
    }
}

export class NotFoundException extends Error {
    constructor(public readonly response: Response) {
        super(response.message);
    }
}

export class UnauthorizedException extends Error {
    constructor(public readonly response: Response) {
        super(response.message);
    }
}

export class ConflictException extends Error {
    constructor(public readonly response: Response) {
        super(response.message);
    }
}

export class RequestEntityTooLargeException extends Error {
    constructor(public readonly response: Response) {
        super(response.message);
    }
}

export function throwExceptionFromStatusCode<T>(
    status: number,
    errorResponse: Response<T>,
): void {
    const errorBody = errorResponse ?? { code: status }; // Cast ke any untuk mengakses data

    // Periksa status code dan lemparkan exception yang sesuai
    switch (status) {
        case 401:
            // Jika token expired, kita akan tangani di luar switch ini,
            // namun jika 401 karena alasan lain, lempar UnauthorizedException.
            throw new UnauthorizedException(errorBody);
        case 404:
            throw new NotFoundException(errorBody);
        case 409:
            throw new ConflictException(errorBody);
        case 413:
            throw new RequestEntityTooLargeException(errorBody);
        case 422:
            throw new UnprocessableEntityException(errorBody);
        case 500:
        default:
            // Untuk semua error 5xx atau yang tidak terdefinisi
            throw new InternalServerErrorException(errorBody);
    }
}
