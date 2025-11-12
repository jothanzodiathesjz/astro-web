<template>
    <TextDropdownInput
        label="Category"
        placeholder="SelectCategory"
        :options="dropdownOptions"
        :selected="selected"
        :dontfilter="true"
        @update="(e) => $emit('update', e)"
    />
</template>

<script setup lang="ts">
import TextDropdownInput from "@/core/components/input/TextDropdown.input.vue";
import { DropdownLabel } from "@/core/components/models/DropdownLabel";
const options = ["IZIN", "SAKIT", "CUTI", "LIBUR", "TUGAS"];

const dropdownOptions = options.map((item) => new DropdownLabel(item));
defineProps<{
    selected: DropdownLabel<string> | null;
}>();

defineEmits<{
    (e: "update", value: DropdownLabel<string>): void;
}>();
</script>
