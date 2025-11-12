import type { Address } from "../shared/Address";
import type { BaseEntity } from "../shared/Base";
import type { Schedule } from "./ScheduleAttributes";

export type EmergencyContact = {
    name: string;
    relation: string;
    phone_number: string;
};

export type TContactDetail = {
    phone_number: string;
    email: string;
    emergency_contact: EmergencyContact;
};

export type PersonalDetail = {
    birthday: string;
    birth_place: string;
    religion: string;
    gender: string;
    marital_status: string;
    blood_type: string;
};

export type Department = {
    name: string;
    code: string;
};

export type Employment = {
    department: Department;
    job_level: string;
    job_title: string;
    employment_type: string;
    start_date: number;
    end_date: number;
    resign_date: number;
    status: string;
};

export type BankDetail = {
    account_name: string;
    account_number: string;
    bank_name: string;
    ifsc_code: string;
};

export type InsuranceDetail = {
    bpjs_ketenagakerjaan: string;
    bpjs_kesehatan: string;
};
export type ContactDetail = {
    phone_number: string;
    email: string;
    emergency_contact: EmergencyContact;
};

export type Employee = BaseEntity & {
    uuid?: string;
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
};
