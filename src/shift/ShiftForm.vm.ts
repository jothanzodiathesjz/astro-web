import { ToastUI } from "@/core/ui/Toast.ui";
import { handleErrors, type UIError } from "@/core/ui/UIError";
import { UITime } from "@/core/ui/UITime";
import { DomainShift } from "@/domain/models/Shift";
import type { ShiftRepository } from "@/domain/repositories/ShiftRepository";
import { useRoute } from "vue-router";
import { labelOptions, shiftTypeOptions } from "./Shift.ui";
import { DropdownLabel } from "@/core/components/models/DropdownLabel";
import { nanoid } from "nanoid";
import { injected } from "brandi";
import { TOKENS } from "@/container/tokens";

type ShiftFormErrors = {
    name: string[];
    label: string[];
    scheduleIn: string[];
    scheduleOut: string[];
    breakStart: string[];
    breakEnd: string[];
    code: string[];
    requiredMinutes: string[];
};

export class ShiftFormViewModel {
    repository: ShiftRepository;

    constructor(repository: ShiftRepository) {
        this.repository = repository;
    }

    route = useRoute();
    isUpdate = false;

    alerts: ToastUI | null = null;
    errors: UIError | null = null;
    //  $route = useRoute();
    data: DomainShift = new DomainShift({
        name: "",
        label: "",
        break_end: "",
        break_start: "",
        code: "",
        schedule_in: "",
        schedule_out: "",
        uuid: "",
        description: "",
        is_scheduled: false,
        is_cross_day: false,
        created_at: 0,
        required_minutes: 0,
        type: "FIXED",
        inserted_by: "",
        updated_at: undefined,
        deleted_at: undefined,
    });

    scheduleIn: UITime | null = null;
    scheduleOut: UITime | null = null;
    breakStart: UITime | null = null;
    breakEnd: UITime | null = null;

    labelDropdown = labelOptions.map(
        (option) => new DropdownLabel(option, "value", "label"),
    );
    typeDropdown = shiftTypeOptions.map(
        (option) => new DropdownLabel(option, "value", "label"),
    );
    requiredHours = 0;
    requiredMinutes = 0;

    formErrors: ShiftFormErrors = {
        name: [],
        label: [],
        scheduleIn: [],
        scheduleOut: [],
        breakStart: [],
        breakEnd: [],
        code: [],
        requiredMinutes: [],
    };

    sanitizeNonNegative(value: number) {
        if (!Number.isFinite(value)) {
            return 0;
        }
        return Math.max(0, Math.floor(value));
    }

    setRequiredHours(value: number) {
        this.requiredHours = this.sanitizeNonNegative(value);
    }

    setRequiredMinutes(value: number) {
        this.requiredMinutes = Math.min(59, this.sanitizeNonNegative(value));
    }

    clearFieldError(field: keyof ShiftFormErrors) {
        this.formErrors[field] = [];
    }

    resetFormErrors() {
        this.formErrors.name = [];
        this.formErrors.label = [];
        this.formErrors.scheduleIn = [];
        this.formErrors.scheduleOut = [];
        this.formErrors.breakStart = [];
        this.formErrors.breakEnd = [];
        this.formErrors.code = [];
        this.formErrors.requiredMinutes = [];
    }

    validate(isFlexibleShift: boolean): boolean {
        this.resetFormErrors();
        let valid = true;

        if (!this.data.name.trim()) {
            this.formErrors.name.push("Name is required");
            valid = false;
        }

        if (!this.data.code.trim()) {
            this.formErrors.code.push("Code is required");
            valid = false;
        }

        if (!this.data.label.trim()) {
            this.formErrors.label.push("Label is required");
            valid = false;
        }

        if (!this.scheduleIn) {
            this.formErrors.scheduleIn.push("Schedule in is required");
            valid = false;
        }

        if (!this.scheduleOut) {
            this.formErrors.scheduleOut.push("Schedule out is required");
            valid = false;
        }

        if (!this.breakStart) {
            this.formErrors.breakStart.push("Break start is required");
            valid = false;
        }

        if (!this.breakEnd) {
            this.formErrors.breakEnd.push("Break end is required");
            valid = false;
        }

        if (isFlexibleShift && this.data.required_minutes <= 0) {
            this.formErrors.requiredMinutes.push(
                "Required duration must be greater than 0",
            );
            valid = false;
        }

        return valid;
    }
    toDomain(isFlexibleShift: boolean): boolean {
        if (
            !this.scheduleIn ||
            !this.scheduleOut ||
            !this.breakStart ||
            !this.breakEnd
        ) {
            return false;
        }

        this.data.schedule_in = this.scheduleIn.toHoursMinutesString();
        this.data.schedule_out = this.scheduleOut.toHoursMinutesString();
        this.data.break_start = this.breakStart.toHoursMinutesString();
        this.data.break_end = this.breakEnd.toHoursMinutesString();
        this.data.created_at = this.isUpdate
            ? this.data.created_at
            : Date.now();
        this.data.updated_at = this.isUpdate ? Date.now() : undefined;
        this.data.uuid = this.isUpdate ? this.data.uuid : nanoid();
        this.data.code = this.data.code.trim().toUpperCase();
        this.data.is_cross_day = this.data.is_cross_day ?? false;
        this.data.inserted_by = "Bos Rio";
        if (!isFlexibleShift) {
            this.data.required_minutes = 0;
        }

        return true;
    }

    async save(isFlexibleShift: boolean) {
        if (!this.validate(isFlexibleShift)) {
            this.alerts = new ToastUI(
                "Please correct the highlighted fields.",
                "error",
                2000,
            );
            return;
        }

        try {
            this.errors = null;
            if (!this.toDomain(isFlexibleShift)) {
                return;
            }
            if (this.isUpdate) {
                await this.repository.updateShift(this.data);
            } else {
                await this.repository.createShift(this.data);
            }
            this.alerts = new ToastUI("Success", "success", 1500);
        } catch (error) {
            this.errors = handleErrors(error);
            this.alerts = new ToastUI(
                this.errors?.message ?? "Error",
                "error",
                2000,
            );
        }
    }

    async getShift() {
        try {
            this.data = await this.repository.getShift(
                this.route.params.uuid as string,
            );
            this.scheduleIn = this.data.schedule_in
                ? UITime.fromHoursMinutesString(this.data.schedule_in)
                : null;
            this.scheduleOut = this.data.schedule_out
                ? UITime.fromHoursMinutesString(this.data.schedule_out)
                : null;
            this.breakStart = this.data.break_start
                ? UITime.fromHoursMinutesString(this.data.break_start)
                : null;
            this.breakEnd = this.data.break_end
                ? UITime.fromHoursMinutesString(this.data.break_end)
                : null;
        } catch (error) {
            this.errors = handleErrors(error);
        }
    }
}

injected(ShiftFormViewModel, TOKENS.ShiftRepository);
