import { v4 as uuidv4, v4 } from "uuid";
import type { Address } from "../shared/Address";
import type { Branch, Payroll } from "../types/BranchAttributes";
import type { Contact } from "../shared/Contact";

export class DomainBranch {
    uuid: string;
    name: string;
    code: string;
    contact: Contact;
    address: Address;
    is_head_office: boolean;
    payroll_info: Payroll;

    constructor(init: Branch) {
        this.uuid = init.uuid || uuidv4();
        this.name = init.name;
        this.code = init.code;
        this.contact = init.contact;
        this.address = init.address;
        this.is_head_office = init.is_head_office;
        this.payroll_info = init.payroll_info;
    }

    toData(): Branch {
        return {
            uuid: v4(),
            name: this.name,
            code: this.code,
            contact: this.contact,
            address: this.address,
            is_head_office: this.is_head_office,
            payroll_info: this.payroll_info,
            created_at: Date.now(),
        };
    }

    static empty() {
        return new DomainBranch({
            uuid: "",
            name: "",
            code: "",
            contact: {
                phone_number: "",
                email: "",
            },
            address: {
                street: "",
                city: "",
                province: "",
                zip_code: "",
                country: "",
            },
            is_head_office: false,
            payroll_info: {
                bpjs_code: "",
                hq_code: "",
                hq_initial: "",
                jkk: "",
                klu_code: "",
                umr: 0,
                umr_city: "",
                umr_province: "",
            },
            created_at: 0
        });
    }
}