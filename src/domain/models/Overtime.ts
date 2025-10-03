import type { Overtime } from "../types/OvertimeAttributes";

export class DomainOvertime {
    before_shift_duration: string;
    before_shift_break: string;
    after_shift_duration: string;
    after_shift_break: string;

    constructor(init: Overtime) {
        this.before_shift_duration = init.before_shift_duration;
        this.before_shift_break = init.before_shift_break;
        this.after_shift_duration = init.after_shift_duration;
        this.after_shift_break = init.after_shift_break;
    }
}
