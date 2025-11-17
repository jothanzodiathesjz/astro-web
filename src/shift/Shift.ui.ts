import type { ShiftType } from "@/domain/types/ShiftAttributes";

export type Labels = {
    value: string;
    label: string;
};

export const labelOptions: Labels[] = [
    { value: "WFH", label: "WFH (Work From Home)" },
    { value: "WFO", label: "WFO (Work From Office)" },
];

export type ShiftTypeOption = {
    value: ShiftType;
    label: string;
};

export const shiftTypeOptions: ShiftTypeOption[] = [
    { value: "FIXED", label: "Fixed" },
    { value: "FLEXIBLE", label: "Flexible" },
];
