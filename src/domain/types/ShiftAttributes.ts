import type { TimestampsAttributes } from "../shared/TimestampsAttributes";

export type Shift = TimestampsAttributes & {
    uuid: string;
    name: string;
    label: string;
    schedule_in: string;
    schedule_out: string;
    break_start: string;
    break_end: string;
    description: string;
    inserted_by: string;
}