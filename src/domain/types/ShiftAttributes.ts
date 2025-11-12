import type { BaseEntity } from "../shared/Base";

export type Shift = BaseEntity & {
    uuid?: string;
    name: string;
    code: string;
    label: string;
    schedule_in: string;
    schedule_out: string;
    break_start: string;
    break_end: string;
    is_scheduled: boolean;
    is_cross_day: boolean;
    description: string;
    inserted_by: string;
};
