import type { Shift } from "../types/ShiftAttributes";

export class DomainShift {
    uuid: string;
    name: string;
    label: string;
    schedule_in: string;
    schedule_out: string;
    break_start: string;
    break_end: string;
    description: string;
    inserted_by: string;
    created_at?: number;
    updated_at?: number;
    deleted_at?: number;

    constructor(init: Shift) {
        this.uuid = init.uuid;
        this.name = init.name;
        this.schedule_in = init.schedule_in;
        this.schedule_out = init.schedule_out;
        this.break_start = init.break_start;
        this.break_end = init.break_end;
        this.description = init.description;
        this.label = init.label;
        this.inserted_by = init.inserted_by;
        this.created_at = init.created_at;
        this.updated_at = init.updated_at;
        this.deleted_at = init.deleted_at;
    }
}