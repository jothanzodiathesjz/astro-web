import { nanoid } from "nanoid";
import type { Address } from "../shared/Address";
import type {
    BankDetail,
    ContactDetail,
    Employee,
    Employment,
    InsuranceDetail,
    PersonalDetail,
} from "../types/EmployeeAttributes";
import type { Schedule } from "../types/ScheduleAttributes";

export class DomainEmployee implements Employee {
    uuid: string;
    full_name: string;
    nick_name: string;
    employee_id: string;
    fingerprint_id: string;
    address: Address;
    personal_detail: PersonalDetail;
    contact_detail: ContactDetail;
    employment: Employment;
    bank_detail: BankDetail;
    insurance_details: InsuranceDetail;
    schedule: Schedule | null;
    created_at: number;
    updated_at?: number | undefined;
    deleted_at?: number | undefined;
    constructor(init: Employee) {
        this.uuid = init.uuid || nanoid();
        this.full_name = init.full_name;
        this.nick_name = init.nick_name;
        this.employee_id = init.employee_id;
        this.fingerprint_id = init.fingerprint_id;
        this.address = init.address;
        this.personal_detail = init.personal_detail;
        this.contact_detail = init.contact_detail;
        this.employment = init.employment;
        this.bank_detail = init.bank_detail;
        this.insurance_details = init.insurance_details;
        this.schedule = init.schedule;
        this.created_at = init.created_at;
        this.updated_at = init.updated_at;
        this.deleted_at = init.deleted_at;
    }
}

export class DomainEmployeeSummary {
    uuid: string;
    branch_uuid: string;
    full_name: string;
    nick_name: string;
    employee_id: string;
    fingerprint_id: string;

    constructor(init: {
        uuid: string;
        branch_uuid: string;
        full_name: string;
        nick_name: string;
        employee_id: string;
        fingerprint_id: string;
    }) {
        this.uuid = init.uuid;
        this.branch_uuid = init.branch_uuid;
        this.full_name = init.full_name;
        this.nick_name = init.nick_name;
        this.employee_id = init.employee_id;
        this.fingerprint_id = init.fingerprint_id;
    }
}
