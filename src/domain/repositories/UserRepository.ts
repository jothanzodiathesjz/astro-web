import type { DomainUser } from "../models/user";

export type UserRepository = {
    getAll: () => Promise<DomainUser[]>
    getOne: (id: string) => Promise<DomainUser | null>
};