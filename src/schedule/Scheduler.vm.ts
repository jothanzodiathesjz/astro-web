import type { ToastUI } from "@/core/ui/Toast.ui";
import type { UIError } from "@/core/ui/UIError";
import type { DomainEmployeeSchedule, DomainSchedulerCalendar } from "@/domain/models/Schedule";
import type { ScheduleRepository } from "@/domain/repositories/ScheduleRepository";
import type { UIScheduler, UpdateShiftAtt } from "./UIScheduler";
type FilterKey = "has_schedule";
type FilterOptionValue = {
    label: string;
    value: boolean;
};
type FilterOption = {
    header: string;
    key: FilterKey;
    values: FilterOptionValue[];
};

export class SchedulerViewModel {
    scheduleRepository: ScheduleRepository;
    section: "list" | "calendar" = "list";
    employees: DomainEmployeeSchedule[] = [];
    schedulers: DomainSchedulerCalendar[] = [];

    search = "";
    searchCalendar = "";
    showFilter = false;

    alert: ToastUI | null = null;
    errors: UIError | null = null;
    employeecursor: string | undefined = undefined;
    calendarCursor: string | undefined = undefined;
    range: [Date, Date] | null = null;

    selectedEmployees = new Set<DomainEmployeeSchedule>();
    tbs: UIScheduler | null = null;
    submiting = false;
    updateShiftData: UpdateShiftAtt | null = null;
    toBeTimeOff: DomainEmployeeSchedule | null = null;
    showConfirmCreateScheduler: boolean = false;

    constructor(scheduleRepository: ScheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }
    filterOptions: FilterOption[] = [
        {
            header: "Schedule",
            key: "has_schedule",
            values: [
                { label: "Scheduled", value: true },
                { label: "Not Scheduled", value: false },
            ],
        },
    ];
}