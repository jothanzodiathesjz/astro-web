import {
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
    UnprocessableEntityException,
} from "@/http-client/exceptions";

export class UIError {
    constructor(
        public readonly message: string,
        public readonly data?: any,
        public readonly code?: number,
    ) {}

    static unknown(): UIError {
        return new UIError("Unknown error");
    }
}

export function handleErrors(error: unknown): UIError {
    // Handle case when error is already an AppError
    if (error instanceof UnprocessableEntityException) {
        return new UIError(error.message, error.response.data);
    }

    if (error instanceof InternalServerErrorException) {
        return new UIError(error.message, error.response.data);
    }

    if (error instanceof NotFoundException) {
        return new UIError(
            error.message,
            error.response.data,
            error.response.code,
        );
    }

    if (error instanceof UnauthorizedException) {
        return new UIError(error.message, error.response.data);
    }

    if (error instanceof ConflictException) {
        return new UIError(error.message, error.response.data);
    }

    if (error instanceof Error) {
        return new UIError(error.message);
    }

    return new UIError("Unknown error");
}
