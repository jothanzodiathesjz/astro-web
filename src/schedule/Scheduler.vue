<template>
    <div>
<Toast
        :duration="vm.alerts?.duration"
        :message="vm.alerts?.message ?? ''"
        :show="vm.alerts ? true : false"
        @on-close="vm.alerts = null"
    />
    <SchedulerModalForm
        :visible="vm.tbs ? true : false"
        :scheduler="vm.tbs"
        :submiting="vm.submiting"
        @close="vm.tbs = null"
        @save="(s, e) => vm.createScheduler(s, e.getTime())"
    />
    <SchedulerEditShiftModal
        :data="vm.updateShiftData"
        :submiting="vm.submiting"
        @save="(e) => [(vm.updateShiftData = e), vm.updateShift()]"
        @close="vm.updateShiftData = null"
    />
    <ScheduleSetTimeoffModal
        :visible="vm.toBeTimeOff ? true : false"
        :data="vm.toBeTimeOff"
        :submiting="vm.submiting"
        @close="vm.toBeTimeOff = null"
        @save="
            (data) =>
                vm.setTimeOffEmployee({
                    date: data.dates,
                    timeOff: data.time_off,
                })
        "
    />
    <div
        class="py-5 flex flex-col gap-3 mt-2 px-5 mb-3 h-full min-h-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-700"
    >
        <ConfirmModal
            :header="'Are you sure?'"
            :content-class="'-top-14 w-full max-w-2xl'"
            :message="'Jadwal biasanya dibuat otomatis setiap bulan oleh sistem. Apakah Anda ingin membuat jadwal secara manual sekarang?'"
            :visible="vm.showConfirmCreateScheduler"
            :icon="'fa-triangle-exclamation'"
            :custom-label-button="{
                cancel: 'Males ah gak jadi',
                confirm: 'Iyadeh, aku buat sekarang',
            }"
            @cancel="vm.showConfirmCreateScheduler = false"
        />
        <span class="dark:text-gray-200">Scheduler</span>
        <div
            class="w-full flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
        >
            <div
                class="flex flex-row border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1"
            >
                <ButtonComponent
                    :variant="section === 'list' ? 'primary' : 'ghost'"
                    :icon-name="'fa-list'"
                    @click="section = 'list'"
                    >List</ButtonComponent
                >
                <ButtonComponent
                    :variant="section === 'calendar' ? 'primary' : 'ghost'"
                    :icon-name="'fa-calendar'"
                    @click="section = 'calendar'"
                    >Calendar</ButtonComponent
                >
            </div>
            <div
                class="w-full flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end"
            >
                <ButtonComponent
                    v-if="vm.selectedEmployees.size > 0"
                    class="text-sm"
                    :variant="'outline'"
                    :icon-name="'fa-file-import'"
                    @click="vm.assignSchedule([...vm.selectedEmployees])"
                    >{{
                        vm.filterState.has_schedule ? "Update" : "Assign"
                    }}
                    Schedule</ButtonComponent
                >
                <div v-if="section === 'calendar'" class="w-full sm:w-auto">
                    <DateRangeInput
                        :model-value="vm.range"
                        :week-start="1"
                        :with-time="false"
                        :is-dark="false"
                        initial-mode="weekly"
                        @update:model-value="
                            (v) => [(vm.range = v), vm.getScheduler()]
                        "
                    />
                </div>
                <div ref="filterWrapper" class="relative">
                    <div
                        v-if="vm.showFilter"
                        class="absolute z-40 top-0 right-0 items-start w-60 border border-gray-300 p-2 flex flex-col bg-white rounded md:right-[9rem]"
                    >
                        <div
                            class="flex flex-col w-full"
                            v-for="option in vm.filterOptions"
                            :key="option.key"
                        >
                            <span class="text-sm font-semibold">
                                {{ option.header }}
                            </span>
                            <button
                                v-for="val in option.values"
                                :key="`${option.key}-${val.value}`"
                                type="button"
                                class="text-sm text-start p-3 w-full flex flex-row items-center hover:bg-gray-200 rounded-lg"
                                @click.prevent="
                                    vm.updateFilter(option.key, val.value)
                                "
                            >
                                <div @click.stop>
                                    <CheckBox
                                        :model-value="
                                            vm.isFilterActive(
                                                option.key,
                                                val.value,
                                            )
                                        "
                                        class="mr-2"
                                        @update:model-value="
                                            (checked) =>
                                                vm.updateFilter(
                                                    option.key,
                                                    val.value,
                                                    checked,
                                                )
                                        "
                                    />
                                </div>
                                {{ val.label }}
                            </button>
                        </div>
                    </div>
                    <ButtonComponent
                        :icon-name="'fa-filter'"
                        :variant="'outline'"
                        @click="vm.showFilter = !vm.showFilter"
                        >Filter ({{
                            Object.values(vm.filterState).filter(
                                (v) => v !== undefined,
                            ).length
                        }})</ButtonComponent
                    >
                </div>
                <div
                    v-if="section === 'list'"
                    class="w-full sm:w-64 lg:w-1/5"
                >
                    <TextInput
                        :icon="{
                            left: {
                                name: 'fa-search',
                            },
                        }"
                        :value="vm.search"
                        :placeholder="'Search employee'"
                        :debounce="400"
                        @input="(v) => [(vm.search = v), vm.getList()]"
                    />
                    <TextInput
                        v-if="section === 'calendar'"
                        :icon="{
                            left: {
                                name: 'fa-search',
                            },
                        }"
                        :value="vm.searchCalendar"
                        :placeholder="'Search employee'"
                        :debounce="400"
                        @input="
                            (v) => [(vm.searchCalendar = v), vm.getScheduler()]
                        "
                    />
                </div>
            </div>
        </div>
        <TableComponent
            v-if="section === 'list'"
            :empty="displayedEmployees.length === 0"
            :overflow-x="true"
            class="h-[79vh]"
            @paginate="vm.withPaginate()"
        >
            <template #table-header>
                <tr>
                    <th
                        class="table-header-custom text-start font-normal dark:text-gray-400"
                    >
                        <CheckBox
                            :model-value="allSelected"
                            @update:model-value="(e) => vm.toogleSelectAll(e)"
                        />
                    </th>
                    <th
                        class="table-header-custom text-start font-normal dark:text-gray-400"
                    >
                        Name
                    </th>
                    <th
                        class="table-header-custom text-start font-normal dark:text-gray-400 truncate"
                    >
                        Fingerprint ID
                    </th>
                    <th
                        class="table-header-custom text-start font-normal dark:text-gray-400 truncate"
                    >
                        Current schedule
                    </th>
                    <th class="table-header-custom"></th>
                </tr>
            </template>
            <template #table-body>
                <tr
                    class="table-row-custom"
                    v-for="emp in displayedEmployees"
                    :key="emp.uuid"
                >
                    <td
                        class="table-cell-custom text-gray-700 dark:text-gray-300"
                    >
                        <CheckBox
                            :model-value="vm.selectedEmployees.has(emp)"
                            @update:model-value="
                                (checked) =>
                                    vm.toggleEmployeeSelection(emp, checked)
                            "
                        />
                    </td>
                    <td
                        class="table-cell-custom text-gray-700 dark:text-gray-300"
                    >
                        <div class="flex flex-row gap-3 w-80 shrink-0">
                            <div
                                class="rounded-full w-10 h-10 shrink-0 bg-gray-200 flex flex-row items-center justify-center"
                            >
                                {{ emp.full_name.charAt(0) }}
                            </div>
                            <div class="flex flex-col gap-2">
                                <span
                                    class="font-semibold text-blue-500 truncate"
                                    >{{ emp.full_name }}</span
                                >
                                <span>{{ emp.employee_id }}</span>
                            </div>
                        </div>
                    </td>
                    <td
                        class="table-cell-custom text-gray-700 dark:text-gray-300"
                    >
                        <div class="w-52 shrink-0">
                            {{ emp.fingerprint_id }}
                        </div>
                    </td>
                    <td
                        class="table-cell-custom text-gray-700 dark:text-gray-300"
                    >
                        <div class="w-60 shrink-0">
                            {{ emp.schedule?.name || "Not assigned" }}
                        </div>
                    </td>
                    <td class="table-cell-custom">
                        <div class="flex flex-row gap-2">
                            <ButtonComponent
                                class="text-sm"
                                :variant="'outline'"
                                :icon-name="'fa-file-import'"
                                @click="[
                                    vm.selectedEmployees.clear(),
                                    vm.assignSchedule([emp]),
                                ]"
                                >{{
                                    emp.schedule ? "Update" : "Assign"
                                }}
                                Schedule</ButtonComponent
                            >
                        </div>
                    </td>
                </tr>
            </template>
        </TableComponent>
        <TableComponent
            v-if="section === 'calendar'"
            :empty="displayedEmployees.length === 0"
            :overflow-x="true"
            class="h-[79vh]"
            @paginate="vm.getSchedulerWithPaginate()"
        >
            <template #table-header>
                <tr>
                    <th
                        class="sticky left-0 top-0 px-3 bg-gray-100 z-10 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 text-start font-normal dark:text-gray-400 shadow-[inset_-1px_0_0_rgba(0,0,0,0.08)] dark:shadow-[inset_-1px_0_0_rgba(255,255,255,0.12)]"
                    >
                        <span class="w-52 shrink-0"> Name </span>
                    </th>
                    <th
                        v-for="day in calendarDays"
                        :key="day.date.toISOString()"
                        class="px-5 shrink-0 table-cell dark:bg-gray-800 py-4 border-gray-700 dark:border-gray-600 rounded-tl-sm text-sm text-start font-normal dark:text-gray-400"
                        :class="day.isToday ? 'bg-blue-100' : 'bg-gray-100'"
                    >
                        <div
                            class="w-44 flex flex-row justify-between items-center"
                        >
                            <span
                                class="text-center text-sm dark:text-gray-300"
                                >{{ formatDateID(day.date) }}</span
                            >
                            <FontAwesomeIcon
                                icon="fa-regular fa-calendar"
                                class="dark:text-gray-300"
                            />
                        </div>
                    </th>
                </tr>
            </template>
            <template #table-body>
                <tr
                    class="table-row-custom"
                    v-for="emp in displayedEmployees"
                    :key="emp.uuid"
                >
                    <td
                        class="w-52 shrink-0 sticky left-0 z-[9] py-3 px-5 border-b border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-800 border-r text-gray-700 dark:text-gray-300 shadow-[inset_-1px_0_0_rgba(0,0,0,0.08)] dark:shadow-[inset_-1px_0_0_rgba(255,255,255,0.12)]"
                    >
                        <div class="flex flex-row gap-3 w-52 shrink-0">
                            <div
                                class="rounded-full w-10 h-10 shrink-0 bg-gray-200 flex flex-row items-center justify-center"
                            >
                                {{ emp.full_name.charAt(0) }}
                            </div>
                            <div class="flex flex-col gap-2">
                                <span
                                    class="font-semibold text-blue-500 truncate"
                                    >{{ emp.full_name }}</span
                                >
                                <span>{{ emp.employee_id }}</span>
                            </div>
                        </div>
                    </td>
                    <td
                        v-for="day in (emp.schedule &&
                            vm.range &&
                            buildCalendarRangeWithSchedule(
                                emp.schedule,
                                vm.range?.[0].getTime(),
                                vm.range?.[1].getTime(),
                            )) ||
                        []"
                        class="table-cell-custom text-gray-700 dark:text-gray-300"
                    >
                        <div
                            class="p-2 w-full text-xs text-start text-white flex flex-row items-center justify-between dark:text-gray-300 rounded"
                            :class="
                                day.shift?.schedule_in === '00:00' &&
                                day.shift?.schedule_out === '00:00'
                                    ? 'bg-gray-400 '
                                    : 'bg-blue-500'
                            "
                        >
                            <div class="flex flex-col gap-1">
                                <span>
                                    {{ day.shift?.schedule_in }}
                                    -
                                    {{ day.shift?.schedule_out }}
                                </span>
                                <span class="text-xs">
                                    {{ day.shift?.name }}
                                </span>
                            </div>
                        </div>
                    </td>
                    <td
                        v-if="!emp.schedule"
                        class="table-cell-custom text-gray-700 dark:text-gray-300"
                        v-for="date in calendarDays"
                        :key="date.date.toISOString()"
                    >
                        <div
                            class="p-2 w-full text-xs text-start text-gray-600 flex flex-col dark:text-gray-300 bg-gray-100 rounded"
                        >
                            Schedule has not been determined
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
import ButtonComponent from "@/core/components/button/Button.component.vue";
// import dataEmployee from "../dummy/employee.json";
import { computed, onMounted, ref } from "vue";
import { onClickOutside } from "@vueuse/core";
import { container } from "@/container/di";
import { TOKENS } from "@/container/tokens";
import CheckBox from "@/core/components/CheckBox.vue";
import SchedulerModalForm from "./SchedulerModalForm.vue";
import {
    buildCalendarRangeWithSchedule,
    dateRange,
    formatDateID,
} from "@/core/utils/Schedule";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Toast from "@/core/components/Toast.vue";
import DateRangeInput from "@/core/components/input/DateRange.input.vue";
import type { RangeDay } from "@/core/utils/Schedule";
import SchedulerEditShiftModal from "./SchedulerEditShift.modal.vue";
import ConfirmModal from "@/core/components/modal/Confirm.modal.vue";
import ScheduleSetTimeoffModal from "./ScheduleSetTimeoff.modal.vue";

const section = ref<"list" | "calendar">("list");
const vm = ref(container.get(TOKENS.SchedulerViewModel));

// const employeeList: typeof dataEmployee = dataEmployee;
const filterWrapper = ref<HTMLDivElement | null>(null);

onClickOutside(filterWrapper, () => {
    if (vm.value.showFilter) {
        vm.value.showFilter = false;
    }
});

const calendarDays = computed<RangeDay[]>(() => {
    if (!vm.value.range) return [];
    const [start, end] = vm.value.range;
    return dateRange(start.getTime(), end.getTime());
});

const displayedEmployees = computed(() => {
    const scheduleFilter = vm.value.filterState.has_schedule;
    const employmentFilter = vm.value.filterState.employment_type;

    return vm.value.employees.filter((emp) => {
        if (scheduleFilter !== undefined) {
            const hasSchedule = Boolean(emp.schedule);
            if (hasSchedule !== scheduleFilter) {
                return false;
            }
        }

        if (employmentFilter !== undefined) {
            const employmentType = emp.employment_type
                ? emp.employment_type.toUpperCase()
                : undefined;
            if (employmentType !== employmentFilter) {
                return false;
            }
        }

        return true;
    });
});

const allSelected = computed(
    () =>
        displayedEmployees.value.length > 0 &&
        displayedEmployees.value.every((emp) =>
            vm.value.selectedEmployees.has(emp),
        ),
);

onMounted(async () => {
    vm.value.getList();
    vm.value.getScheduler();
});
</script>

<style scoped></style>
