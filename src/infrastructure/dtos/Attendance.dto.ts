import type { DomainOvertime } from "@/domain/models/Overtime";

export class AttendanceOvertimeDto {
    date: string;
    employee_uuid: string[];
    over_time: DomainOvertime;

    constructor(init: {
        date: string;
        employee_uuid: string[];
        over_time: DomainOvertime;
    }) {
        this.date = init.date;
        this.employee_uuid = init.employee_uuid;
        this.over_time = init.over_time;
    }
}
