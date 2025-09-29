<template>
    <TextDropdownInput
        label="Schedule"
        :selected="selected"
        :options="list"
        :dontfilter="true"
        placeholder="Select Schedule"
        :with-clear="true"
        @update="(e) => $emit('select', e)"
        @clear="() => $emit('clear')"
    />
</template>

<script setup lang="ts">
import { container } from "@/container/di";
import { TOKENS } from "@/container/tokens";
import TextDropdownInput from "@/core/components/input/TextDropdown.input.vue";
import { DropdownLabel } from "@/core/components/models/DropdownLabel";
import { DomainSchedule } from "@/domain/models/Schedule";
import { onMounted, ref } from "vue";

const repository = container.get(TOKENS.ScheduleRepository);
const search = ref("");

defineProps<{
    selected: DropdownLabel<DomainSchedule> | null;
}>();

defineEmits<{
    (e: "select", option: DropdownLabel<DomainSchedule>): void;
    (e: "clear"): void;
}>();
const list = ref<DropdownLabel<DomainSchedule>[]>([]);

async function getList() {
    try {
        const result = await repository.getScheduleList({
            search: search.value,
        });
        list.value = result.map(
            (item) => new DropdownLabel<DomainSchedule>(item, "uuid", "name"),
        );
    } catch (error) {
        console.log(error);
    }
}

onMounted(() => {
    getList();
});
</script>
