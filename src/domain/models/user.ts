import type { UserAttributes } from "../types/UserAttributes";

export class DomainUser {
    uuid: string;
    name: string;
    email: string;
    password: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(init: UserAttributes) {
        this.uuid = init.uuid;
        this.name = init.name;
        this.email = init.email;
        this.password = init.password;
        this.role = init.role;
        this.createdAt = init.createdAt;
        this.updatedAt = init.updatedAt;
    }
}