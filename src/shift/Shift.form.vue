<template>
    <div
        class="w-full h-full flex flex-col items-center px-14 dark:bg-gray-900"
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
            class="w-[80%] bg-white dark:bg-gray-800 flex flex-col mt-5 rounded-2xl px-8 py-3 gap-5"
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
                    :value="data.description"
                    :placeholder="'Description'"
                    :label="'Description'"
                    @input="(value) => (data.description = value)"
                />
            </div>
            <div class="w-full flex flex-row gap-4">
                <TextInput
                    :value="data.label"
                    :placeholder="'Label'"
                    :label="'Label'"
                    :error="formErrors.label"
                    @input="
                        (value) => {
                            data.label = value;
                            clearFieldError('label');
                        }
                    "
                />
            </div>
            <div class="w-full flex flex-row gap-4">
                <div class="flex w-full flex-col gap-1">
                    <TimeInput
                        label="Schedule In"
                        :model-value="scheduleIn"
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
            <div class="w-full flex flex-row justify-end">
                <ButtonComponent @click="save()"> Save </ButtonComponent>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import IconButton from "@/core/components/button/Icon.button.vue";
import { onMounted, reactive, ref } from "vue";
import { container } from "@/container/di";
import { TOKENS } from "@/container/tokens";
import Toast from "@/core/components/Toast.vue";
import TextInput from "@/core/components/input/Text.input.vue";
import TimeInput from "@/core/components/input/Time.input.vue";
import { ToastUI } from "@/core/ui/Toast.ui";
import { handleErrors, type UIError } from "@/core/ui/UIError";
import { v4 } from "uuid";
import ButtonComponent from "@/core/components/button/Button.component.vue";
import { UITime } from "@/core/ui/UITime";
import { useRoute } from "vue-router";
import type { DomainShift } from "@/domain/models/Shift";
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
    schedule_in: "",
    schedule_out: "",
    uuid: "",
    description: "",
    created_at: 0,
    inserted_by: "",
    updated_at: undefined,
    deleted_at: undefined,
});

const scheduleIn = ref<UITime | null>(null);
const scheduleOut = ref<UITime | null>(null);
const breakStart = ref<UITime | null>(null);
const breakEnd = ref<UITime | null>(null);

type ShiftFormErrors = {
    name: string[];
    label: string[];
    scheduleIn: string[];
    scheduleOut: string[];
    breakStart: string[];
    breakEnd: string[];
};

const formErrors = reactive<ShiftFormErrors>({
    name: [],
    label: [],
    scheduleIn: [],
    scheduleOut: [],
    breakStart: [],
    breakEnd: [],
});

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
}

function validate(): boolean {
    resetFormErrors();
    let valid = true;

    if (!data.value.name.trim()) {
        formErrors.name.push("Name is required");
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

    if (scheduleIn.value && scheduleOut.value) {
        if (scheduleIn.value.toSeconds() >= scheduleOut.value.toSeconds()) {
            formErrors.scheduleOut.push(
                "Schedule out must be after schedule in",
            );
            valid = false;
        }
    }

    if (!breakStart.value) {
        formErrors.breakStart.push("Break start is required");
        valid = false;
    }

    if (!breakEnd.value) {
        formErrors.breakEnd.push("Break end is required");
        valid = false;
    }

    if (breakStart.value && breakEnd.value) {
        if (breakStart.value.toSeconds() >= breakEnd.value.toSeconds()) {
            formErrors.breakEnd.push("Break end must be after break start");
            valid = false;
        }
    }

    if (
        scheduleIn.value &&
        scheduleOut.value &&
        breakStart.value &&
        breakEnd.value
    ) {
        const scheduleStart = scheduleIn.value.toSeconds();
        const scheduleFinish = scheduleOut.value.toSeconds();
        if (
            breakStart.value.toSeconds() < scheduleStart ||
            breakEnd.value.toSeconds() > scheduleFinish
        ) {
            formErrors.breakStart.push(
                "Break window must be within the scheduled time",
            );
            valid = false;
        }
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
    data.value.uuid = isUpdate.value ? data.value.uuid : v4();
    data.value.inserted_by = "Bos Rio";

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
