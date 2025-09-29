import type {
    Gender,
    Role,
    UserAttributes,
    UserWithPassword,
} from "../types/UserAttributes";
import { v4 as uuidv4 } from 'uuid';

export class DomainUser implements UserAttributes {
    branch_uuid: string;
    name: string;
    email: string;
    employee_id: string;
    dob: string;
    gender: string;
    role: Role;
    uuid: string;
    created_at: number;
    updated_at?: number | undefined;
    username: string;

    constructor(init: UserAttributes) {
        this.uuid = init.uuid || uuidv4();
        this.name = init.name;
        this.email = init.email;
        this.username = init.username;
        this.employee_id = init.employee_id;
        this.dob = init.dob;
        this.gender = init.gender;
        this.role = init.role;
        this.branch_uuid = init.branch_uuid;
        this.created_at = init.created_at;
        this.updated_at = init.updated_at;
    }

    static empty() {
        return new DomainUser({
            uuid: "",
            name: "",
            email: "",
            username: "",
            employee_id: "",
            dob: "",
            gender: "",
            role: { name: "", access_codes: [] },
            branch_uuid: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
            created_at: 0,
        });
    }

    toData(password: string, confirm_password: string, gender: Gender, birthdate: string, role: string, access: string[]) {
        return new DomainUserWithPassword({
            ...this,
            password: password,
            confirm_password: confirm_password,
            gender: gender,
            dob: birthdate,
            role: { name: role, access_codes: access },
            created_at: new Date().getTime(),
        });
    }
}

export class DomainUserWithPassword extends DomainUser {
    password: string;
    confirm_password: string;
    constructor(init: UserWithPassword) {
        super(init);
        this.password = init.password;
        this.confirm_password = init.confirm_password;
    }
}
