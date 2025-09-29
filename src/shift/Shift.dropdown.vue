<template>
    <TextDropdownInput
        label="Shift"
        :options="shiftsOptions"
        :selected="selectedShift"
        :dontfilter="true"
        :with-clear="true"
        placeholder="Select Shift"
        @update="(e) => $emit('select', e.value)"
        @clear="$emit('clear')"
    />
</template>

<script setup lang="ts">
import { container } from "@/container/di";
import { TOKENS } from "@/container/tokens";
import TextDropdownInput from "@/core/components/input/TextDropdown.input.vue";
import { DropdownLabel } from "@/core/components/models/DropdownLabel";
import { DomainShift } from "@/domain/models/Shift";
import { computed, onMounted, ref } from "vue";

const $props = defineProps<{
    selected: DomainShift | null;
}>();

const repository = container.get(TOKENS.ShiftRepository);
const shiftsOptions = ref<DropdownLabel<DomainShift>[]>([]);

const search = ref<string>("");
defineEmits<{
    (e: "select", option: DomainShift): void;
    (e: "clear"): void;
}>();

async function getList() {
    try {
        const result = await repository.getShifts({ search: search.value });
        shiftsOptions.value = result.map((item) => {
            return {
                id: item.uuid,
                label: `${item.name} (${item.schedule_in} - ${item.schedule_out})`,
                value: item,
            } as DropdownLabel<DomainShift>;
        });
    } catch (error) {
        console.log(error);
    }
}

onMounted(() => {
    getList();
});

const selectedShift = computed(() => {
    return $props.selected
        ? ({
              id: $props.selected.uuid,
              label: `${$props.selected.name} (${$props.selected.schedule_in} - ${$props.selected.schedule_out})`,
              value: $props.selected,
          } as DropdownLabel<DomainShift>)
        : null;
});
</script>
