<template>
    <div
        class="w-full h-full flex flex-col items-center px-14 pb-6 dark:bg-gray-900"
    >
        <Toast
            :duration="alerts?.duration"
            :message="alerts?.message ?? ''"
            :show="alerts ? true : false"
            @on-close="alerts = null"
        />
        <div class="w-[80%] flex flex-row items-center py-3 mt-3 gap-4">
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
                    >Shift</span
                >
                <IconButton :icon-name="'fa-angle-right'" />
                <span class="font-semibold text-gray-800 dark:text-gray-200"
                    >{{ isUpdate ? "Detail" : "Form" }} Shift</span
                >
            </div>
        </div>

        <div
            class="w-[80%] flex flex-col mt-5  px-8 py-3 gap-5 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-700"
        >
            <span class="font-semibold dark:text-gray-200"
                >Shift Information</span
            >
            <div class="w-full flex flex-row gap-4">
                <TextInput
                    :value="data.name"
                    :placeholder="'Name'"
                    :label="'Name'"
                    :error="formErrors.name"
                    @input="
                        (value) => {
                            data.name = value;
                            clearFieldError('name');
                        }
                    "
                />
                <TextInput
                    :value="data.code"
                    :placeholder="'Code'"
                    :label="'Code'"
                    :error="formErrors.code"
                    @input="
                        (value) => {
                            data.code = value;
                            clearFieldError('code');
                        }
                    "
                />
                
            </div>
            <div class="w-full flex flex-row gap-4">
                <div class="w-full flex flex-col gap-2 pr-2">
                    <TextDropdownInput
                        :options="labelDropdown"
                        :selected="selectedLabel"
                        :dontfilter="true"
                        label="Label"
                        placeholder="Select Label"
                        @update="
                            (v: DropdownLabel<Labels>) => {
                                data.label = v.value.value;
                                clearFieldError('label');
                            }
                        "
                    />
                    <span
                        v-if="formErrors.label.length"
                        class="text-xs text-red-600 dark:text-red-400"
                        >{{ formErrors.label[0] }}</span
                    >
                </div>
                <div class="w-full flex flex-col gap-2 pr-2">
                    <TextDropdownInput
                        :options="typeDropdown"
                        :selected="selectedType"
                        :dontfilter="true"
                        label="Shift Type"
                        placeholder="Select Type"
                        @update="
                            (v: DropdownLabel<ShiftTypeOption>) => {
                                data.type = v.value.value;
                                clearFieldError('requiredMinutes');
                            }
                        "
                    />
                </div>
            </div>
            
            <div
                v-if="isFlexibleShift"
                class="w-full flex flex-col gap-2"
            >
                <span class="text-sm font-medium text-gray-700 dark:text-gray-200"
                    >Required Duration (Hours & Minutes)</span
                >
                <div class="flex flex-row gap-4">
                    <NumberInput
                        :model-value="requiredHours"
                        label="Hours"
                        :min="0"
                        placeholder="0"
                        @update:model-value="(value) => setRequiredHours(value)"
                    />
                    <NumberInput
                        :model-value="requiredMinutes"
                        label="Minutes"
                        :min="0"
                        :max="59"
                        placeholder="0"
                        @update:model-value="(value) => setRequiredMinutes(value)"
                    />
                </div>
                <span
                    v-if="formErrors.requiredMinutes.length"
                    class="text-xs text-red-600 dark:text-red-400"
                    >{{ formErrors.requiredMinutes[0] }}</span
                >
            </div>

            <div class="w-full flex flex-row gap-4">
                <div class="flex w-full flex-col gap-1">
                    <TimeInput
                        label="Schedule In"
                        :model-value="scheduleIn"
                        :placeholder="'00:00'"
                        @update:model-value="
                            (value) => {
                                scheduleIn = value ? UITime.from(value) : null;
                                clearFieldError('scheduleIn');
                                clearFieldError('scheduleOut');
                            }
                        "
                    />
                    <span
                        v-if="formErrors.scheduleIn.length"
                        class="text-xs text-red-600 dark:text-red-400"
                        >{{ formErrors.scheduleIn[0] }}</span
                    >
                </div>
                <div class="flex w-full flex-col gap-1">
                    <TimeInput
                        label="Schedule Out"
                        :model-value="scheduleOut"
                        :placeholder="'00:00'"
                        @update:model-value="
                            (value) => {
                                scheduleOut = value ? UITime.from(value) : null;
                                clearFieldError('scheduleOut');
                            }
                        "
                    />
                    <span
                        v-if="formErrors.scheduleOut.length"
                        class="text-xs text-red-600 dark:text-red-400"
                        >{{ formErrors.scheduleOut[0] }}</span
                    >
                </div>
            </div>
            <div class="w-full flex flex-row gap-4">
            <div class="flex w-full flex-col gap-1">
                    <TimeInput
                        label="Break Start"
                        :model-value="breakStart"
                        :placeholder="'00:00'"
                        @update:model-value="
                            (value) => {
                                breakStart = value ? UITime.from(value) : null;
                                clearFieldError('breakStart');
                            }
                        "
                    />
                    <span
                        v-if="formErrors.breakStart.length"
                        class="text-xs text-red-600 dark:text-red-400"
                        >{{ formErrors.breakStart[0] }}</span
                    >
                </div>
                <div class="flex w-full flex-col gap-1">
                    <TimeInput
                        label="Break End"
                        :model-value="breakEnd"
                        :placeholder="'00:00'"
                        @update:model-value="
                            (value) => {
                                breakEnd = value ? UITime.from(value) : null;
                                clearFieldError('breakEnd');
                            }
                        "
                    />
                    <span
                        v-if="formErrors.breakEnd.length"
                        class="text-xs text-red-600 dark:text-red-400"
                        >{{ formErrors.breakEnd[0] }}</span
                    >
                </div>
            </div>
            <div class="w-full">
                <TextInput
                    :value="data.description"
                    :optional="true"
                    :placeholder="'Description'"
                    :label="'Description'"
                    @input="(value) => (data.description = value)"
                />
            </div>
            <!-- <div class="w-full flex flex-col gap-2">
                <span class="text-sm dark:text-gray-300">Cross Day</span>
                <SwitchComponent :checked="data.is_cross_day" @click="data.is_cross_day = !data.is_cross_day"/>
            </div> -->
            <div class="w-full flex flex-row justify-end">
                <ButtonComponent @click="save()"> Save </ButtonComponent>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import IconButton from "@/core/components/button/Icon.button.vue";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { container } from "@/container/di";
import { TOKENS } from "@/container/tokens";
import Toast from "@/core/components/Toast.vue";
import TextInput from "@/core/components/input/Text.input.vue";
import TimeInput from "@/core/components/input/Time.input.vue";
import NumberInput from "@/core/components/input/Number.input.vue";
import { ToastUI } from "@/core/ui/Toast.ui";
import { handleErrors, type UIError } from "@/core/ui/UIError";
import ButtonComponent from "@/core/components/button/Button.component.vue";
import { UITime } from "@/core/ui/UITime";
import { useRoute } from "vue-router";
import type { DomainShift } from "@/domain/models/Shift";
import { nanoid } from "nanoid";
import { DropdownLabel } from "@/core/components/models/DropdownLabel";
import TextDropdownInput from "@/core/components/input/TextDropdown.input.vue";
import {
    labelOptions,
    shiftTypeOptions,
    type Labels,
    type ShiftTypeOption,
} from "./Shift.ui";
// import { useRoute } from "vue-router";

const repository = container.get(TOKENS.ShiftRepository);
const route = useRoute();
const isUpdate = ref(false);

const alerts = ref<ToastUI | null>(null);
const errors = ref<UIError | null>(null);
// const $route = useRoute();
const data = ref<DomainShift>({
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

const scheduleIn = ref<UITime | null>(null);
const scheduleOut = ref<UITime | null>(null);
const breakStart = ref<UITime | null>(null);
const breakEnd = ref<UITime | null>(null);
const labelDropdown = labelOptions.map(
    (option) => new DropdownLabel(option, "value", "label"),
);
const typeDropdown = shiftTypeOptions.map(
    (option) => new DropdownLabel(option, "value", "label"),
);
const requiredHours = ref(0);
const requiredMinutes = ref(0);
const isFlexibleShift = computed(() => data.value.type === "FLEXIBLE");

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

const formErrors = reactive<ShiftFormErrors>({
    name: [],
    label: [],
    scheduleIn: [],
    scheduleOut: [],
    breakStart: [],
    breakEnd: [],
    code: [],
    requiredMinutes: [],
});

const selectedLabel = computed(() => {
    const temp =
        labelDropdown.find(
            (option) => option.value.value === data.value.label,
        ) ?? null;
    console.log(data.value.label);
    return temp;
});

const selectedType = computed(() => {
    return (
        typeDropdown.find(
            (option) => option.value.value === data.value.type,
        ) ?? null
    );
});

function sanitizeNonNegative(value: number) {
    if (!Number.isFinite(value)) {
        return 0;
    }
    return Math.max(0, Math.floor(value));
}

function setRequiredHours(value: number) {
    requiredHours.value = sanitizeNonNegative(value);
}

function setRequiredMinutes(value: number) {
    requiredMinutes.value = Math.min(59, sanitizeNonNegative(value));
}

watch(
    () => data.value.type,
    (type) => {
        if (type === "FLEXIBLE") {
            const total = data.value.required_minutes ?? 0;
            setRequiredHours(Math.floor(total / 60));
            setRequiredMinutes(total % 60);
        } else {
            setRequiredHours(0);
            setRequiredMinutes(0);
            data.value.required_minutes = 0;
            clearFieldError("requiredMinutes");
        }
    },
    { immediate: true },
);

watch(
    [requiredHours, requiredMinutes],
    ([hours, minutes]) => {
        if (!isFlexibleShift.value) {
            return;
        }
        const totalMinutes = hours * 60 + minutes;
        data.value.required_minutes = totalMinutes;
        if (totalMinutes > 0) {
            clearFieldError("requiredMinutes");
        }
    },
);

function clearFieldError(field: keyof ShiftFormErrors) {
    formErrors[field] = [];
}

function resetFormErrors() {
    formErrors.name = [];
    formErrors.label = [];
    formErrors.scheduleIn = [];
    formErrors.scheduleOut = [];
    formErrors.breakStart = [];
    formErrors.breakEnd = [];
    formErrors.code = [];
    formErrors.requiredMinutes = [];
}

function validate(): boolean {
    resetFormErrors();
    let valid = true;

    if (!data.value.name.trim()) {
        formErrors.name.push("Name is required");
        valid = false;
    }

    if (!data.value.code.trim()) {
        formErrors.code.push("Code is required");
        valid = false;
    }

    if (!data.value.label.trim()) {
        formErrors.label.push("Label is required");
        valid = false;
    }

    if (!scheduleIn.value) {
        formErrors.scheduleIn.push("Schedule in is required");
        valid = false;
    }

    if (!scheduleOut.value) {
        formErrors.scheduleOut.push("Schedule out is required");
        valid = false;
    }

    if (!breakStart.value) {
        formErrors.breakStart.push("Break start is required");
        valid = false;
    }

    if (!breakEnd.value) {
        formErrors.breakEnd.push("Break end is required");
        valid = false;
    }

    if (isFlexibleShift.value && data.value.required_minutes <= 0) {
        formErrors.requiredMinutes.push(
            "Required duration must be greater than 0",
        );
        valid = false;
    }


    return valid;
}

function toDomain(): boolean {
    if (
        !scheduleIn.value ||
        !scheduleOut.value ||
        !breakStart.value ||
        !breakEnd.value
    ) {
        return false;
    }

    data.value.schedule_in = scheduleIn.value.toHoursMinutesString();
    data.value.schedule_out = scheduleOut.value.toHoursMinutesString();
    data.value.break_start = breakStart.value.toHoursMinutesString();
    data.value.break_end = breakEnd.value.toHoursMinutesString();
    data.value.created_at = isUpdate.value ? data.value.created_at : Date.now();
    data.value.updated_at = isUpdate.value ? Date.now() : undefined;
    data.value.uuid = isUpdate.value ? data.value.uuid : nanoid();
    data.value.code = data.value.code.trim().toUpperCase();
    data.value.is_cross_day = data.value.is_cross_day ?? false;
    data.value.inserted_by = "Bos Rio";
    if (!isFlexibleShift.value) {
        data.value.required_minutes = 0;
    }

    return true;
}

async function save() {
    if (!validate()) {
        alerts.value = new ToastUI(
            "Please correct the highlighted fields.",
            "error",
            2000,
        );
        return;
    }

    try {
        errors.value = null;
        if (!toDomain()) {
            return;
        }
        if (isUpdate.value) {
            await repository.updateShift(data.value);
        } else {
            await repository.createShift(data.value);
        }
        alerts.value = new ToastUI("Success", "success", 1500);
    } catch (error) {
        errors.value = handleErrors(error);
        alerts.value = new ToastUI(
            errors.value?.message ?? "Error",
            "error",
            2000,
        );
    }
}

async function getShift() {
    try {
        data.value = await repository.getShift(route.params.uuid as string);
        scheduleIn.value = data.value.schedule_in
            ? UITime.fromHoursMinutesString(data.value.schedule_in)
            : null;
        scheduleOut.value = data.value.schedule_out
            ? UITime.fromHoursMinutesString(data.value.schedule_out)
            : null;
        breakStart.value = data.value.break_start
            ? UITime.fromHoursMinutesString(data.value.break_start)
            : null;
        breakEnd.value = data.value.break_end
            ? UITime.fromHoursMinutesString(data.value.break_end)
            : null;
    } catch (error) {
        errors.value = handleErrors(error);
    }
}

onMounted(() => {
    if (route.params.uuid) {
        isUpdate.value = true;
        getShift();
    }
});
</script>

<style scoped></style>
