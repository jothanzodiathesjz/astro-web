<template>
    <div class="w-full min-h-0 flex flex-col px-14 dark:bg-gray-900">
        <ConfirmModal
            :visible="tbd ? true : false"
            :header="'Delete Employee'"
            message="Are you sure you want to delete this employee?"
            :icon="'fa-triangle-exclamation'"
            @confirm="deleteItem()"
            @cancel="tbd = null"
        />
        <div class="w-full flex flex-row py-3 mt-3">
            <span class="text-lg font-semibold dark:text-gray-200">Shifts</span>
        </div>
        <div
            class="py-5  flex flex-col gap-3  mt-2 px-5 mb-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-700"
        >
            <span class="dark:text-gray-200">List shift</span>
            <div class="w-full flex flex-row">
                <div class="w-1/5">
                    <TextInput
                        :value="search"
                        :placeholder="'Search shift'"
                        :debounce="400"
                        @input="(v) => [(search = v), getList()]"
                    />
                </div>
                <div class="w-full flex flex-row gap-4 justify-end">
                    <ButtonComponent
                        class="text-sm"
                        :variant="'outline'"
                        :icon-name="'fa-file-import'"
                        :disabled="true"
                        >Import</ButtonComponent
                    >
                    <ButtonComponent
                        class="text-sm"
                        :variant="'outline'"
                        :icon-name="'fa-file-export'"
                        >Export</ButtonComponent
                    >
                    <ButtonComponent
                        @click="$router.push({ name: 'ShiftForm' })"
                        class="text-sm"
                        :variant="'primary'"
                        >Add Shift</ButtonComponent
                    >
                </div>
            </div>
            <TableComponent :empty="shifts.length === 0">
                <template #table-header>
                    <tr>
                        <th
                            class="table-header-custom text-start font-normal dark:text-gray-400"
                        >
                            Name
                        </th>
                        <th
                            class="table-header-custom text-start font-normal dark:text-gray-400"
                        >
                            Code
                        </th>
                        <th
                            class="table-header-custom text-start font-normal dark:text-gray-400"
                        >
                            Label
                        </th>
                        <th
                            class="table-header-custom text-start font-normal dark:text-gray-400"
                        >
                            Schedule In
                        </th>
                        <th
                            class="table-header-custom text-start font-normal dark:text-gray-400"
                        >
                            Schedule Out
                        </th>
                        <th
                            class="table-header-custom text-start font-normal dark:text-gray-400"
                        >
                            Break Start
                        </th>
                        <th
                            class="table-header-custom text-start font-normal dark:text-gray-400"
                        >
                            Break End
                        </th>
                        <th class="table-header-custom text-start font-normal dark:text-gray-400">Cross Day</th>
                        <th class="table-header-custom"></th>
                        <th class="table-header-custom"></th>
                    </tr>
                </template>
                <template #table-body>
                    <tr
                        class="table-row-custom"
                        v-for="emp in shifts.toSorted((a, b) =>
                            a.name.localeCompare(b.name),
                        )"
                        :key="emp.uuid"
                    >
                        <td
                            class="table-cell-custom text-gray-700 dark:text-gray-300"
                        >
                            {{ emp.name }}
                        </td>
                        <td
                            class="table-cell-custom text-gray-700 dark:text-gray-300"
                        >
                            {{ emp.code || "-" }}
                        </td>
                        <td
                            class="table-cell-custom text-gray-700 dark:text-gray-300"
                        >
                            {{ emp.label }}
                        </td>

                        <td
                            class="table-cell-custom text-gray-700 dark:text-gray-300"
                        >
                            {{ emp.schedule_in }}
                        </td>
                        <td
                            class="table-cell-custom text-gray-700 dark:text-gray-300"
                        >
                            {{ emp.schedule_out }}
                        </td>
                        <td
                            class="table-cell-custom text-gray-700 dark:text-gray-300"
                        >
                            {{ emp.break_start }}
                        </td>
                        <td
                            class="table-cell-custom text-gray-700 dark:text-gray-300"
                        >
                            {{ emp.break_end }}
                        </td>
                        <td
                            class="table-cell-custom text-gray-700 dark:text-gray-300"
                        >
                           
                            <FontAwesomeIcon
                                v-if="emp.is_cross_day"
                                class="text-green-500"
                                :border="true"
                                :icon="['fas', 'check']"
                            />
                            <FontAwesomeIcon
                                v-else
                                class="text-red-500"
                                :border="true"
                                :icon="['fas', 'times']"
                            />
                        </td>
                        <td
                            class="table-cell-custom text-gray-700 dark:text-gray-300"
                        >
                            <span
                                class="border dark:border-gray-600 rounded p-2"
                                :class="
                                    emp.is_scheduled
                                        ? 'border-green-500 '
                                        : 'border-red-500 '
                                "
                                >{{
                                    emp.is_scheduled
                                        ? "Scheduled"
                                        : "Unscheduled"
                                }}</span
                            >
                        </td>
                        <td class="table-cell-custom">
                            <div class="flex flex-row gap-2">
                                <IconButton 
                @click="$router.push({ name: 'ShiftDetail', params: { uuid: emp.uuid }})" 
                :icon-name="'pencil'" 
                />
                                <IconButton
                                    class="border border-gray-300 dark:border-gray-600 rounded p-2"
                                    :icon-color="'text-gray-400 dark:text-gray-400'"
                                    :disabled="emp.is_scheduled"
                                    @click="tbd = emp"
                                    :icon-name="'trash'"
                                />
                            </div>
                        </td>
                    </tr>
                </template>
            </TableComponent>
        </div>
    </div>
</template>

<script setup lang="ts">
import TextInput from "@/core/components/input/Text.input.vue";
import TableComponent from "@/core/components/table/Table.component.vue";
// import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import IconButton from "@/core/components/button/Icon.button.vue";
import ButtonComponent from "@/core/components/button/Button.component.vue";
// import dataEmployee from "../dummy/employee.json";
import { onMounted, ref } from "vue";
import { container } from "@/container/di";
import { TOKENS } from "@/container/tokens";
import ConfirmModal from "@/core/components/modal/Confirm.modal.vue";
import type { DomainShift } from "@/domain/models/Shift";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const repository = container.get(TOKENS.ShiftRepository);

// const employeeList: typeof dataEmployee = dataEmployee;
const shifts = ref<DomainShift[]>([]);
const tbd = ref<DomainShift | null>(null);
const search = ref<string>("");

async function getList() {
    shifts.value = await repository.getShifts({
        search: search.value,
    });
}

async function deleteItem() {
    if (tbd.value) {
        await repository.deleteShift(tbd.value.uuid);
        tbd.value = null;
        getList();
    }
}

onMounted(() => {
    getList();
});
</script>

<style scoped></style>
