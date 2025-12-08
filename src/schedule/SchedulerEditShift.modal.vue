<template>
    <ModalContent
        :visible="data ? true : false"
        :header="'Edit Shift'"
        :body-class="'w-full max-w-2xl mt-10'"
        :position="'top'"
        @close="$emit('close')"
    >
        <div class="w-full flex flex-col gap-5 p-3">
            <TextInput
                :value="data?.employee.full_name ?? ''"
                :readonly="true"
            />
            <ShiftDropdown
                :selected="selectedShift"
                @select="(e) => (selectedShift = e)"
                @clear="() => (selectedShift = null)"
            />
            <DateInput
                label="Effective Date"
                :model-value="data?.date"
                :with-range="false"
                :placeholder="'Efective date'"
                :readonly="true"
                :with-time="false"
            />
        </div>
        <div class="w-full flex flex-row justify-end gap-3">
            <ButtonComponent :variant="'outline'" @click="[$emit('close')]">
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
import { computed, ref, watch } from "vue";
import DateInput from "@/core/components/input/Date.input.vue";
import ButtonComponent from "@/core/components/button/Button.component.vue";
import type { UpdateShiftAtt } from "./UIScheduler";
import TextInput from "@/core/components/input/Text.input.vue";
import ShiftDropdown from "@/shift/Shift.dropdown.vue";
import { DomainShift } from "@/domain/models/Shift";

const $props = defineProps<{
    data: UpdateShiftAtt | null;
    submiting: boolean;
}>();

const $emit = defineEmits<{
    (e: "close"): void;
    (e: "save", data: UpdateShiftAtt): void;
}>();

const disabled = computed(() => {
    return !selectedShift.value || $props.submiting;
});

const selectedShift = ref<DomainShift | null>(null);

const submit = () => {
    if (selectedShift.value && $props.data) {
        $emit("save", {
            ...$props.data,
            shift: {
                ...$props.data?.shift,
                shift: selectedShift.value,
            },
        });
    }
};

watch(
    () => $props.data,
    (data) => {
        if (data) {
            selectedShift.value = data.shift.shift;
        }
    },
);
</script>
