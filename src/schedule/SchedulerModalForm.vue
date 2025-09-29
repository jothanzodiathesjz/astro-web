<template>
    <ModalContent
        :visible="visible"
        :header="'Assign to Schedule'"
        :body-class="'w-[40rem] mt-10'"
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
                        v-for="name in scheduler?.employee_uuid"
                        class="text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-1 text-sm"
                        >{{ name.full_name }}</span
                    >
                </div>
            </div>
            <ScheduleDropdown
                :selected="selectedSchedule"
                @select="
                    (e) => [
                        (selectedSchedule = e),
                        (effectiveDate = new Date(
                            selectedSchedule.value.effective_date,
                        )),
                    ]
                "
                @clear="() => (selectedSchedule = null)"
            />
            <DateInput
                label="Effective Date"
                :model-value="effectiveDate"
                :with-range="false"
                :placeholder="'Efective date'"
                :readonly="true"
                :with-time="false"
                @update:model-value="
                    (e) => (effectiveDate = e instanceof Date ? e : undefined)
                "
                @clear="() => (effectiveDate = undefined)"
            />
        </div>
        <div class="w-full flex flex-row justify-end gap-3">
            <ButtonComponent
                :variant="'outline'"
                @click="
                    [
                        (selectedSchedule = null),
                        (effectiveDate = undefined),
                        $emit('close'),
                    ]
                "
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
import type { DomainSchedule } from "@/domain/models/Schedule";
import ScheduleDropdown from "./Schedule.dropdown.vue";
import { computed, ref } from "vue";
import { DropdownLabel } from "@/core/components/models/DropdownLabel";
import DateInput from "@/core/components/input/Date.input.vue";
import ButtonComponent from "@/core/components/button/Button.component.vue";
import type { UIScheduler } from "./UIScheduler";

const $props = defineProps<{
    visible: boolean;
    scheduler: UIScheduler | null;
    submiting: boolean;
}>();

const $emit = defineEmits<{
    (e: "close"): void;
    (e: "save", schedule: DomainSchedule, effectiveDate: Date): void;
}>();

const selectedSchedule = ref<DropdownLabel<DomainSchedule> | null>(null);
const effectiveDate = ref<Date | undefined>(undefined);
const disabled = computed(() => {
    return !selectedSchedule.value || !effectiveDate.value || $props.submiting;
});

const submit = () => {
    if (selectedSchedule.value && effectiveDate.value) {
        $emit("save", selectedSchedule.value.value, effectiveDate.value);
    }
};
</script>
