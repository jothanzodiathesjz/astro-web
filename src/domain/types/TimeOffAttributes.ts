export type TimeOff = {
    uuid?: string;
    name: string;
    code: string;
    description: string;
    category: string;
    duration_type: string;
    tolerance_minutes: number;
    is_paid: boolean;
    is_deduct_leave: boolean;
};
