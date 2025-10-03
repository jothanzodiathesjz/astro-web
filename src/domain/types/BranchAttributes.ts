import type { Address } from "../shared/Address";
import type { Contact } from "../shared/Contact";
import type { TimestampsAttributes } from "../shared/TimestampsAttributes";

export type Branch = TimestampsAttributes & {
    uuid?: string;
    name: string;
    code: string;
    contact: Contact;
    address: Address;
    is_head_office: boolean;
    payroll_info: Payroll;
};

export type Payroll = {
    hq_initial: string;
    hq_code: string;
    umr: number;
    umr_city: string;
    umr_province: string;
    bpjs_code: string;
    jkk: string;
    klu_code: string;
};
