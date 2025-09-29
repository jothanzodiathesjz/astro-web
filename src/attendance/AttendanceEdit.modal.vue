<template>
    <ModalContent
        :visible="visible"
        :header="'Edit Attendance' + ' - ' + data?.employee.full_name"
        :body-class="'w-[40rem] mt-10'"
        :position="'top'"
        @close="$emit('close')"
    >
        <div class="w-full h-[70vh] overflow-y-auto">
            <div class="w-full flex flex-col gap-5 p-3">
                <DateInput
                    label="Date"
                    :model-value="new Date()"
                    :readonly="true"
                    :with-range="false"
                    :with-time="false"
                />
                <ShiftDropdown
                    :selected="selectedShift"
                    @select="(e) => (selectedShift = e)"
                />
                <span>Attendance</span>
                <div class="w-full flex flex-row gap-2">
                    <TimeInput
                        label="Clock In"
                        :model-value="clockIn"
                        :is24-hour="true"
                    />
                    <TimeInput
                        label="Clock Out"
                        :is24-hour="true"
                        :model-value="clockOut"
                    />
                </div>
                <span>Time Off</span>
                <TimeOffDropdown
                    :selected="selectedTimeOff"
                    @select="(e) => (selectedTimeOff = e)"
                />
                <span>Overtime</span>
                <div class="w-full flex flex-row gap-2">
                    <TimeInput
                        label="Shift Start"
                        :model-value="clockIn"
                        :is24-hour="true"
                    />
                    <TimeInput
                        label="Shift End"
                        :is24-hour="true"
                        :model-value="clockOut"
                    />
                </div>
            </div>
        </div>
        <div
            class="w-full flex flex-row justify-end gap-3 border-t border-gray-200 pt-3"
        >
            <ButtonComponent :variant="'outline'" @click="">
                Cancel
            </ButtonComponent>
            <ButtonComponent
                :variant="'primary'"
                :disabled="disabled"
                @click="submit()"
            >
                Save
            </ButtonComponent>
        </div>
    </ModalContent>
</template>

<script setup lang="ts">
import ModalContent from "@/core/components/modal/Modal.content.vue";
import { computed, ref, watch } from "vue";
import DateInput from "@/core/components/input/Date.input.vue";
import ButtonComponent from "@/core/components/button/Button.component.vue";
import type { DomainShift } from "@/domain/models/Shift";
import type { DomainAttendance } from "@/domain/models/Attendance";
import ShiftDropdown from "@/shift/Shift.dropdown.vue";
import TimeInput from "@/core/components/input/Time.input.vue";
import { UITime } from "@/core/ui/UITime";
import TimeOffDropdown from "@/settings/time/TimeOff.dropdown.vue";
import type { DomainTimeOff } from "@/domain/models/TimeOff";

const $props = defineProps<{
    visible: boolean;
    data: DomainAttendance | null;
}>();

const $emit = defineEmits<{
    (e: "close"): void;
    (e: "save"): void;
}>();

const selectedShift = ref<DomainShift | null>(null);
const selectedTimeOff = ref<DomainTimeOff | null>(null);
const effectiveDate = ref<Date | undefined>(undefined);
const disabled = computed(() => {
    return false;
});

const clockIn = ref<UITime | null>(UITime.default());
const clockOut = ref<UITime | null>(UITime.default());

const submit = () => {};

watch(
    () => $props.data,
    () => {
        clockIn.value = UITime.fromHoursMinutesString(
            $props.data?.actual_check_in ?? "00:00",
        );
        clockOut.value = UITime.fromHoursMinutesString(
            $props.data?.actual_check_out ?? "00:00",
        );
    },
);
</script>
