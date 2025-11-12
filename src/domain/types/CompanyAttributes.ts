import type { Address } from "../shared/Address";
import type { BaseEntity } from "../shared/Base";
import type { Contact } from "../shared/Contact";

export type Company = BaseEntity & {
    uuid?: string;
    name: string;
    industry: string;
    address: Address;
    contact: Contact;
};
