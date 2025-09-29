<template>
    <TextDropdownInput
        label="Select Time Off"
        :options="timeOffOptions"
        :selected="selectedShift"
        :dontfilter="true"
        :with-clear="true"
        placeholder="Select Time Off"
        @update="(e) => $emit('select', e.value)"
        @clear="$emit('clear')"
    />
</template>

<script setup lang="ts">
import { container } from "@/container/di";
import { TOKENS } from "@/container/tokens";
import TextDropdownInput from "@/core/components/input/TextDropdown.input.vue";
import { DropdownLabel } from "@/core/components/models/DropdownLabel";
import type { DomainTimeOff } from "@/domain/models/TimeOff";
import { computed, onMounted, ref } from "vue";

const $props = defineProps<{
    selected: DomainTimeOff | null;
}>();

const repository = container.get(TOKENS.TimeOffRepository);
const timeOffOptions = ref<DropdownLabel<DomainTimeOff>[]>([]);

const search = ref<string>("");
defineEmits<{
    (e: "select", option: DomainTimeOff): void;
    (e: "clear"): void;
}>();

async function getList() {
    try {
        const result = await repository.getList({ search: search.value });
        timeOffOptions.value = result.map((item) => {
            return {
                id: item.uuid,
                label: `${item.name} (${item.code})`,
                value: item,
            } as DropdownLabel<DomainTimeOff>;
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
              label: `${$props.selected.name} (${$props.selected.code})`,
              value: $props.selected,
          } as DropdownLabel<DomainTimeOff>)
        : null;
});
</script>
