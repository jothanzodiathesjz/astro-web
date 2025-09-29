import { nanoid } from "nanoid";
import type { TimeOff } from "../types/TimeOffAttributes";

export class DomainTimeOff {
    uuid: string;
    name: string;
    code: string;
    description: string;

    constructor(init: TimeOff) {
        this.uuid = init.uuid || nanoid();
        this.name = init.name;
        this.code = init.code;
        this.description = init.description;
    }

    static empty() {
        return new DomainTimeOff({
            uuid: "",
            name: "",
            code: "",
            description: "",
        });
    }
}