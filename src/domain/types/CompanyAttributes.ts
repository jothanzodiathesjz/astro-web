import type { Address } from "../shared/Address";
import type { Contact } from "../shared/Contact";
import type { TimestampsAttributes } from "../shared/TimestampsAttributes";

export type Company = TimestampsAttributes & {
    uuid: string;
    name: string;
    industry: string;
    address: Address;
    contact: Contact;
};
