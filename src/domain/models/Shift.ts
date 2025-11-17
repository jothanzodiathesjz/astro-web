import { nanoid } from "nanoid";
import type { Shift, ShiftType } from "../types/ShiftAttributes";

export class DomainShift {
    uuid: string;
    name: string;
    code: string;
    label: string;
    schedule_in: string;
    schedule_out: string;
    break_start: string;
    break_end: string;
    description: string;
    is_scheduled: boolean;
    is_cross_day: boolean;
    type: ShiftType;
    required_minutes: number;
    inserted_by: string;
    created_at?: number;
    updated_at?: number;
    deleted_at?: number;

    constructor(init: Shift) {
        this.uuid = init.uuid || nanoid();
        this.name = init.name;
        this.code = init.code;
        this.schedule_in = init.schedule_in;
        this.schedule_out = init.schedule_out;
        this.break_start = init.break_start;
        this.break_end = init.break_end;
        this.description = init.description;
        this.label = init.label;
        this.inserted_by = init.inserted_by;
        this.is_scheduled = init.is_scheduled;
        this.is_cross_day = init.is_cross_day;
        this.type = init.type;
        this.required_minutes = init.required_minutes;
        this.created_at = init.created_at;
        this.updated_at = init.updated_at;
        this.deleted_at = init.deleted_at;
    }
}
