import type { Address } from "../shared/Address";
import type { Contact } from "../shared/Contact";
import type { Company } from "../types/CompanyAttributes";

export class DomainCompany {
    uuid: string;
    name: string;
    industry: string;
    address: Address;
    contact: Contact;

    constructor(init: Company) {
        this.uuid = init.uuid;
        this.name = init.name;
        this.industry = init.industry;
        this.address = init.address;
        this.contact = init.contact;
    }

    static empty() {
        return new DomainCompany({
            uuid: "",
            name: "",
            industry: "",
            address: {
                street: "",
                city: "",
                province: "",
                zip_code: "",
                country: "",
            },
            contact: {
                email: "",
                phone_number: "",
            },
            created_at: 0,
        });
    }
}
