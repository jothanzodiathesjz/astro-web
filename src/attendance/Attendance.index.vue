<template>
    <div class="w-full h-full min-h-0 flex flex-col px-14 dark:bg-gray-900">
        <ModalContent
            :visible="selectedAttendance ? true : false"
            :header="'Detail Attendance'"
            :body-class="'w-[50rem]'"
            @close="selectedAttendance = null"
        >
            <span class="font-semibold dark:text-gray-200">{{
                selectedAttendance
            }}</span>
        </ModalContent>
        <AttendanceSummaryModal
        :summary-type="selectedSummary"
        :data="attendanceList"
        @close="selectedSummary = null"
        />
        <AttendanceEditModal
        :visible="tbe ? true : false"
        :data="tbe"
        @close="tbe = null"
        />
        <div class="w-full flex flex-row py-3 mt-3">
            <span class="text-lg font-semibold dark:text-gray-200"
                >Attendance</span
            >
        </div>
        <div class="mb-4">
            <div class="w-full flex flex-row gap-5">
                <div
                    v-for="value in attendanceSummary"
                    class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 py-3 px-4 rounded-md flex flex-col gap-2"
                >
                    <div class="flex flex-row items-center gap-2">
                        <font-awesome-icon
                            class="text-blue-700 dark:text-blue-500"
                            :icon="value.icon"
                        />
                        <span
                            class="font-extrabold text-blue-800 dark:text-blue-500"
                            >150</span
                        >
                    </div>
                    <span class="text-sm font-medium dark:text-gray-400">{{
                        value.summaryType
                    }}</span>
                    <div class="flex flex-row items-center flex-wrap gap-2">
                        <div
                            v-for="summary in value.data"
                            class="cursor-pointer hover:bg-gray-100 flex flex-row items-center gap-1 border border-gray-100 dark:border-gray-700 py-1 px-2 rounded-md"
                            @click="selectedSummary = value.summaryType"
                            >
                            <span
                                class="text-xs font-semibold text-green-600 dark:text-green-400"
                            >
                                {{ summary.status }}
                            </span>
                            <span
                                class="text-xs font-medium text-gray-500 dark:text-gray-400"
                            >
                                ({{ summary.count }})
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div
            class="py-5 rounded-lg flex flex-col h-full gap-3 bg-white dark:bg-gray-800 mt-4 px-5 mb-3"
        >
            <span class="dark:text-gray-200">List Attendance</span>
            <div class="w-full flex flex-row">
              <div class="w-1/4">
                <DateInput
                    :model-value="date"
                    :readonly="false"
                    placeholder="Select date"
                    :with-range="false"
                    :with-time="false"
                    @update:model-value="
                        (value) => {
                            value instanceof Date && (date = value);
                            getList();
                        }
                    "
                />
              </div>
                <div class="w-full flex flex-row gap-4 justify-end">
                    <ButtonComponent
                        class="text-sm"
                        :variant="'outline'"
                        :icon-name="'fa-file-import'"
                        >Import</ButtonComponent
                    >
                    <ButtonComponent
                        class="text-sm"
                        :variant="'outline'"
                        :icon-name="'fa-file-export'"
                        >Export</ButtonComponent
                    >
                    <div class="w-1/5">
                        <TextInput
                            :value="search"
                            :placeholder="'Search employee'"
                            :debounce="400"
                            :icon="{
                              left: {
                                name: 'fa-search',
                              }
                            }"
                            @input="(v) => [(search = v), getList()]"
                        />
                    </div>
                </div>
            </div>
            <TableComponent 
            :empty="attendanceList.length === 0"
            @paginate="getListWithCursor()"
            class="h-[79vh] overflow-auto"
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
                            Date
                        </th>
                        <th
                            class="table-header-custom text-start font-normal dark:text-gray-400"
                        >
                            Shift
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
                            Clock In
                        </th>
                        <th
                            class="table-header-custom text-start font-normal dark:text-gray-400"
                        >
                            Clock Out
                        </th>
                        <th
                            class="table-header-custom text-start font-normal dark:text-gray-400"
                        >
                            Overtime
                        </th>
                        <th
                            class="table-header-custom text-start font-normal dark:text-gray-400"
                        >
                            Status
                        </th>
                        <th class="table-header-custom"></th>
                    </tr>
                </template>
                <template #table-body>
                    <tr
                        class="table-row-custom"
                        v-for="att in attendanceList"
                        :key="att.uuid"
                    >
                        <td
                            class="table-cell-custom text-gray-700 dark:text-gray-300"
                        >
                            <div class="flex flex-row gap-3 w-52 shrink-0">
                                <div
                                    class="rounded-full w-10 h-10 shrink-0 bg-gray-200 dark:bg-gray-700 flex flex-row items-center justify-center"
                                >
                                    {{ att.employee.full_name.charAt(0) }}
                                </div>
                                <div class="flex flex-col gap-2">
                                    <span
                                        class="font-semibold text-blue-500 truncate"
                                        >{{ att.employee.full_name }}</span
                                    >
                                    <span>{{ att.employee.employee_id }}</span>
                                </div>
                            </div>
                        </td>
                        <td
                            class="table-cell-custom text-gray-700 dark:text-gray-300"
                        >
                            {{ att.attendance_date }}
                        </td>
                        <td
                            class="table-cell-custom text-gray-700 dark:text-gray-300"
                        >
                            {{ att.shift.name || "-" }}
                        </td>
                        <td
                            class="table-cell-custom text-gray-700 dark:text-gray-300"
                        >
                            {{ att.shift.schedule_in || "-" }}
                        </td>
                        <td
                            class="table-cell-custom text-gray-700 dark:text-gray-300"
                        >
                            {{ att.shift.schedule_out || "-" }}
                        </td>
                        <td
                            class="table-cell-custom text-gray-700 dark:text-gray-300"
                        >
                            {{ att.actual_check_in || "-" }}
                        </td>
                        <td
                            class="table-cell-custom text-gray-700 dark:text-gray-300"
                        >
                            {{ att.actual_check_out || "-" }}
                        </td>
                        <td
                            class="table-cell-custom text-gray-700 dark:text-gray-300"
                        >
                            {{ att.over_time || "-" }}
                        </td>
                        <td
                            class="table-cell-custom text-gray-700 dark:text-gray-300"
                        >
                            <span
                                :class="[
                                    'inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors',
                                    getStatusClass(att.status),
                                ]"
                            >
                                {{ formatStatus(att.status) }}
                            </span>
                        </td>
                        <td class="table-cell-custom">
                            <div class="flex flex-row gap-2">
                                <IconButton
                                    class="border border-gray-300 dark:border-gray-600 rounded p-2"
                                    :icon-color="'text-gray-400 dark:text-gray-400'"
                                    :icon-name="'pencil'"
                                    @click="tbe = att"
                                />
                                <IconButton
                                    class="border border-gray-300 dark:border-gray-600 rounded p-2"
                                    :icon-color="'text-gray-400 dark:text-gray-400'"
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
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import IconButton from "@/core/components/button/Icon.button.vue";
import ButtonComponent from "@/core/components/button/Button.component.vue";
import ModalContent from "@/core/components/modal/Modal.content.vue";
import { onMounted, ref } from "vue";
import { container } from "@/container/di";
import { TOKENS } from "@/container/tokens";
import { DomainAttendance } from "@/domain/models/Attendance";
import DateInput from "@/core/components/input/Date.input.vue";
import AttendanceEditModal from "./AttendanceEdit.modal.vue";
import AttendanceSummaryModal from "./AttendanceSummary.modal.vue";
const attendanceSummary = [
    {
        summaryType: "Present Summary",
        icon: ["fa-solid", "fa-fingerprint"],
        data: [
            { status: "On Time", count: 150 },
            { status: "Late Clock In", count: 8 },
            { status: "Late Clock Out", count: 2 },
        ],
    },
    {
        summaryType: "Not Present Summary",
        icon: ["fa-solid", "fa-seedling"],
        data: [
            { status: "Absent", count: 3 },
            { status: "No Clock In", count: 0 },
            { status: "No Clock Out", count: 3 },
            { status: "Invalid", count: 0 },
        ],
    },
    {
        summaryType: "Away Summary",
        icon: ["fa-solid", "fa-plane-departure"],
        data: [
            { status: "Day Off", count: 1 },
            { status: "Time Off", count: 8 },
        ],
    },
];

const attendanceList = ref<DomainAttendance[]>([]);

const repository = container.get(TOKENS.attendanceRepository);
const selectedAttendance = ref<DomainAttendance | null>(null);
const search = ref<string>("");
const cursor = ref<string | undefined>(undefined);
const date = ref<Date | Date[] | undefined>(new Date());

const tbe = ref<DomainAttendance | null>(null);
const selectedSummary = ref<string | null>(null);

const statusClassMap: Record<string, string> = {
    pending:
        "border-yellow-300 bg-yellow-50 text-yellow-700 dark:border-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-200",
    present:
        "border-green-300 bg-green-50 text-green-700 dark:border-green-600 dark:bg-green-900/30 dark:text-green-200",
    late: "border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-600 dark:bg-orange-900/30 dark:text-orange-200",
    leave: "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-900/30 dark:text-blue-200",
    absent:
        "border-red-300 bg-red-50 text-red-700 dark:border-red-600 dark:bg-red-900/30 dark:text-red-200",
    holiday:
        "border-purple-300 bg-purple-50 text-purple-700 dark:border-purple-600 dark:bg-purple-900/30 dark:text-purple-200",
    default:
        "border-gray-300 bg-gray-100 text-gray-600 dark:border-gray-600 dark:bg-gray-800/60 dark:text-gray-300",
};

const getStatusClass = (status: string | null | undefined): string => {
    const key = status?.toLowerCase() ?? "";
    return statusClassMap[key] ?? statusClassMap.default;
};

const formatStatus = (status: string | null | undefined): string => {
    if (!status) return "-";
    return status
        .toLowerCase()
        .split(/[_\s-]+/)
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(" ");
};

async function getList() {
    if (!date.value) return;
    date.value instanceof Date && date.value.setHours(0, 0, 0, 0);
    const [result, nextCursor] = await repository.getAttendanceList({
        search: search.value,
        cursor: cursor.value,
        date: date.value instanceof Date ? date.value.getTime().toString() : undefined,
    });
    cursor.value = nextCursor;
    attendanceList.value = result;
}

async function getListWithCursor() {
    if (!cursor.value) return;
    const [result, nextCursor] = await repository.getAttendanceList({
        cursor: cursor.value,
        date: date.value instanceof Date ? date.value.getTime().toString() : undefined,
    });
    cursor.value = nextCursor;
    attendanceList.value = [...attendanceList.value, ...result];
}

onMounted(() => {
    getList();
});
</script>

<style scoped></style>
