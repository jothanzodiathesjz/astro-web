import type { HttpRequest } from "@/http-client/httpRequest";
import { TOKENS } from "@/container/tokens";
import type { AuthRepository } from "@/domain/repositories/AuthRepository";
import { injected } from "brandi";

export class AuthRepositoryImp implements AuthRepository {
    httpRequest: HttpRequest;

    constructor(httpRequest: HttpRequest) {
        this.httpRequest = httpRequest;
    }

    login(email: string, password: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    logout(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

injected(AuthRepositoryImp, TOKENS.httpRequest);
