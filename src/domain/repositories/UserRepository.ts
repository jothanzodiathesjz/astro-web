import type { IQueryMetadata } from "@/http-client/query-metadata";
import type { DomainUser, DomainUserWithPassword } from "../models/User";

export type UserRepository = {
    getAll(query?: IQueryMetadata): Promise<DomainUser[]>;
    getOne(): Promise<DomainUser>;
    create(user: DomainUserWithPassword): Promise<DomainUser>;
    update(user: DomainUser): Promise<DomainUser>;
};
