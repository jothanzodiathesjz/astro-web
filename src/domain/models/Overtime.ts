import type { Overtime } from "../types/OvertimeAttributes";

export class DomainOvertime {
    start_time: string;
    end_time: string;
    break_start: string;
    break_end: string;
    notes: string;
    total_minutes: number;
    is_holiday: boolean;

    constructor(init: Overtime) {
        this.start_time = init.start_time;
        this.end_time = init.end_time;
        this.break_start = init.break_start;
        this.break_end = init.break_end;
        this.notes = init.notes;
        this.total_minutes = init.total_minutes;
        this.is_holiday = init.is_holiday;
    }
}
