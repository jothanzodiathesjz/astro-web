<template>
    <div
        class="py-5 rounded-lg flex flex-col gap-3 bg-white dark:bg-gray-800 mt-2 px-5 mb-3 h-full min-h-0"
    >
        <ConfirmModal
            :visible="tbd ? true : false"
            :header="'Delete Employee'"
            message="Are you sure you want to delete this employee?"
            :icon="'fa-triangle-exclamation'"
            @confirm="deleteItem()"
            @cancel="tbd = null"
        />
        <span class="dark:text-gray-200">Schedule</span>
        <div class="w-full flex flex-row">
            <div class="w-1/5">
                <TextInput
                    :value="search"
                    :placeholder="'Search schedule'"
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
                    @click="$router.push({ name: 'ScheduleForm' })"
                    class="text-sm"
                    :variant="'primary'"
                    >Add Schedule</ButtonComponent
                >
            </div>
        </div>
        <TableComponent :empty="schedules.length === 0">
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
                        Efective Date
                    </th>
                    <th
                        class="table-header-custom text-start font-normal dark:text-gray-400"
                    >
                        Shift Pattern
                    </th>

                    <th class="table-header-custom"></th>
                </tr>
            </template>
            <template #table-body>
                <tr
                    class="table-row-custom"
                    v-for="emp in schedules.toSorted((a, b) =>
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
                        {{
                            new Date(emp.effective_date).toLocaleDateString(
                                "id-ID",
                                {
                                    year: "numeric",
                                    month: "short",
                                    day: "2-digit",
                                },
                            )
                        }}
                    </td>

                    <td
                        class="table-cell-custom text-gray-700 dark:text-gray-300"
                    >
                        {{ emp.cycle_days }} Days
                    </td>
                    <td class="table-cell-custom">
                        <div class="flex flex-row gap-2">
                            <IconButton
                                class="border border-gray-300 dark:border-gray-600 rounded p-2"
                                :icon-color="'text-gray-400 dark:text-gray-400'"
                                @click="
                                    $router.push({
                                        name: 'ScheduleDetail',
                                        params: { uuid: emp.uuid },
                                    })
                                "
                                :icon-name="'eye'"
                            />
                            <IconButton
                                class="border border-gray-300 dark:border-gray-600 rounded p-2"
                                :icon-color="'text-gray-400 dark:text-gray-400'"
                                @click="tbd = emp"
                                :icon-name="'trash'"
                            />
                        </div>
                    </td>
                </tr>
            </template>
        </TableComponent>
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
import type { DomainSchedule } from "@/domain/models/Schedule";

const repository = container.get(TOKENS.ScheduleRepository);

// const employeeList: typeof dataEmployee = dataEmployee;
const schedules = ref<DomainSchedule[]>([]);
const tbd = ref<DomainSchedule | null>(null);
const search = ref<string>("");

async function getList() {
    schedules.value = await repository.getScheduleList({
        search: search.value,
    });
}

async function deleteItem() {
    if (tbd.value) {
        await repository.deleteSchedule(tbd.value.uuid);
        tbd.value = null;
        getList();
    }
}

onMounted(() => {
    getList();
});
</script>

<style scoped></style>
