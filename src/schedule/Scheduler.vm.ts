import type { ToastUI } from "@/core/ui/Toast.ui";
import { handleErrors, type UIError } from "@/core/ui/UIError";
import type {
    DomainEmployeeSchedule,
    DomainSchedule,
    DomainSchedulerCalendar,
} from "@/domain/models/Schedule";
import type { ScheduleRepository } from "@/domain/repositories/ScheduleRepository";
import type { UIScheduler, UpdateShiftAtt } from "./UIScheduler";
import type { DomainTimeOff } from "@/domain/models/TimeOff";
import { injected } from "brandi";
import { TOKENS } from "@/container/tokens";
type FilterKey = "has_schedule" | "employment_type";
type FilterValue = boolean | string;
type FilterOptionValue = {
    label: string;
    value: FilterValue;
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

    alerts: ToastUI | null = null;
    errors: UIError | null = null;
    employeeCursor: string | undefined = undefined;
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
        {
            header: "Employment Type",
            key: "employment_type",
            values: [
                { label: "Permanent", value: "PERMANENT" },
                { label: "Contract", value: "CONTRACT" },
                { label: "Harles", value: "HARLES" },
            ],
        },
    ];

    filterState: {
        has_schedule: boolean | undefined;
        employment_type: string | undefined;
    } = {
        has_schedule: undefined,
        employment_type: undefined,
    };

    updateFilter(key: FilterKey, value: FilterValue, explicitState?: boolean) {
        if (key === "has_schedule") {
            const typedValue = value as boolean;

            if (explicitState !== undefined) {
                this.filterState.has_schedule = explicitState
                    ? typedValue
                    : undefined;
            } else {
                this.filterState.has_schedule =
                    this.filterState.has_schedule === typedValue
                        ? undefined
                        : typedValue;
            }
        }

        if (key === "employment_type") {
            const typedValue = value as string;

            if (explicitState !== undefined) {
                this.filterState.employment_type = explicitState
                    ? typedValue
                    : undefined;
            } else {
                this.filterState.employment_type =
                    this.filterState.employment_type === typedValue
                        ? undefined
                        : typedValue;
            }
        }

        this.showFilter = false;
        this.getList();
        this.getScheduler();
    }

    isFilterActive(key: FilterKey, value: FilterValue): boolean {
        if (key === "has_schedule") {
            return this.filterState.has_schedule === value;
        }

        if (key === "employment_type") {
            return this.filterState.employment_type === value;
        }

        return false;
    }

    assignSchedule(emp: DomainEmployeeSchedule[]) {
        const hasSchedule = emp.some((emp) => emp.schedule !== null);
        const hasNotSchedule = emp.some((emp) => emp.schedule === null);

        if (hasSchedule && hasNotSchedule) {
            this.alerts = {
                type: "warning",
                message: "Some employees have schedule and some don't.",
                duration: 3000,
            };
            return;
        }
        this.tbs = {
            employee_uuid: [...emp.map((emp) => emp)],
            effective_date: new Date().getTime(),
            schedule_uuid: "",
            has_schedule: hasSchedule,
        };
    }

    dayKey(day: Date) {
        return day.toISOString().split("T")[0];
    }

    buildRangeQuery(): { from?: string; to?: string } {
        if (!this.range) return {};
        const [start, end] = this.range;
        return {
            from: start.getTime().toString(),
            to: end.getTime().toString(),
        };
    }

    toogleSelectAll(checked: boolean) {
        const nextSelection = new Set(this.selectedEmployees);
        if (checked) {
            this.employees.forEach((emp) => nextSelection.add(emp));
        } else {
            this.employees.forEach((emp) => nextSelection.delete(emp));
        }
        this.selectedEmployees = nextSelection;
    }

    async createScheduler(s: DomainSchedule, d: number) {
        if (!this.tbs) return;
        this.submiting = true;
        try {
            await this.scheduleRepository.createScheduler(
                {
                    effective_date: d,
                    employee_uuid:
                        this.tbs?.employee_uuid.map((emp) => emp.uuid) ?? [],
                    schedule_uuid: s.uuid,
                },
                this.tbs.has_schedule,
            );
            this.alerts = {
                message: "Scheduler created successfully",
                duration: 5000,
                type: "success",
            };
            this.tbs = null;
        } catch (error) {
            this.errors = handleErrors(error);
            this.alerts = {
                message: this.errors.message,
                duration: 5000,
                type: "error",
            };
        } finally {
            this.submiting = false;
            this.getList();
        }
    }

    toggleEmployeeSelection(emp: DomainEmployeeSchedule, checked: boolean) {
        const nextSelection = new Set(this.selectedEmployees);
        if (checked) {
            nextSelection.add(emp);
        } else {
            nextSelection.delete(emp);
        }
        this.selectedEmployees = nextSelection;
    }

    async getScheduler() {
        const [result, cursor] = await this.scheduleRepository.getSchedulers({
            search: this.searchCalendar,
            employment_type: this.filterState.employment_type,
            ...this.buildRangeQuery(),
        });

        this.schedulers = result;
        this.calendarCursor = cursor;
    }

    async getSchedulerWithPaginate() {
        if (!this.calendarCursor) return;
        const [result, cursor] = await this.scheduleRepository.getSchedulers({
            search: this.searchCalendar,
            employment_type: this.filterState.employment_type,
            ...this.buildRangeQuery(),
            cursor: this.calendarCursor,
        });
        this.schedulers = [...this.schedulers, ...result];
        this.calendarCursor = cursor;
    }

    async getList() {
        const [list, cursor] =
            await this.scheduleRepository.getEmployeeSchedules({
                search: this.search,
                has_schedule: this.filterState.has_schedule,
                employment_type: this.filterState.employment_type,
            });
        this.employees = list;
        const currentSelection = this.selectedEmployees;
        const nextSelection = new Set<DomainEmployeeSchedule>();
        list.forEach((emp) => {
            if (currentSelection.has(emp)) {
                nextSelection.add(emp);
            }
        });
        this.selectedEmployees = nextSelection;
        this.employeeCursor = cursor;
    }

    async withPaginate() {
        if (!this.employeeCursor) return;
        const [list, cursor] =
            await this.scheduleRepository.getEmployeeSchedules({
                search: this.search,
                has_schedule: this.filterState.has_schedule,
                employment_type: this.filterState.employment_type,
                cursor: this.employeeCursor,
            });
        this.employees = [...this.employees, ...list];
        this.employeeCursor = cursor;
    }

    async updateShift() {
        if (!this.updateShiftData) return;
        this.submiting = true;
        try {
            const result =
                await this.scheduleRepository.updateScheduleOnScheduler(
                    this.updateShiftData.shift,
                );
            this.alerts = {
                message: "Shift updated successfully",
                duration: 5000,
                type: "success",
            };
            this.schedulers = this.schedulers.map((scheduler) => {
                if (
                    scheduler.employee.uuid ===
                    this.updateShiftData?.employee.uuid
                ) {
                    return {
                        ...scheduler,
                        daily_attendance: scheduler.daily_attendance.map(
                            (attendance) => {
                                if (
                                    attendance.attendance_date ===
                                    result.attendance_date
                                ) {
                                    return result;
                                }
                                return attendance;
                            },
                        ),
                    };
                }
                return scheduler;
            });
            this.updateShiftData = null;
            // getScheduler();
        } catch (error) {
            this.errors = handleErrors(error);
            this.alerts = {
                message: this.errors?.message,
                duration: 5000,
                type: "error",
            };
        } finally {
            this.submiting = false;
        }
    }

    async setTimeOffEmployee({
        date,
        timeOff,
    }: {
        date: Date[];
        timeOff: DomainTimeOff;
    }) {
        if (!this.toBeTimeOff) return;
        this.submiting = true;
        try {
            await this.scheduleRepository.setTimeOffSchedule(
                this.toBeTimeOff.uuid,
                {
                    date: date.map((d) => d.getTime()),
                    time_off_uuid: timeOff.uuid,
                },
            );
            this.toBeTimeOff = null;
            this.alerts = {
                message: "Time off employee successfully",
                duration: 5000,
                type: "success",
            };
        } catch (error) {
            this.errors = handleErrors(error);
            this.alerts = {
                message: this.errors?.message,
                duration: 5000,
                type: "error",
            };
        } finally {
            this.submiting = false;
        }
    }
}

injected(SchedulerViewModel, TOKENS.ScheduleRepository);
