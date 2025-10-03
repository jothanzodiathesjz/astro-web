<template>
    <ModalContent
        :visible="visible"
        :header="'Edit Attendance' + ' - ' + (data?.employee.full_name ?? '')"
        :body-class="'w-[40rem] mt-10'"
        :position="'top'"
        @close="$emit('close')"
    >
        <div class="w-full h-[70vh] overflow-y-auto">
            <div class="w-full flex flex-col gap-5 p-3">
                <DateInput
                    label="Date"
                    :model-value="attendanceDate"
                    :readonly="true"
                    :with-range="false"
                    :with-time="false"
                />
                <ShiftDropdown
                    :selected="selectedShift"
                    @select="(e) => (selectedShift = e)"
                    @clear="selectedShift = null"
                />
                <span>Attendance</span>
                <div class="w-full flex flex-row gap-2">
                    <TimeInput
                        label="Clock In"
                        :model-value="clockIn"
                        :is24-hour="true"
                        @update:model-value="onUpdateClockIn"
                    />
                    <TimeInput
                        label="Clock Out"
                        :is24-hour="true"
                        :model-value="clockOut"
                        @update:model-value="onUpdateClockOut"
                    />
                </div>
                <span>Time Off</span>
                <TimeOffDropdown
                    :selected="selectedTimeOff"
                    @select="(e) => (selectedTimeOff = e)"
                    @clear="selectedTimeOff = null"
                />
                <span>Overtime</span>
                <span class="text-sm dark:text-gray-400 font-bold"
                    >Before the shift start</span
                >
                <div class="w-full flex flex-row gap-2">
                    <TimeInput
                        label="Overtime Duration"
                        :model-value="overTimeBeforeDuration"
                        :is24-hour="true"
                        :placeholder="'00:00'"
                        @update:model-value="onUpdateOverTimeBeforeDuration"
                    />
                    <TimeInput
                        label="Break duration during overtime"
                        :is24-hour="true"
                        :model-value="overTimeBeforeBreak"
                        :placeholder="'00:00'"
                        @update:model-value="onUpdateOverTimeBeforeBreak"
                    />
                </div>
                <span class="text-sm dark:text-gray-400 font-bold"
                    >After the shift ends</span
                >
                <div class="w-full flex flex-row gap-2">
                    <TimeInput
                        label="Overtime Duration"
                        :model-value="overTimeAfterDuration"
                        :is24-hour="true"
                        :placeholder="'00:00'"
                        @update:model-value="onUpdateOverTimeAfterDuration"
                    />
                    <TimeInput
                        label="Break duration during overtime"
                        :is24-hour="true"
                        :model-value="overTimeAfterBreak"
                        :placeholder="'00:00'"
                        @update:model-value="onUpdateOverTimeAfterBreak"
                    />
                </div>
                <TextAreaInput
                    label="Notes"
                    :value="notes"
                    :placeholder="'Notes'"
                    @input="(value) => (notes = value)"
                />
            </div>
        </div>
        <div
            class="w-full flex flex-row justify-end gap-3 border-t border-gray-200 pt-3"
        >
            <ButtonComponent :variant="'outline'" @click="$emit('close')">
                Cancel
            </ButtonComponent>
            <ButtonComponent
                :variant="'primary'"
                :disabled="disabled"
                :loading="loading"
                @click="submit"
            >
                Save
            </ButtonComponent>
        </div>
    </ModalContent>
</template>

<script setup lang="ts">
import ModalContent from "@/core/components/modal/Modal.content.vue";
import { computed, ref, watch, type Ref } from "vue";
import DateInput from "@/core/components/input/Date.input.vue";
import ButtonComponent from "@/core/components/button/Button.component.vue";
import type { DomainShift } from "@/domain/models/Shift";
import type { DomainAttendance } from "@/domain/models/Attendance";
import type { DomainTimeOff } from "@/domain/models/TimeOff";
import ShiftDropdown from "@/shift/Shift.dropdown.vue";
import TimeInput from "@/core/components/input/Time.input.vue";
import { UITime } from "@/core/ui/UITime";
import TimeOffDropdown from "@/settings/time/TimeOff.dropdown.vue";
import TextAreaInput from "@/core/components/input/TextArea.input.vue";
import { container } from "@/container/di";
import { TOKENS } from "@/container/tokens";
import type { Overtime } from "@/domain/types/OvertimeAttributes";
import { DomainOvertime } from "@/domain/models/Overtime";
import { ToastUI } from "@/core/ui/Toast.ui";
import { handleErrors } from "@/core/ui/UIError";

const $props = defineProps<{
    visible: boolean;
    data: DomainAttendance | null;
}>();

const $emit = defineEmits<{
    (e: "close"): void;
    (e: "save", updated: DomainAttendance): void;
    (e: "alert", alert: ToastUI): void;
}>();

const repository = container.get(TOKENS.attendanceRepository);

const selectedShift = ref<DomainShift | null>(null);
const selectedTimeOff = ref<DomainTimeOff | null>(null);
const loading = ref(false);

const clockIn = ref<UITime | null>(null);
const clockOut = ref<UITime | null>(null);

const overTimeBeforeDuration = ref<UITime | null>(null);
const overTimeBeforeBreak = ref<UITime | null>(null);
const overTimeAfterDuration = ref<UITime | null>(null);
const overTimeAfterBreak = ref<UITime | null>(null);

const notes = ref<string>("");

const disabled = computed(() => loading.value || !$props.data);

const attendanceDate = computed(() => {
    const value = $props.data?.attendance_date;
    if (!value) {
        return new Date();
    }

    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
        return parsed;
    }

    const fallback = new Date(`${value}T00:00:00`);
    return Number.isNaN(fallback.getTime()) ? new Date() : fallback;
});

const resetForm = () => {
    selectedShift.value = null;
    selectedTimeOff.value = null;
    clockIn.value = null;
    clockOut.value = null;
    overTimeBeforeDuration.value = null;
    overTimeBeforeBreak.value = null;
    overTimeAfterDuration.value = null;
    overTimeAfterBreak.value = null;
    notes.value = "";
};

const parseToUITime = (time?: string | null): UITime | null => {
    if (!time) {
        return null;
    }
    const [hours, minutes] = time.split(":");
    const parsedHours = Number.parseInt(hours, 10);
    const parsedMinutes = Number.parseInt(minutes, 10);

    if (Number.isNaN(parsedHours) || Number.isNaN(parsedMinutes)) {
        return null;
    }

    return new UITime(parsedHours, parsedMinutes);
};

const assignTime = (target: Ref<UITime | null>) => (value: UITime | null) => {
    target.value = value ? UITime.from(value) : null;
};

const onUpdateClockIn = assignTime(clockIn);
const onUpdateClockOut = assignTime(clockOut);
const onUpdateOverTimeBeforeDuration = assignTime(overTimeBeforeDuration);
const onUpdateOverTimeBeforeBreak = assignTime(overTimeBeforeBreak);
const onUpdateOverTimeAfterDuration = assignTime(overTimeAfterDuration);
const onUpdateOverTimeAfterBreak = assignTime(overTimeAfterBreak);

watch(
    () => $props.data,
    (attendance) => {
        if (!attendance) {
            resetForm();
            return;
        }

        selectedShift.value = attendance.shift ?? null;
        selectedTimeOff.value = attendance.time_off ?? null;

        clockIn.value = parseToUITime(attendance.actual_check_in);
        clockOut.value = parseToUITime(attendance.actual_check_out);

        if (attendance.over_time) {
            overTimeBeforeDuration.value = parseToUITime(
                attendance.over_time.before_shift_duration,
            );
            overTimeBeforeBreak.value = parseToUITime(
                attendance.over_time.before_shift_break,
            );
            overTimeAfterDuration.value = parseToUITime(
                attendance.over_time.after_shift_duration,
            );
            overTimeAfterBreak.value = parseToUITime(
                attendance.over_time.after_shift_break,
            );
        } else {
            overTimeBeforeDuration.value = null;
            overTimeBeforeBreak.value = null;
            overTimeAfterDuration.value = null;
            overTimeAfterBreak.value = null;
        }

        notes.value = attendance.notes ?? "";
    },
    { immediate: true },
);

watch(
    () => $props.visible,
    (visible) => {
        if (!visible) {
            resetForm();
        }
    },
);

const formatToHoursMinutes = (time: UITime | null): string => {
    return time ? time.toHoursMinutesString() : "00:00";
};

const buildOvertimePayload = (): DomainOvertime | null => {
    const hasOvertime = [
        overTimeBeforeDuration.value,
        overTimeBeforeBreak.value,
        overTimeAfterDuration.value,
        overTimeAfterBreak.value,
    ].some(Boolean);

    if (!hasOvertime) {
        return null;
    }

    const overtimePayload: Overtime = {
        before_shift_duration: formatToHoursMinutes(
            overTimeBeforeDuration.value,
        ),
        before_shift_break: formatToHoursMinutes(overTimeBeforeBreak.value),
        after_shift_duration: formatToHoursMinutes(overTimeAfterDuration.value),
        after_shift_break: formatToHoursMinutes(overTimeAfterBreak.value),
    };

    return new DomainOvertime(overtimePayload);
};

const submit = async () => {
    if (!$props.data) {
        return;
    }

    loading.value = true;
    try {
        const payload = JSON.parse(
            JSON.stringify($props.data),
        ) as DomainAttendance;

        payload.actual_check_in = formatToHoursMinutes(clockIn.value);
        payload.actual_check_out = formatToHoursMinutes(clockOut.value);
        payload.shift = selectedShift.value ?? payload.shift;
        payload.time_off = selectedTimeOff.value ?? null;
        payload.over_time = buildOvertimePayload();
        payload.notes = notes.value.trim() ? notes.value.trim() : null;

        const updated = await repository.update(payload);
        $emit("save", updated);
        $emit("alert", new ToastUI("Attendance updated", "success", 2000));
        $emit("close");
    } catch (error) {
        const errors = handleErrors(error);
        $emit("alert", new ToastUI(errors.message, "error", 2000));
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped></style>
