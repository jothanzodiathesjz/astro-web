import { nanoid } from "nanoid";
import type { TimeOff } from "../types/TimeOffAttributes";

export class DomainTimeOff {
    uuid: string;
    name: string;
    code: string;
    description: string;
    category: string;
    duration_type: string;
    tolerance_minutes: number;
    is_paid: boolean;
    is_deduct_leave: boolean;

    constructor(init: TimeOff) {
        this.uuid = init.uuid || nanoid();
        this.name = init.name;
        this.code = init.code;
        this.description = init.description;
        this.category = init.category;
        this.duration_type = init.duration_type;
        this.tolerance_minutes = init.tolerance_minutes;
        this.is_paid = init.is_paid;
        this.is_deduct_leave = init.is_deduct_leave;
    }

    static empty() {
        return new DomainTimeOff({
            uuid: "",
            name: "",
            code: "",
            description: "",
            category: "",
            duration_type: "",
            tolerance_minutes: 0,
            is_paid: false,
            is_deduct_leave: false,
        });
    }
}
