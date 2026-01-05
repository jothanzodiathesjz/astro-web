<template>
    <div class="w-full h-full flex flex-col px-5 dark:bg-gray-900">
        <Toast
            :duration="alerts?.duration"
            :message="alerts?.message ?? ''"
            :type="alerts?.type"
            :show="Boolean(alerts)"
            @on-close="alerts = null"
        />
        <EmployeeSelectorModal
            :visible="modalVisible"
            :selected="selectedEmployees"
            @close="modalVisible = false"
            @save="handleEmployeeSelection"
            @update:selected="handleEmployeeSelection"
        />
        <div class="flex flex-row items-center gap-4">
            <ButtonComponent
                @click="$router.back()"
                :variant="'outline'"
                :icon-name="'fa-angle-left'"
                >Back</ButtonComponent
            >
            <div class="w-full flex flex-row gap-3 items-center">
                <span
                    @click="$router.back()"
                    class="font-semibold text-blue-600 dark:text-gray-200 cursor-pointer"
                    >Time Off</span
                >
                <IconButton :icon-name="'fa-angle-right'" />
                <span class="font-semibold text-gray-800 dark:text-gray-200"
                    >Create Policy</span
                >
            </div>
        </div>
        <div
            class="py-5 flex flex-col gap-3 mt-4 px-5 mb-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-7"
        >
            <div class="w-1/3 flex flex-col gap-2">
                <TimeOffDropdown
                    :selected="selectedTimeOff"
                    @select="handleTimeOffSelect"
                    @clear="clearTimeOffSelection"
                />
                <span
                    v-if="formErrors.time_off.length"
                    class="text-xs text-red-500 dark:text-red-400"
                    >{{ formErrors.time_off[0] }}</span
                >
            </div>
            <div class="w-1/3 flex flex-col gap-3 items-end">
                <ButtonComponent
                    class="w-full"
                    variant="outline"
                    @click="modalVisible = true"
                    >Assign Employee +</ButtonComponent
                >
                <span class="text-sm text-gray-500 dark:text-gray-400"
                    >Selected: {{ selectedEmployees?.length }}</span
                >
                <span
                    v-if="formErrors.employees.length"
                    class="text-xs text-red-500 dark:text-red-400 text-right w-full"
                    >{{ formErrors.employees[0] }}</span
                >
            </div>
            <div class="w-1/3 flex flex-col gap-4">
                <DateInput
                    label="Start Date"
                    :model-value="start_date"
                    :with-range="false"
                    :hint="{
                        text: 'Tanggal mulai berlakunya',
                    }"
                    :placeholder="'Start date'"
                    :readonly="false"
                    :with-time="false"
                    :error="formErrors.start_date"
                    @update:model-value="
                        (v) => {
                            start_date = v;
                            clearFieldError('start_date');
                        }
                    "
                    @clear="
                        () => {
                            start_date = undefined;
                        }
                    "
                />
                <DateInput
                    label="End Date"
                    :model-value="end_date"
                    :with-range="false"
                    :placeholder="'End date'"
                    :hint="{
                        text: 'Tanggal mulai berlakunya',
                    }"
                    :readonly="false"
                    :with-time="false"
                    :error="formErrors.end_date"
                    @update:model-value="
                        (v) => {
                            end_date = v;
                            clearFieldError('end_date');
                        }
                    "
                    @clear="
                        () => {
                            end_date = undefined;
                        }
                    "
                />
            </div>
            <div class="w-1/3 flex flex-col gap-4">
                <NumberInput
                    :model-value="quota"
                    label="Quota"
                    :min="0"
                    :hint="{
                        text: 'Jumlah kuota time off yang diberikan',
                    }"
                    placeholder="0"
                    :error="formErrors.quota"
                    @update:model-value="
                        (value) => {
                            quota = value;
                            clearFieldError('quota');
                        }
                    "
                />
            </div>
            <div class="w-1/3 flex flex-row justify-end">
                <ButtonComponent
                    v-if="!isUpdate"
                    :variant="'primary'"
                    class="w-full sm:w-auto md:w-1/4"
                    :disabled="submiting"
                    :loading="submiting"
                    @click="submitForm"
                    >Save</ButtonComponent
                >
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import ButtonComponent from "@/core/components/button/Button.component.vue";
import Toast from "@/core/components/Toast.vue";
import { ToastUI } from "@/core/ui/Toast.ui";
import { reactive, ref } from "vue";
import { DomainTimeOff, DomainTimeOffPolicy } from "@/domain/models/TimeOff";
import { handleErrors, UIError } from "@/core/ui/UIError";
import IconButton from "@/core/components/button/Icon.button.vue";
import TimeOffDropdown from "./TimeOff.dropdown.vue";
import DateInput from "@/core/components/input/Date.input.vue";
import NumberInput from "@/core/components/input/Number.input.vue";
import type { DomainEmployee } from "@/domain/models/Employee";
import EmployeeSelectorModal from "@/employee/EmployeeSelector.modal.vue";
import { container } from "@/container/di";
import { TOKENS } from "@/container/tokens";

const repository = container.get(TOKENS.TimeOffRepository);

const alerts = ref<ToastUI | null>(null);
const errors = ref<UIError | null>(null);
const submiting = ref(false);
const isUpdate = ref(false);

const selectedTimeOff = ref<DomainTimeOff | null>(null);
const quota = ref<number>(0);
const start_date = ref<Date | Date[] | undefined>(undefined);
const end_date = ref<Date | Date[] | undefined>(undefined);
const selectedEmployees = ref<DomainEmployee[] | undefined>([]);
const modalVisible = ref(false);

type FormErrorField =
    | "time_off"
    | "start_date"
    | "end_date"
    | "quota"
    | "employees";

const formErrors = reactive<Record<FormErrorField, string[]>>({
    time_off: [],
    start_date: [],
    end_date: [],
    quota: [],
    employees: [],
});

function clearFieldError(field: FormErrorField) {
    formErrors[field] = [];
}

function resetFormErrors() {
    (Object.keys(formErrors) as FormErrorField[]).forEach((field) => {
        formErrors[field] = [];
    });
}

function normalizeDate(value: Date | Date[] | undefined): Date | undefined {
    if (!value) return undefined;
    if (value instanceof Date) {
        return value;
    }
    if (Array.isArray(value) && value[0] instanceof Date) {
        return value[0];
    }
    return undefined;
}

function validateForm(): boolean {
    resetFormErrors();
    let isValid = true;

    if (!selectedTimeOff.value) {
        formErrors.time_off = ["Time off is required"];
        isValid = false;
    }

    const startDate = normalizeDate(start_date.value);
    const endDate = normalizeDate(end_date.value);

    if (!startDate) {
        formErrors.start_date = ["Start date is required"];
        isValid = false;
    }
    if (!endDate) {
        formErrors.end_date = ["End date is required"];
        isValid = false;
    } else if (startDate && endDate < startDate) {
        formErrors.end_date = ["End date must be after start date"];
        isValid = false;
    }

    if (!Number.isFinite(quota.value) || quota.value <= 0) {
        formErrors.quota = ["Quota must be greater than 0"];
        isValid = false;
    }

    if (!selectedEmployees.value || selectedEmployees.value.length === 0) {
        formErrors.employees = ["Please assign at least one employee"];
        isValid = false;
    }

    return isValid;
}

function handleTimeOffSelect(timeOff: DomainTimeOff) {
    selectedTimeOff.value = timeOff;
    clearFieldError("time_off");
}

function clearTimeOffSelection() {
    selectedTimeOff.value = null;
}

function handleEmployeeSelection(employees?: DomainEmployee[]) {
    selectedEmployees.value = employees ?? [];
    if (selectedEmployees.value?.length) {
        clearFieldError("employees");
    }
}

async function submitForm() {
    alerts.value = null;
    if (!validateForm()) {
        alerts.value = new ToastUI(
            "Please correct the errors in the form.",
            "error",
            2000,
        );
        return;
    }
    if (!selectedTimeOff.value) {
        alerts.value = new ToastUI("Please select a time off.", "error", 2000);
        return;
    }
    const sD =
        start_date.value instanceof Date
            ? start_date.value.getTime()
            : undefined;
    const eD =
        end_date.value instanceof Date ? end_date.value.getTime() : undefined;

    try {
        submiting.value = true;
        await repository.createPolicy(
            new DomainTimeOffPolicy({
                employee_uuid:
                    selectedEmployees.value?.map((item) => item.uuid) ?? [],
                end_date: eD!,
                quota: quota.value,
                start_date: sD!,
                time_off: selectedTimeOff.value,
            }),
        );

        alerts.value = new ToastUI("Successfully created", "success", 1500);
    } catch (error) {
        errors.value = handleErrors(error);
        alerts.value = new ToastUI(
            errors.value?.message ?? "Error",
            "error",
            2000,
        );
    } finally {
        submiting.value = false;
    }
}
</script>
<style scoped></style>
