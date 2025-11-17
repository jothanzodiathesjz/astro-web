<template>
    <ModalContent
        :visible="visible"
        :header="
            'Edit Attendance' +
            ' ' +
            (isDataMoreThanOne ? 's' : selections[0]?.employee.full_name)
        "
        :body-class="'w-[40rem] mt-10'"
        :position="'top'"
        @close="$emit('close')"
    >
        <div class="w-full h-[70vh] overflow-y-auto">
            <div v-if="isDataMoreThanOne" class="w-full flex flex-col gap-3">
                <span class="dark:text-gray-200 text-sm">Employee *</span>
                <div
                    class="w-full flex flex-row border flex-wrap border-gray-200 dark:border-gray-700 rounded-lg px-2 py-3 gap-2"
                >
                    <span
                        v-for="name in selections"
                        class="text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-1 text-sm"
                        >{{ name.employee.full_name }}</span
                    >
                </div>
            </div>
            <div class="w-full flex flex-col gap-5 p-3">
                <div class="flex flex-col gap-4">
                    <div
                        class="flex border-b border-gray-200 dark:border-gray-700"
                    >
                        <button
                            v-for="tab in tabs"
                            :key="tab.key"
                            type="button"
                            class="px-4 py-2 text-sm font-medium border-b-2 transition-colors focus:outline-none"
                            :class="[
                                activeTab === tab.key
                                    ? 'text-blue-600 border-blue-500 dark:text-blue-400'
                                    : 'text-gray-500 border-transparent hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
                            ]"
                            @click="activeTab = tab.key"
                        >
                            {{ tab.label }}
                        </button>
                    </div>
                    <div
                        v-if="activeTab === TAB_KEYS.detail"
                        class="flex flex-col gap-4"
                    >
                        <template v-if="detailSummaryCard">
                            <div
                                class="rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 p-4 text-white shadow-lg"
                            >
                                <div
                                    class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"
                                >
                                    <div>
                                        <span
                                            class="text-xs uppercase tracking-wide text-white/80"
                                            >Employee</span
                                        >
                                        <p class="text-lg font-semibold">
                                            {{ detailSummaryCard.name }}
                                        </p>
                                        <p class="text-sm text-white/80">
                                            {{ detailSummaryCard.shift }}
                                        </p>
                                    </div>
                                    <div
                                        class="flex flex-col items-start gap-2 text-left md:items-end md:text-right"
                                    >
                                        <span
                                            class="text-xs uppercase tracking-wide text-white/80"
                                            >Status</span
                                        >
                                        <span
                                            class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                                            :class="detailStatusClass"
                                        >
                                            {{ detailSummaryCard.status }}
                                        </span>
                                        <span class="text-sm text-white/80">
                                            {{ detailSummaryCard.date }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div
                                v-if="detailChips.length"
                                class="grid grid-cols-1 gap-3 md:grid-cols-2"
                            >
                                <div
                                    v-for="chip in detailChips"
                                    :key="chip.label"
                                    class="rounded-xl border border-gray-200 bg-gray-50/80 p-3 dark:border-gray-700 dark:bg-gray-900/40 flex flex-row items-center gap-2"
                                    
                                    >
                                <div  class="w-full">
                                    <span
                                        class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                                        >{{ chip.label }}</span
                                    >
                                    <p
                                        class="text-sm font-semibold text-gray-900 dark:text-gray-100"
                                    >
                                        {{ chip.value }}
                                    </p>
                                    <span
                                        v-if="chip.helper"
                                        class="text-xs text-gray-500 dark:text-gray-400"
                                    >
                                        {{ chip.helper }}
                                    </span>
                                </div>
                                <IconButton
                                    v-if="chip.label.toUpperCase() === 'OVERTIME' && chip.value !== '-' && detailAttendance?.over_time"
                                    :icon-name="'trash'"
                                    :disabled="deletingOvertime"
                                    title="Delete overtime"
                                    @click="requestDeleteOvertime"
                                />
                                </div>
                            </div>
                            <div
                                v-if="detailMetrics.length"
                                class="grid grid-cols-2 gap-3 md:grid-cols-4"
                            >
                                <div
                                    v-for="metric in detailMetrics"
                                    :key="metric.label"
                                    class="rounded-xl border border-gray-200 bg-white p-3 text-center dark:border-gray-700 dark:bg-gray-900/60"
                                >
                                    <span
                                        class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400"
                                        >{{ metric.label }}</span
                                    >
                                    <p
                                        class="text-sm font-semibold text-gray-900 dark:text-gray-100"
                                    >
                                        {{ metric.value }}
                                    </p>
                                </div>
                            </div>
                        </template>
                        <div
                            v-else
                            class="text-sm text-gray-500 dark:text-gray-400"
                        >
                            {{
                                isDataMoreThanOne
                                    ? "Detail hanya tersedia untuk satu attendance."
                                    : "Pilih attendance untuk melihat detail."
                            }}
                        </div>
                    </div>
                    <div
                        v-else-if="activeTab === TAB_KEYS.attendance"
                        class="flex flex-col gap-4"
                    >
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
                        <div class="flex flex-col gap-2">
                            <span>Time Off</span>
                            <TimeOffDropdown
                                :selected="selectedTimeOff"
                                @select="(e) => (selectedTimeOff = e)"
                                @clear="selectedTimeOff = null"
                            />
                        </div>
                        <TextAreaInput
                            label="Notes"
                            :value="notes"
                            :placeholder="'Notes'"
                            :error="errorMessages?.data.message"
                            @input="(value) => (notes = value)"
                        />
                    </div>
                    <div v-else class="flex flex-col gap-4">
                        <div class="w-full flex flex-row gap-2">
                            <TimeInput
                                label="Start Time"
                                :model-value="overtimeStartTime"
                                :is24-hour="true"
                                :placeholder="'00:00'"
                                @update:model-value="onUpdateOvertimeStartTime"
                            />
                            <TimeInput
                                label="End Time"
                                :model-value="overtimeEndTime"
                                :is24-hour="true"
                                :placeholder="'00:00'"
                                @update:model-value="onUpdateOvertimeEndTime"
                            />
                        </div>
                        <div class="w-full flex flex-row gap-2">
                            <TimeInput
                                label="Break start time"
                                :is24-hour="true"
                                :model-value="overtimeBreakStart"
                                :placeholder="'00:00'"
                                @update:model-value="onUpdateOvertimeBreakStart"
                            />
                            <TimeInput
                                label="Break end time"
                                :is24-hour="true"
                                :model-value="overtimeBreakEnd"
                                :placeholder="'00:00'"
                                @update:model-value="onUpdateOvertimeBreakEnd"
                            />
                        </div>
                        <div
                            :class="[
                                'inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors',
                                getStatusClass('default'),
                            ]"
                        >
                            Duration: {{ totalMinutes.display }}
                        </div>
                        <div class="flex flex-col gap-3">
                            <span class="text-sm">Holiday</span>
                            <SwitchComponent
                                :checked="isHoliday"
                                @click="isHoliday = !isHoliday"
                            />
                        </div>
                        <TextAreaInput
                            label="Notes"
                            :value="notes"
                            :placeholder="'Notes'"
                            :error="errorMessages?.data.message"
                            @input="(value) => (notes = value)"
                        />
                    </div>
                </div>
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
    <ConfirmModal
        :visible="showDeleteOvertimeConfirm"
        header="Delete Overtime"
        message="Are you sure you want to delete this overtime entry?"
        :icon="'fa-triangle-exclamation'"
        :disabled="deletingOvertime"
        @confirm="executeDeleteOvertime"
        @cancel="showDeleteOvertimeConfirm = false"
    />
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
import { handleErrors, UIError } from "@/core/ui/UIError";
import SwitchComponent from "@/core/components/button/Switch.component.vue";
import { getStatusClass } from "@/core/utils/StatusClass";
import IconButton from "@/core/components/button/Icon.button.vue";
import ConfirmModal from "@/core/components/modal/Confirm.modal.vue";

const $props = defineProps<{
    visible: boolean;
    selections: DomainAttendance[];
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
const deletingOvertime = ref(false);
const showDeleteOvertimeConfirm = ref(false);

const clockIn = ref<UITime | null>(null);
const clockOut = ref<UITime | null>(null);

const overtimeStartTime = ref<UITime | null>(null);
const overtimeBreakStart = ref<UITime | null>(null);
const overtimeEndTime = ref<UITime | null>(null);
const overtimeBreakEnd = ref<UITime | null>(null);
const isHoliday = ref(false);
function diffAcrossDay(start: number, end: number): number {
    let d = end - start;
    if (d < 0) d += 24 * 60; // misal start 22:00 end 02:00
    return d;
}
const totalMinutes = computed(() => {
    // const total =
    //     (overtimeEndTime.value?.toMinutes() || 0) -
    //     (overtimeStartTime.value?.toMinutes() || 0);
    // const breakTotal =
    //     (overtimeBreakEnd.value?.toMinutes() || 0) -
    //     (overtimeBreakStart.value?.toMinutes() || 0);
    // const result = total - breakTotal;

    const start = overtimeStartTime.value?.toMinutes() || 0;
    const end = overtimeEndTime.value?.toMinutes() || 0;
    if (start === null || end === null)
        return {
            minutes: 0,
            display: "0 Jam 0 Menit",
        };
    const work = diffAcrossDay(start, end);
    const bStart = overtimeBreakStart.value?.toMinutes() || 0;
    const bEnd = overtimeBreakEnd.value?.toMinutes() || 0;

    let breakMin = 0;
    if (bStart !== null && bEnd !== null) {
        breakMin = diffAcrossDay(bStart, bEnd);
        breakMin = Math.min(breakMin, work);
    }

    const total = Math.max(0, work - breakMin);

    return {
        minutes: total,
        display: `${Math.floor(total / 60)} Jam ${total % 60} Menit`,
    };
});

const errorMessages = ref<UIError | null>(null);

const notes = ref<string>("");

const TAB_KEYS = {
    detail: "detail",
    attendance: "attendance",
    overtime: "overtime",
} as const;

type TabKey = (typeof TAB_KEYS)[keyof typeof TAB_KEYS];

const tabs: ReadonlyArray<{ key: TabKey; label: string }> = [
    { key: TAB_KEYS.detail, label: "Detail Attendance" },
    { key: TAB_KEYS.attendance, label: "Attendance" },
    { key: TAB_KEYS.overtime, label: "Overtime" },
];

const activeTab = ref<TabKey>(TAB_KEYS.detail);

const disabled = computed(() => loading.value || !$props.selections.length);
const isDataMoreThanOne = computed(() => $props.selections.length > 1);

const attendanceDate = computed(() => {
    if (!$props.selections.length) {
        return new Date();
    }
    const value = $props.selections[0]?.attendance_date;
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

const detailAttendance = computed<DomainAttendance | null>(() => {
    if ($props.selections.length !== 1) {
        return null;
    }
    return $props.selections[0];
});

const detailShift = computed<DomainShift | null>(() => {
    return selectedShift.value ?? detailAttendance.value?.shift ?? null;
});

const detailTimeOff = computed<DomainTimeOff | null>(() => {
    return selectedTimeOff.value ?? detailAttendance.value?.time_off ?? null;
});

type DetailSummaryCard = {
    name: string;
    shift: string;
    date: string;
    status: string;
};

type DetailChip = {
    label: string;
    value: string;
    helper?: string;
};

type DetailMetric = {
    label: string;
    value: string;
};

const formatDisplayDate = (date: Date | null) => {
    if (!date) {
        return "-";
    }
    return date.toLocaleDateString("id-ID", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const formatMinutesValue = (value?: number | null) => {
    if (value === undefined || value === null) {
        return "-";
    }
    return `${value} menit`;
};

const formatDisplayTime = (time: UITime | null, fallback?: string | null) => {
    if (time) {
        return time.toHoursMinutesString();
    }
    if (fallback && fallback.trim()) {
        return fallback;
    }
    return "-";
};

const formatShiftName = (shift: DomainShift | null) => {
    if (!shift) {
        return "-";
    }
    return shift.code ? `${shift.name} (${shift.code})` : shift.name;
};

const formatShiftSchedule = (shift: DomainShift | null) => {
    if (!shift) {
        return "-";
    }
    const scheduleIn = shift.schedule_in || "-";
    const scheduleOut = shift.schedule_out || "-";
    return `${scheduleIn} - ${scheduleOut}`;
};

const formatBreakSchedule = (shift: DomainShift | null) => {
    if (!shift) {
        return "-";
    }
    const breakStart = shift.break_start || "--:--";
    const breakEnd = shift.break_end || "--:--";
    return `${breakStart} - ${breakEnd}`;
};

const detailNotes = computed(() => {
    const trimmed = notes.value.trim();
    if (trimmed) {
        return trimmed;
    }
    return detailAttendance.value?.notes ?? "";
});

const detailSummaryCard = computed<DetailSummaryCard | null>(() => {
    const att = detailAttendance.value;
    if (!att) {
        return null;
    }
    return {
        name: att.employee?.full_name ?? "-",
        shift: formatShiftName(detailShift.value),
        date: formatDisplayDate(attendanceDate.value),
        status: att.status ?? "-",
    };
});

const detailStatusClass = computed(() => {
    return getStatusClass(detailSummaryCard.value?.status ?? "default");
});

const detailChips = computed<DetailChip[]>(() => {
    const att = detailAttendance.value;
    const shift = detailShift.value;
    if (!att) {
        return [];
    }

    const overtimeValue =
        att.over_time || totalMinutes.value.minutes
            ? totalMinutes.value.display
            : "-";

    return [
        {
            label: "Schedule",
            value: formatShiftSchedule(shift),
            helper: shift?.label ?? "",
        },
        {
            label: "Break",
            value: formatBreakSchedule(shift),
            helper: "Break time",
        },
        {
            label: "Clock In",
            value: formatDisplayTime(clockIn.value, att.actual_check_in),
            helper: att.is_late ? "Late check-in" : "",
        },
        {
            label: "Clock Out",
            value: formatDisplayTime(clockOut.value, att.actual_check_out),
            helper: att.is_early_leave ? "Early leave" : "",
        },
        {
            label: "Time Off",
            value: detailTimeOff.value?.name ?? "-",
            helper: detailTimeOff.value?.category ?? "",
        },
        {
            label: "Overtime",
            value: overtimeValue,
            helper: isHoliday.value ? "Holiday overtime" : "",
        },
    ];
});

const detailMetrics = computed<DetailMetric[]>(() => {
    const att = detailAttendance.value;
    if (!att) {
        return [];
    }

    return [
        {
            label: "Minutes Late",
            value: formatMinutesValue(att.minutes_late),
        },
        {
            label: "Minutes Early",
            value: formatMinutesValue(att.minutes_early),
        },
        {
            label: "Early Leave",
            value: att.is_early_leave ? "Yes" : "No",
        },
    ];
});

const resetForm = () => {
    selectedShift.value = null;
    selectedTimeOff.value = null;
    clockIn.value = null;
    clockOut.value = null;
    overtimeStartTime.value = null;
    overtimeBreakStart.value = null;
    overtimeEndTime.value = null;
    overtimeBreakEnd.value = null;
    notes.value = "";
    isHoliday.value = false;
    activeTab.value = TAB_KEYS.detail;
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
const onUpdateOvertimeStartTime = assignTime(overtimeStartTime);
const onUpdateOvertimeBreakStart = assignTime(overtimeBreakStart);
const onUpdateOvertimeEndTime = assignTime(overtimeEndTime);
const onUpdateOvertimeBreakEnd = assignTime(overtimeBreakEnd);

watch(
    () => $props.selections,
    (attendance) => {
        if (!attendance) {
            resetForm();
            return;
        }
        if (attendance.length > 1) {
            activeTab.value = TAB_KEYS.overtime;
        }

        if (attendance.length === 1) {
            const att = attendance[0];
            selectedShift.value = att.shift ?? null;
            selectedTimeOff.value = att.time_off ?? null;

            clockIn.value = parseToUITime(att.actual_check_in);
            clockOut.value = parseToUITime(att.actual_check_out);

            if (att.over_time) {
                overtimeStartTime.value = parseToUITime(
                    att.over_time.start_time,
                );
                overtimeBreakStart.value = parseToUITime(
                    att.over_time.break_start,
                );
                overtimeEndTime.value = parseToUITime(att.over_time.end_time);
                overtimeBreakEnd.value = parseToUITime(att.over_time.break_end);
                isHoliday.value = Boolean(att.over_time.is_holiday);
            } else {
                isHoliday.value = false;
            }
            notes.value = attendance[0].notes ?? "";
        } else {
            overtimeStartTime.value = null;
            overtimeBreakStart.value = null;
            overtimeEndTime.value = null;
            overtimeBreakEnd.value = null;
            isHoliday.value = false;
            notes.value = "";
        }
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
        overtimeStartTime.value,
        overtimeBreakStart.value,
        overtimeEndTime.value,
        overtimeBreakEnd.value,
    ].some(Boolean);

    if (!hasOvertime) {
        return null;
    }

    const overtimePayload: Overtime = {
        start_time: formatToHoursMinutes(overtimeStartTime.value),
        break_start: formatToHoursMinutes(overtimeBreakStart.value),
        end_time: formatToHoursMinutes(overtimeEndTime.value),
        break_end: formatToHoursMinutes(overtimeBreakEnd.value),
        notes: notes.value.trim() ? notes.value.trim() : "",
        is_holiday: isHoliday.value,
        total_minutes: totalMinutes.value.minutes,
    };

    return new DomainOvertime(overtimePayload);
};

const requestDeleteOvertime = () => {
    if (deletingOvertime.value || !detailAttendance.value?.over_time) {
        return;
    }
    showDeleteOvertimeConfirm.value = true;
};

const executeDeleteOvertime = async () => {
    if (deletingOvertime.value) {
        showDeleteOvertimeConfirm.value = false;
        return;
    }
    const attendance = detailAttendance.value;
    if (!attendance?.over_time) {
        showDeleteOvertimeConfirm.value = false;
        return;
    }

    showDeleteOvertimeConfirm.value = false;
    deletingOvertime.value = true;
    try {
        await repository.deleteAttendanceOvertime(attendance.uuid);
        $emit("alert", new ToastUI("Overtime deleted", "success", 2000));
        resetForm();
        $emit("close");
        errorMessages.value = null;
    } catch (error) {
        const errors = handleErrors(error);
        errorMessages.value = errors;
        $emit("alert", new ToastUI(errors.message, "error", 2000));
    } finally {
        deletingOvertime.value = false;
    }
};

const submit = async () => {
    if (!$props.selections.length) {
        return;
    }

    loading.value = true;
    try {
        if (activeTab.value === TAB_KEYS.overtime) {
            const overtimePayload = buildOvertimePayload();
            if (!overtimePayload) {
                throw new Error("Invalid overtime payload");
            }
            await repository.updateAttendanceOvertime(
                $props.selections[0].date.getTime(),
                $props.selections.map((a) => a.employee.uuid),
                overtimePayload,
            );
            $emit("alert", new ToastUI("Attendance updated", "success", 2000));
            resetForm();
            $emit("close");
            errorMessages.value = null;
        } else {
            if ($props.selections.length > 1) {
                throw new Error("Only one attendance can be updated at a time");
            }
            const payload = JSON.parse(
                JSON.stringify($props.selections[0]),
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
            resetForm();
            $emit("close");
            errorMessages.value = null;
        }
    } catch (error) {
        const errors = handleErrors(error);
        errorMessages.value = errors;
        $emit("alert", new ToastUI(errors.message, "error", 2000));
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped></style>
