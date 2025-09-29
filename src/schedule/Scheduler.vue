<template>
    <div
        class="py-5 rounded-lg flex flex-col gap-3 bg-white dark:bg-gray-800 mt-2 px-5 mb-3 h-full min-h-0"
    >
        <Toast
            :duration="alerts?.duration"
            :message="alerts?.message ?? ''"
            :show="alerts ? true : false"
            @on-close="alerts = null"
        />
        <SchedulerModalForm
            :visible="tbs ? true : false"
            :scheduler="tbs"
            :submiting="submiting"
            @close="tbs = null"
            @save="(s, e) => createScheduler(s, e.getTime())"
        />
        <SchedulerEditShiftModal
            :data="updateShiftData"
            :submiting="submiting"
            @save="(e) => [(updateShiftData = e), updateShift()]"
            @close="updateShiftData = null"
        />
        <ScheduleSetTimeoffModal
            :visible="toBeTimeOff ? true : false"
            :data="toBeTimeOff"
            :submiting="submiting"
            @close="toBeTimeOff = null"
            @save="
                (data) =>
                    setTimeOffEmployee({
                        date: data.dates,
                        timeOff: data.time_off,
                    })
            "
        />
        <ConfirmModal
            :header="'Are you sure?'"
            :content-class="'-top-14 w-[35rem]'"
            :message="'Jadwal biasanya dibuat otomatis setiap bulan oleh sistem. Apakah Anda ingin membuat jadwal secara manual sekarang?'"
            :visible="showConfirmCreateScheduler"
            :icon="'fa-triangle-exclamation'"
            :custom-label-button="{
                cancel: 'Males ah gak jadi',
                confirm: 'Iyadeh, aku buat sekarang',
            }"
            @cancel="showConfirmCreateScheduler = false"
        />
        <span class="dark:text-gray-200">Scheduler</span>
        <div class="w-full flex flex-row justify-between">
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
            <div class="w-full flex flex-row gap-4 justify-end items-center">
                <ButtonComponent
                    v-if="selectedEmployees.size > 0"
                    class="text-sm"
                    :variant="'outline'"
                    :icon-name="'fa-file-import'"
                    @click="assignSchedule([...selectedEmployees])"
                    >{{
                        filterState.has_schedule ? "Update" : "Assign"
                    }}
                    Schedule</ButtonComponent
                >
                <ButtonComponent
                    v-if="
                        section === 'calendar' &&
                        schedulers.length === 0 &&
                        searchCalendar === ''
                    "
                    class="text-sm"
                    :variant="'outline'"
                    :icon-name="'fa-file-import'"
                    @click="showConfirmCreateScheduler = true"
                    >Assign Schedule
                    {{
                        range?.[0].toLocaleDateString("id-ID", {
                            month: "long",
                        })
                    }}</ButtonComponent
                >
                <div v-if="section === 'calendar'">
                    <DateRangeInput
                        :model-value="range"
                        :week-start="1"
                        :with-time="false"
                        :is-dark="false"
                        initial-mode="weekly"
                        @update:model-value="
                            (v) => [(range = v), getScheduler()]
                        "
                    />
                </div>
                <div ref="filterWrapper" class="relative">
                    <div
                        v-if="showFilter"
                        class="absolute z-40 top-0 right-[7rem] items-start w-60 border bg-white border-gray-300 p-2 rounded-lg flex flex-col"
                    >
                        <div
                            class="flex flex-col w-full"
                            v-for="option in filterOptions"
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
                                    updateFilter(option.key, val.value)
                                "
                            >
                                <div @click.stop>
                                    <CheckBox
                                        :model-value="
                                            isFilterActive(
                                                option.key,
                                                val.value,
                                            )
                                        "
                                        class="mr-2"
                                        @update:model-value="
                                            (checked) =>
                                                updateFilter(
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
                        @click="showFilter = !showFilter"
                        >Filter</ButtonComponent
                    >
                </div>
                <div class="w-1/5">
                    <TextInput
                        v-if="section === 'list'"
                        :icon="{
                            left: {
                                name: 'fa-search',
                            },
                        }"
                        :value="search"
                        :placeholder="'Search employee'"
                        :debounce="400"
                        @input="(v) => [(search = v), getList()]"
                    />
                    <TextInput
                        v-if="section === 'calendar'"
                        :icon="{
                            left: {
                                name: 'fa-search',
                            },
                        }"
                        :value="searchCalendar"
                        :placeholder="'Search employee'"
                        :debounce="400"
                        @input="(v) => [(searchCalendar = v), getScheduler()]"
                    />
                </div>
            </div>
        </div>
        <TableComponent
            v-if="section === 'list'"
            :empty="displayedEmployees.length === 0"
            :overflow-x="true"
            class="h-[79vh]"
            @paginate="withPaginate()"
        >
            <template #table-header>
                <tr>
                    <th
                        class="table-header-custom text-start font-normal dark:text-gray-400"
                    >
                        <CheckBox
                            :model-value="allSelected"
                            @update:model-value="toggleSelectAll"
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
                            :model-value="selectedEmployees.has(emp)"
                            @update:model-value="
                                (checked) =>
                                    toggleEmployeeSelection(emp, checked)
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
                                @click="
                                    [
                                        selectedEmployees.clear(),
                                        assignSchedule([emp]),
                                    ]
                                "
                                >{{
                                    emp.schedule ? "Update" : "Assign"
                                }}
                                Schedule</ButtonComponent
                            >
                            <ButtonComponent
                                class="text-sm"
                                :variant="'outline'"
                                :icon-name="'fa-file-import'"
                                @click="toBeTimeOff = emp"
                            >
                                Set Time Off</ButtonComponent
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
            @paginate="getSchedulerWithPaginate()"
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
                            range &&
                            buildCalendarRangeWithSchedule(
                                emp.schedule,
                                range?.[0].getTime(),
                                range?.[1].getTime(),
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
</template>

<script setup lang="ts">
import TextInput from "@/core/components/input/Text.input.vue";
import TableComponent from "@/core/components/table/Table.component.vue";
// import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import ButtonComponent from "@/core/components/button/Button.component.vue";
// import dataEmployee from "../dummy/employee.json";
import { computed, onMounted, reactive, ref } from "vue";
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
import type { UIScheduler, UpdateShiftAtt } from "./UIScheduler";
import { ToastUI } from "@/core/ui/Toast.ui";
import { handleErrors, type UIError } from "@/core/ui/UIError";
import Toast from "@/core/components/Toast.vue";
import {
    DomainEmployeeSchedule,
    DomainSchedulerCalendar,
    type DomainSchedule,
} from "@/domain/models/Schedule";
import DateRangeInput from "@/core/components/input/DateRange.input.vue";
import type { RangeDay } from "@/core/utils/Schedule";
import type { DailyAttendance } from "@/domain/types/AttendanceAttributes";
import SchedulerEditShiftModal from "./SchedulerEditShift.modal.vue";
import ConfirmModal from "@/core/components/modal/Confirm.modal.vue";
import ScheduleSetTimeoffModal from "./ScheduleSetTimeoff.modal.vue";
import type { DomainTimeOff } from "@/domain/models/TimeOff";

const section = ref<"list" | "calendar">("list");

const scheduleRepository = container.get(TOKENS.ScheduleRepository);

// const employeeList: typeof dataEmployee = dataEmployee;
const employees = ref<DomainEmployeeSchedule[]>([]);
const schedulers = ref<DomainSchedulerCalendar[]>([]);
const search = ref<string>("");
const searchCalendar = ref<string>("");
const showFilter = ref<boolean>(false);
const filterWrapper = ref<HTMLElement | null>(null);

onClickOutside(filterWrapper, () => {
    if (showFilter.value) {
        showFilter.value = false;
    }
});

const alerts = ref<ToastUI | null>(null);
const errors = ref<UIError | null>(null);
const employeeCursor = ref<string | undefined>(undefined);
const calendarCursor = ref<string | undefined>(undefined);

const range = ref<[Date, Date] | null>(null);

const calendarDays = computed<RangeDay[]>(() => {
    if (!range.value) return [];
    const [start, end] = range.value;
    return dateRange(start.getTime(), end.getTime());
});

const selectedEmployees = ref<Set<DomainEmployeeSchedule>>(new Set());

const tbs = ref<UIScheduler | null>(null);
const submiting = ref<boolean>(false);

const updateShiftData = ref<UpdateShiftAtt | null>(null);

const toBeTimeOff = ref<DomainEmployeeSchedule | null>(null);

const showConfirmCreateScheduler = ref<boolean>(false);
type FilterKey = "has_schedule" | "employment_type";
type FilterValue = boolean | string;
type FilterOptionValue = {
    label: string;
    value: FilterValue;
};
type FilterOption = {
    header: string;
    key: FilterKey;
    values: FilterOptionValue[];
};

const filterOptions: FilterOption[] = [
    {
        header: "Schedule",
        key: "has_schedule",
        values: [
            { label: "Scheduled", value: true },
            { label: "Not Scheduled", value: false },
        ],
    },
    {
        header: "Employment Type",
        key: "employment_type",
        values: [
            { label: "Permanent", value: "PERMANENT" },
            { label: "Contract", value: "CONTRACT" },
            { label: "Harles", value: "HARLES" },
        ],
    },
];

const filterState = reactive<{
    has_schedule: boolean | undefined;
    employment_type: string | undefined;
}>({
    has_schedule: undefined,
    employment_type: undefined,
});

const displayedEmployees = computed(() => {
    const scheduleFilter = filterState.has_schedule;
    const employmentFilter = filterState.employment_type;

    return employees.value.filter((emp) => {
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

const employmentTypeLookup = computed<Record<string, string | undefined>>(
    () => {
        const lookup: Record<string, string | undefined> = {};

        employees.value.forEach((emp) => {
            lookup[emp.uuid] = emp.employment_type
                ? emp.employment_type.toUpperCase()
                : undefined;
        });

        return lookup;
    },
);

const displayedSchedulers = computed(() => {
    const scheduleFilter = filterState.has_schedule;
    const employmentFilter = filterState.employment_type;

    return schedulers.value.filter((scheduler) => {
        if (scheduleFilter !== undefined) {
            const hasAnyShift = scheduler.daily_attendance.some(
                (attendance) => attendance.shift !== null,
            );

            if (hasAnyShift !== scheduleFilter) {
                return false;
            }
        }

        if (employmentFilter !== undefined) {
            const employmentType =
                employmentTypeLookup.value[scheduler.employee.uuid];

            if (employmentType !== employmentFilter) {
                return false;
            }
        }

        return true;
    });
});

function updateFilter(
    key: FilterKey,
    value: FilterValue,
    explicitState?: boolean,
) {
    if (key === "has_schedule") {
        const typedValue = value as boolean;

        if (explicitState !== undefined) {
            filterState.has_schedule = explicitState ? typedValue : undefined;
        } else {
            filterState.has_schedule =
                filterState.has_schedule === typedValue
                    ? undefined
                    : typedValue;
        }
    }

    if (key === "employment_type") {
        const typedValue = value as string;

        if (explicitState !== undefined) {
            filterState.employment_type = explicitState
                ? typedValue
                : undefined;
        } else {
            filterState.employment_type =
                filterState.employment_type === typedValue
                    ? undefined
                    : typedValue;
        }
    }

    showFilter.value = false;
    getList();
    getScheduler();
}

function isFilterActive(key: FilterKey, value: FilterValue): boolean {
    if (key === "has_schedule") {
        return filterState.has_schedule === value;
    }

    if (key === "employment_type") {
        return filterState.employment_type === value;
    }

    return false;
}

const assignSchedule = (emp: DomainEmployeeSchedule[]) => {
    const hasSchedule = emp.some((emp) => emp.schedule !== null);
    const hasNotSchedule = emp.some((emp) => emp.schedule === null);

    if (hasSchedule && hasNotSchedule) {
        alerts.value = {
            type: "warning",
            message: "Some employees have schedule and some don't.",
            duration: 3000,
        };
        return;
    }
    tbs.value = {
        employee_uuid: [...emp.map((emp) => emp)],
        effective_date: new Date().getTime(),
        schedule_uuid: "",
        has_schedule: hasSchedule,
    };
};

const allSelected = computed(
    () =>
        displayedEmployees.value.length > 0 &&
        displayedEmployees.value.every((emp) =>
            selectedEmployees.value.has(emp),
        ),
);

const attendanceLookup = computed<
    Record<string, Record<string, DailyAttendance>>
>(() => {
    const lookup: Record<string, Record<string, DailyAttendance>> = {};
    schedulers.value.forEach((scheduler) => {
        lookup[scheduler.employee.uuid] = scheduler.daily_attendance.reduce(
            (acc, attendance) => {
                acc[attendance.attendance_date] = attendance;
                return acc;
            },
            {} as Record<string, DailyAttendance>,
        );
    });
    return lookup;
});

const dayKey = (date: Date) => {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
};

const buildRangeQuery = (): { from?: string; to?: string } => {
    if (!range.value) return {};
    const [start, end] = range.value;
    return {
        from: start.getTime().toString(),
        to: end.getTime().toString(),
    };
};

function toggleSelectAll(checked: boolean) {
    const nextSelection = new Set(selectedEmployees.value);
    if (checked) {
        displayedEmployees.value.forEach((emp) => nextSelection.add(emp));
    } else {
        displayedEmployees.value.forEach((emp) => nextSelection.delete(emp));
    }
    selectedEmployees.value = nextSelection;
}

async function createScheduler(s: DomainSchedule, d: number) {
    if (!tbs.value) return;
    submiting.value = true;
    try {
        await scheduleRepository.createScheduler(
            {
                effective_date: d,
                employee_uuid:
                    tbs.value?.employee_uuid.map((emp) => emp.uuid) ?? [],
                schedule_uuid: s.uuid,
            },
            tbs.value.has_schedule,
        );
        alerts.value = {
            message: "Scheduler created successfully",
            duration: 5000,
            type: "success",
        };
        tbs.value = null;
    } catch (error) {
        errors.value = handleErrors(error);
        alerts.value = {
            message: errors.value?.message,
            duration: 5000,
            type: "error",
        };
    } finally {
        submiting.value = false;
        getList();
    }
}

function toggleEmployeeSelection(
    emp: DomainEmployeeSchedule,
    checked: boolean,
) {
    const nextSelection = new Set(selectedEmployees.value);
    if (checked) {
        nextSelection.add(emp);
    } else {
        nextSelection.delete(emp);
    }
    selectedEmployees.value = nextSelection;
}
// const today = ref(new Date(1759248000000));

async function getScheduler() {
    const [result, cursor] = await scheduleRepository.getSchedulers({
        search: searchCalendar.value,
        employment_type: filterState.employment_type,
        ...buildRangeQuery(),
    });

    schedulers.value = result;
    calendarCursor.value = cursor;
}

async function getSchedulerWithPaginate() {
    if (!calendarCursor.value) return;
    const [result, cursor] = await scheduleRepository.getSchedulers({
        search: searchCalendar.value,
        employment_type: filterState.employment_type,
        ...buildRangeQuery(),
        cursor: calendarCursor.value,
    });
    schedulers.value = [...schedulers.value, ...result];
    calendarCursor.value = cursor;
}

async function getList() {
    const [list, cursor] = await scheduleRepository.getEmployeeSchedules({
        search: search.value,
        has_schedule: filterState.has_schedule,
        employment_type: filterState.employment_type,
    });
    employees.value = list;
    const currentSelection = selectedEmployees.value;
    const nextSelection = new Set<DomainEmployeeSchedule>();
    list.forEach((emp) => {
        if (currentSelection.has(emp)) {
            nextSelection.add(emp);
        }
    });
    selectedEmployees.value = nextSelection;
    employeeCursor.value = cursor;
}

async function withPaginate() {
    if (!employeeCursor.value) return;
    const [list, cursor] = await scheduleRepository.getEmployeeSchedules({
        search: search.value,
        has_schedule: filterState.has_schedule,
        employment_type: filterState.employment_type,
        cursor: employeeCursor.value,
    });
    employees.value = [...employees.value, ...list];
    employeeCursor.value = cursor;
}

async function updateShift() {
    if (!updateShiftData.value) return;
    submiting.value = true;
    try {
        const result = await scheduleRepository.updateScheduleOnScheduler(
            updateShiftData.value.shift,
        );
        alerts.value = {
            message: "Shift updated successfully",
            duration: 5000,
            type: "success",
        };
        schedulers.value = schedulers.value.map((scheduler) => {
            if (
                scheduler.employee.uuid === updateShiftData.value?.employee.uuid
            ) {
                return {
                    ...scheduler,
                    daily_attendance: scheduler.daily_attendance.map(
                        (attendance) => {
                            if (
                                attendance.attendance_date ===
                                result.attendance_date
                            ) {
                                return result;
                            }
                            return attendance;
                        },
                    ),
                };
            }
            return scheduler;
        });
        updateShiftData.value = null;
        // getScheduler();
    } catch (error) {
        errors.value = handleErrors(error);
        alerts.value = {
            message: errors.value?.message,
            duration: 5000,
            type: "error",
        };
    } finally {
        submiting.value = false;
    }
}

async function setTimeOffEmployee({
    date,
    timeOff,
}: {
    date: Date[];
    timeOff: DomainTimeOff;
}) {
    if (!toBeTimeOff.value) return;
    submiting.value = true;
    try {
        await scheduleRepository.setTimeOffSchedule(toBeTimeOff.value.uuid, {
            date: date.map((d) => d.getTime()),
            time_off_uuid: timeOff.uuid,
        });
        toBeTimeOff.value = null;
        alerts.value = {
            message: "Time off employee successfully",
            duration: 5000,
            type: "success",
        };
    } catch (error) {
        errors.value = handleErrors(error);
        alerts.value = {
            message: errors.value?.message,
            duration: 5000,
            type: "error",
        };
    } finally {
        submiting.value = false;
    }
}

onMounted(async () => {
    getList();
    getScheduler();
});
</script>

<style scoped></style>
