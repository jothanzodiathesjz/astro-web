import { TOKENS } from "@/container/tokens";
import { DropdownLabel } from "@/core/components/models/DropdownLabel";
import { ToastUI } from "@/core/ui/Toast.ui";
import { handleErrors, type UIError } from "@/core/ui/UIError";
import { DomainDaySchedule, DomainSchedule } from "@/domain/models/Schedule";
import type { DomainShift } from "@/domain/models/Shift";
import type { ScheduleRepository } from "@/domain/repositories/ScheduleRepository";
import type { ShiftRepository } from "@/domain/repositories/ShiftRepository";
import { injected } from "brandi";
import { v4 } from "uuid";
import { useRoute, useRouter } from "vue-router";
type ShiftFormErrors = {
    name: string[];
    efectiveDate: string[];
    description: string[];
    shifts: string[];
};

export class ScheduleFormViewModel {
    repository: ScheduleRepository;
    shiftRepository: ShiftRepository;
    route = useRoute();
    isUpdate = false;
    alerts: ToastUI | null = null;
    errors: UIError | null = null;
    effectiveDate: Date | Date[] | undefined = undefined;
    previewVisible = false;
    submiting = false;
    router = useRouter();
    constructor(
        repository: ScheduleRepository,
        shiftRepository: ShiftRepository,
    ) {
        this.repository = repository;
        this.shiftRepository = shiftRepository;
    }

    data: DomainSchedule = {
        name: "",
        uuid: "",
        description: "",
        cycle_days: 0,
        day_schedules: [],
        inserted_by: "",
        created_at: 0,
        effective_date: 0,
    };

    dayOneSchedule: DomainDaySchedule = new DomainDaySchedule({
        day: 1,
        shift: null,
    });

    daySchedules: DomainDaySchedule[] = [this.dayOneSchedule];

    formErrors: ShiftFormErrors = {
        name: [],
        efectiveDate: [],
        description: [],
        shifts: [],
    };

    shiftOptions: DropdownLabel<DomainShift>[] = [];

    addDaySchedule() {
        this.daySchedules.push(
            new DomainDaySchedule({
                day: this.daySchedules.length + 1,
                shift: null,
            }),
        );
    }

    removeDaySchedule(index: number) {
        this.daySchedules.splice(index, 1);
        this.daySchedules = this.daySchedules.map((item, index) => ({
            ...item,
            day: index + 1,
        }));
    }

    clearFieldError(field: keyof ShiftFormErrors) {
        this.formErrors[field] = [];
    }
    resetFormErrors() {
        this.formErrors.name = [];
        this.formErrors.efectiveDate = [];
        this.formErrors.description = [];
    }

    validate(): boolean {
        this.resetFormErrors();
        let valid = true;

        if (!this.data.name.trim()) {
            this.formErrors.name.push("Name is required");
            valid = false;
        }

        if (!this.effectiveDate) {
            this.formErrors.efectiveDate.push("Effective date is required");
            valid = false;
        }

        if (!this.data.description.trim()) {
            this.formErrors.description.push("Description is required");
            valid = false;
        }

        this.daySchedules.forEach((item, index) => {
            if (!item.shift) {
                this.formErrors.shifts.push(
                    `Shift for day ${index + 1} is required`,
                );
                valid = false;
            }
        });

        return valid;
    }

    toDomain(): boolean {
        if (
            !this.data.name.trim() ||
            !this.effectiveDate ||
            !this.data.description.trim() ||
            this.daySchedules.some((item) => !item.shift)
        ) {
            return false;
        }
        this.data.day_schedules = this.daySchedules.map(
            (item) => new DomainDaySchedule(item),
        );
        this.data.uuid = this.isUpdate ? this.data.uuid : v4();
        this.effectiveDate instanceof Date && (this.data.effective_date = this.effectiveDate.getTime());
        this.data.created_at = this.isUpdate ? this.data.created_at : Date.now();
        return true;
    }

    async save() {
        if (!this.validate()) {
            this.alerts = new ToastUI(
                "Please correct the highlighted fields.",
                "error",
                2000,
            );
            return;
        }

        if (!this.toDomain()) {
            this.alerts = new ToastUI(
                "Please correct the highlighted fields.",
                "error",
                2000,
            );
            return;
        }

        try {
            this.submiting = true;
            if (this.isUpdate) {
                await this.repository.updateSchedule(this.data);
            } else {
                await this.repository.createSchedule(this.data);
            }

            this.alerts = new ToastUI(
                "Successfully Saved Schedule",
                "success",
                2000,
            );
            setTimeout(() => {
                this.submiting = false;
                this.router.push({ name: "Schedule" });
            }, 2300);

        } catch (error) {
            this.errors = handleErrors(error);
            this.alerts = new ToastUI(this.errors.message, "error", 2000);
            this.submiting = false;
        }
    }

    async getShiftList() {
        try {
            const result = await this.shiftRepository.getShifts({
                search: "",
            });
            this.shiftOptions = result.map(
                (item) => new DropdownLabel<DomainShift>(item, "uuid", "name"),
            );
        } catch (error) {
            this.errors = handleErrors(error);
        }
    }

    async getSchedule() {
        try {
            const result = await this.repository.getSchedule(this.route.params.uuid as string);
            this.data = result;
            this.effectiveDate = new Date(result.effective_date);
            this.daySchedules = result.day_schedules.map((item) => new DomainDaySchedule(item));

        } catch (error) {
            this.errors = handleErrors(error);
        }
    }

    initialize() {
        const uuid = this.route.params.uuid as string | undefined;
        if (uuid) {
            this.isUpdate = true;
            this.getSchedule();
        }
        this.getShiftList();
    }
}

injected(
    ScheduleFormViewModel,
    TOKENS.ScheduleRepository,
    TOKENS.ShiftRepository,
);
