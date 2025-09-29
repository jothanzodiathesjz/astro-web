<template>
    <ModalContent
        :visible="summaryType ? true : false"
        :header="`Attendance Summary - ${summaryType}`"
        :body-class="'w-[40rem] mt-10'"
        :position="'top'"
        @close="$emit('close')"
    >
        <TableComponent
            :empty="data.length === 0"
            class="max-h-[30rem] overflow-auto"
        >
            <template #table-header>
                <tr>
                    <th
                        class="table-header-custom text-start font-normal dark:text-gray-400"
                    >
                        Name
                    </th>
                </tr>
            </template>
            <template #table-body>
                <tr
                    class="table-row-custom"
                    v-for="att in data"
                    :key="att.uuid"
                >
                    <td
                        class="table-cell-custom text-gray-700 dark:text-gray-300"
                    >
                        {{ att.employee.full_name }}
                    </td>
                </tr>
            </template>
        </TableComponent>
    </ModalContent>
</template>

<script setup lang="ts">
import ModalContent from "@/core/components/modal/Modal.content.vue";
import TableComponent from "@/core/components/table/Table.component.vue";
import type { DomainAttendance } from "@/domain/models/Attendance";

const $props = defineProps<{
    data: DomainAttendance[];
    summaryType: string | null;
}>();

const $emit = defineEmits<{
    (e: "close"): void;
    (e: "save"): void;
}>();
</script>
