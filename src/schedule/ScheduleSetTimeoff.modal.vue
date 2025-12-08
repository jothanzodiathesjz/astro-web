<template>
    <ModalContent
        :visible="visible"
        :header="'Set Time Off'"
        :body-class="'w-full max-w-2xl mt-10'"
        :position="'top'"
        @close="$emit('close')"
    >
        <div class="w-full flex flex-col gap-5 p-3">
            <div class="w-full flex flex-col gap-3">
                <span class="dark:text-gray-200 text-sm">Employee *</span>
                <div
                    class="w-full flex flex-row border flex-wrap border-gray-200 dark:border-gray-700 rounded-lg px-2 py-3 gap-2"
                >
                    <span
                        class="text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-1 text-sm"
                        >{{ data?.full_name }}</span
                    >
                </div>
            </div>
            <TimeOffDropdown
                :selected="selectedTimeOff"
                @select="(e) => (selectedTimeOff = e)"
            />
            <MultiDateInput
                v-model="selectedDates"
                label="Pilih Tanggal"
                :withTime="false"
                :maxSelectable="10"
                :minDate="new Date()"
                placeholder="Pilih beberapa tanggal…"
                @clear="selectedDates = []"
            />
        </div>
        <div class="w-full flex flex-row justify-end gap-3">
            <ButtonComponent
                :variant="'outline'"
                @click="[
                    $emit('close'),
                    (selectedDates = []),
                    (selectedTimeOff = null),
                ]"
            >
                Cancel
            </ButtonComponent>
            <ButtonComponent
                :variant="'primary'"
                :loading="submiting"
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
import type { DomainEmployeeSchedule } from "@/domain/models/Schedule";
import { computed, ref } from "vue";
import ButtonComponent from "@/core/components/button/Button.component.vue";
import MultiDateInput from "@/core/components/input/MultiDate.input.vue";
import TimeOffDropdown from "@/settings/time/TimeOff.dropdown.vue";
import type { DomainTimeOff } from "@/domain/models/TimeOff";

const $props = defineProps<{
    visible: boolean;
    data: DomainEmployeeSchedule | null;
    submiting: boolean;
}>();

const $emit = defineEmits<{
    (e: "close"): void;
    (e: "save", data: { dates: Date[]; time_off: DomainTimeOff }): void;
}>();

const disabled = computed(() => {
    return !selectedDates.value || !selectedTimeOff || $props.submiting;
});

const selectedDates = ref<Date[]>([]);
const selectedTimeOff = ref<DomainTimeOff | null>(null);

const submit = () => {
    if (!selectedDates.value || !selectedTimeOff.value) return;
    $emit("save", {
        dates: selectedDates.value,
        time_off: selectedTimeOff.value,
    });
    selectedDates.value = [];
    selectedTimeOff.value = null;
};
</script>
