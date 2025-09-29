import type { HttpRequest } from "@/api/httpRequest";
import { TOKENS } from "@/container/tokens";
import { DomainUser, DomainUserWithPassword } from "@/domain/models/User";
import type { UserRepository } from "@/domain/repositories/UserRepository";
import type { UserAttributes } from "@/domain/types/UserAttributes";
import type { IQueryMetadata } from "@/http-client/query-metadata";
import { injected } from "brandi";

export class UserRepositoryImp implements UserRepository {
    http: HttpRequest

    constructor(http: HttpRequest) {
        this.http = http;
    }
    async getAll(query?: IQueryMetadata): Promise<DomainUser[]> {
        const response = await this.http.GET<UserAttributes[]>("users", { ...query });
        return response.data.map((u) => new DomainUser(u));
    }

    async create(user: DomainUserWithPassword): Promise<DomainUser> {
        const response = await this.http.POST<UserAttributes, DomainUserWithPassword>("users", user);
        return new DomainUser(response.data);
    }
    async getOne(): Promise<DomainUser> {
        const response = await this.http.GET<UserAttributes>(`user`);
        return new DomainUser(response.data);
    }

    async update(user: DomainUser): Promise<DomainUser> {
        const response = await this.http.PUT<UserAttributes, DomainUser>(`users/${user.uuid}`, user);
        return new DomainUser(response.data);
    }

}

injected(UserRepositoryImp, TOKENS.httpRequest);