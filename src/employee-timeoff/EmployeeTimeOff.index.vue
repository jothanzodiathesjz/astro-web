<template>
    <div
        class="w-full min-h-0 flex flex-col px-4 pb-6 dark:bg-gray-900 sm:px-6 lg:px-10 2xl:px-14"
    >
        <ConfirmModal
            :visible="tbd ? true : false"
            :header="'Delete Employee'"
            message="Are you sure you want to delete this employee?"
            :icon="'fa-triangle-exclamation'"
            @confirm="deleteItem()"
            @cancel="tbd = null"
        />
        <div class="w-full flex flex-row py-3 mt-3">
            <span class="text-lg font-semibold dark:text-gray-200"
                >Time Off Request</span
            >
        </div>
        <div
            class="py-5 flex flex-col gap-3 mt-2 px-5 mb-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-700"
        >
            <span class="dark:text-gray-200">List Employee</span>
            <div class="w-full flex flex-col gap-3 md:flex-row md:items-center">
                <div class="w-full md:w-1/3 lg:w-1/4">
                    <TextInput
                        :value="search"
                        :placeholder="'Search employee'"
                        :debounce="400"
                        @input="(v) => [(search = v), getList()]"
                    />
                </div>
                <div class="w-full md:w-1/3 lg:w-1/4">
                    <DateInput
                        :model-value="dateFilter"
                        :with-time="false"
                        placeholder="Filter by date"
                        @update:model-value="onDateFilterChange"
                        @clear="clearDateFilter"
                    />
                </div>
                <div
                    class="w-full flex flex-wrap gap-3 justify-start md:justify-end"
                >
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
                        @click="$router.push({ name: 'EmployeeTimeOffForm' })"
                        class="text-sm"
                        :variant="'primary'"
                        >Add Request</ButtonComponent
                    >
                </div>
            </div>
            <TableComponent
                class="h-[70vh] overflow-auto"
                :empty="employees.length === 0"
                @paginate="getListWithCursor()"
            >
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
                            Department
                        </th>
                        <th
                            class="table-header-custom text-start font-normal dark:text-gray-400"
                        >
                            Job Position
                        </th>
                        <th
                            class="table-header-custom text-start font-normal dark:text-gray-400"
                        >
                            Job Level
                        </th>
                        <th
                            class="table-header-custom text-start font-normal dark:text-gray-400"
                        >
                            Time Off
                        </th>
                        <th
                            class="table-header-custom text-start font-normal dark:text-gray-400"
                        >
                            Date
                        </th>
                        <th class="table-header-custom"></th>
                    </tr>
                </template>
                <template #table-body>
                    <tr
                        class="table-row-custom"
                        v-for="emp in employees"
                        :key="emp.uuid"
                    >
                        <td
                            class="table-cell-custom text-gray-700 dark:text-gray-300"
                        >
                            <div class="flex flex-row gap-3 w-52 shrink-0">
                                <div
                                    class="rounded-full w-10 h-10 shrink-0 dark:bg-gray-700 dark:text-gray-300 bg-gray-200 flex flex-row items-center justify-center"
                                >
                                    {{ emp.employee.full_name.charAt(0) }}
                                </div>
                                <div class="flex flex-col gap-2">
                                    <span
                                        class="font-semibold text-blue-500 truncate"
                                        >{{ emp.employee.full_name }}</span
                                    >
                                    <span>{{ emp.employee.employee_id }}</span>
                                </div>
                            </div>
                        </td>
                        <td
                            class="table-cell-custom text-gray-700 dark:text-gray-300"
                        >
                            {{ emp.employee.employment.department.name }}
                        </td>
                        <td
                            class="table-cell-custom text-gray-700 dark:text-gray-300"
                        >
                            {{ emp.employee.employment.job_title }}
                        </td>
                        <td
                            class="table-cell-custom text-gray-700 dark:text-gray-300"
                        >
                            {{ capitalize(emp.employee.employment.job_level) }}
                        </td>
                        <td
                            class="table-cell-custom text-gray-700 dark:text-gray-300"
                        >
                            <span
                                class="text-green-500 border border-green-500 rounded px-2 text-xs"
                                >{{ emp.time_off.name }}</span
                            >
                        </td>
                        <td
                            class="table-cell-custom text-gray-700 dark:text-gray-300"
                        >
                            {{ emp.time_off_date }}
                        </td>
                        <td class="table-cell-custom">
                            <div class="flex flex-row gap-2">
                                <!-- <IconButton
                                    class="border border-gray-300 dark:border-gray-600 rounded p-2"
                                    :icon-color="'text-gray-400 dark:text-gray-400'"
                                    @click="
                                        $router.push({
                                            name: 'EmployeeDetail',
                                            params: { uuid: emp.uuid },
                                        })
                                    "
                                    :icon-name="'pencil'"
                                /> -->
                                <IconButton
                                    class="border border-gray-300 dark:border-gray-600 rounded p-2"
                                    :icon-color="'text-gray-400 dark:text-gray-400'"
                                    :icon-name="'trash'"
                                    @click="tbd = emp"
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
import DateInput from "@/core/components/input/Date.input.vue";
import TableComponent from "@/core/components/table/Table.component.vue";
// import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import IconButton from "@/core/components/button/Icon.button.vue";
import ButtonComponent from "@/core/components/button/Button.component.vue";
// import dataEmployee from "../dummy/employee.json";
import { onMounted, ref } from "vue";
import { container } from "@/container/di";
import { TOKENS } from "@/container/tokens";
import ConfirmModal from "@/core/components/modal/Confirm.modal.vue";
import type { DomainEmployeeTimeOff } from "@/domain/models/TimeOff";
import { capitalize } from "@/core/utils/Text";
import { formatDate } from "@/core/utils/DateConverter";
import type { IQueryMetadata } from "@/http-client/query-metadata";

const repository = container.get(TOKENS.TimeOffRepository);

// const employeeList: typeof dataEmployee = dataEmployee;
const employees = ref<DomainEmployeeTimeOff[]>([]);
const tbd = ref<DomainEmployeeTimeOff | null>(null);
const search = ref<string>("");
const cursor = ref<string | undefined>(undefined);
const dateFilter = ref<Date | Date[] | undefined>(undefined);

function buildQueryParams(extra?: Partial<IQueryMetadata>): IQueryMetadata {
    const query: IQueryMetadata = {
        search: search.value,
    };

    if (dateFilter.value && dateFilter.value instanceof Date) {
        const normalized = new Date(dateFilter.value);
        normalized.setHours(0, 0, 0, 0);
        query.date = formatDate(normalized);
    }

    return {
        ...query,
        ...(extra ?? {}),
    };
}

function onDateFilterChange(value: Date | Date[] | undefined) {
    const nextValue = Array.isArray(value)
        ? (value[0] ?? null)
        : value instanceof Date
          ? value
          : null;
    const currentTime =
        (dateFilter.value instanceof Date && dateFilter.value?.getTime()) ??
        null;
    const nextTime = nextValue?.getTime() ?? null;

    if (currentTime === nextTime) return;

    dateFilter.value = value;
    getList();
}

function clearDateFilter() {
    if (!dateFilter.value) return;
    dateFilter.value = undefined;
    getList();
}

async function getList() {
    [employees.value, cursor.value] =
        await repository.getTimeOffRequestList(buildQueryParams());
}

async function getListWithCursor() {
    if (!cursor.value) return;
    const [data, nextCursor] = await repository.getTimeOffRequestList(
        buildQueryParams({
            cursor: cursor.value,
        }),
    );
    employees.value = [...employees.value, ...data];
    cursor.value = nextCursor;
}

async function deleteItem() {
    if (tbd.value) {
        // await repository.delete(tbd.value.uuid);
        // tbd.value = null;
        // getList();
    }
}

onMounted(() => {
    getList();
});
</script>

<style scoped></style>
