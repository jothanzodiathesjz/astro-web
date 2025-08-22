import type { HttpRequest } from "@/api/httpRequest";
import { DomainUser } from "@/domain/models/user";
import type { UserRepository } from "@/domain/repositories/UserRepository";
import type { UserAttributes } from "@/domain/types/UserAttributes";

export class UserRepositoryImp implements UserRepository {
    http: HttpRequest

    constructor(http: HttpRequest) {
        this.http = http;
    }
    async getAll(): Promise<DomainUser[]> {
        const response = await this.http.GET<UserAttributes[]>("users");
        return response.data.map((u) => new DomainUser(u));
    }
    getOne(id: string): Promise<DomainUser | null> {
        throw new Error("Method not implemented." + id);
    }
}