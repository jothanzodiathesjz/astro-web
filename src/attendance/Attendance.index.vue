<template>
    <div class="w-full h-full min-h-0 flex flex-col px-14  dark:bg-gray-900">
        <Toast
            :duration="alerts?.duration"
            :message="alerts?.message ?? ''"
            :show="alerts ? true : false"
            @on-close="alerts = null"
        />
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
            :visible="selectionsAtt.length ? true : false"
            :selections="selectionsAtt"
            @close="handleAttendanceClose"
            @save="handleAttendanceSave"
            @alert="handleAttendanceAlert"
        />
        <ConfirmModal
            :visible="tbd ? true : false"
            :header="'Delete Attendance'"
            message="Are you sure you want to delete this attendance?"
            :icon="'fa-triangle-exclamation'"
            :disabled="deleting"
            @confirm="deleteAttendance()"
            @cancel="tbd = null"
        />
        <AttendanceLogsModal :attendance="log" @close="log = null" />
        <div class="w-full flex flex-row py-3 mt-3">
            <span class="text-lg font-semibold dark:text-gray-200"
                >Attendance</span
            >
        </div>
        <div class="mb-4">
            <div class="w-full flex flex-row gap-5 portrait:flex-col">
                <div
                    v-for="value in attendanceSummary"
                    class="  py-3 px-4 flex flex-col gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-700"
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
                            @click="selectedSummary = summary.status"
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
            class="py-5 flex flex-col h-full gap-3 mt-4 px-5 mb-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-700"
        >
            <span class="dark:text-gray-200">List Attendance</span>
            <div class="w-full flex flex-row gap-3">
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
                <ImportButtonComponent
                        :allowed-extensions="['.csv', '.xlsx', '.txt']"
                        :loading="isImporting"
                        @import="onVerifyAttendanceImport"
                    />
                    <ButtonComponent
                        class="text-sm"
                        :variant="'outline'"
                        :icon-name="'fa-file-export'"
                        >Export</ButtonComponent
                    >
                <div class="w-full flex flex-row gap-3 justify-end items-center flex-wrap">
                    <div
                        v-if="selectedAttendanceIds.size > 0"
                        class="flex flex-row items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
                    >
                        <span>{{ selectedAttendanceIds.size }} selected</span>
                        <ButtonComponent
                            class="text-sm"
                            :variant="'outline'"
                            :icon-name="'fa-pen-to-square'"
                            @click="startMultiEdit()"
                        >
                            Edit Selected
                        </ButtonComponent>
                    </div>
                    <IconButton
                        class="border border-gray-300 dark:border-gray-600 rounded-md p-2"
                        :icon-color="'text-gray-400 dark:text-gray-400'"
                        :icon-name="'refresh'"
                        @click="getList()"
                    />
                    <div class="w-1/4">
                        <TextInput
                            :value="search"
                            :placeholder="'Search employee'"
                            :debounce="400"
                            :icon="{
                                left: {
                                    name: 'fa-search',
                                },
                            }"
                            @input="(v) => [(search = v), getList()]"
                        />
                    </div>
                </div>
            </div>
            <TableComponent
                :empty="
                    !isLoading &&
                    !isLoadingMore &&
                    displayedAttendances.length === 0
                "
                @paginate="getListWithCursor()"
                class="h-[79vh] overflow-auto"
            >
                <template #table-header>
                    <tr>
                        <th
                        class="table-header-custom text-start font-normal dark:text-gray-400"
                    >
                        <CheckBox
                            :model-value="allSelected"
                            @update:model-value="(checked) => toggleSelectAll(checked)"
                        />
                    </th>
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
                    <!-- SKELETON ROWS (initial load) -->
                    <template v-if="isLoading">
                        <tr
                            class="table-row-custom"
                            v-for="i in skeletonCount"
                            :key="'sk-' + i"
                        >
                        <td
                        class="table-cell-custom text-gray-700 dark:text-gray-300"
                    >
                    </td>
                            <td class="table-cell-custom">
                                <div
                                    class="flex flex-row gap-3 w-52 shrink-0 items-center"
                                >
                                    <div
                                        class="rounded-full w-10 h-10 shrink-0 bg-gray-200 dark:bg-gray-700 animate-pulse"
                                    ></div>
                                    <div class="flex-1">
                                        <div
                                            class="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"
                                        ></div>
                                        <div
                                            class="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                                        ></div>
                                    </div>
                                </div>
                            </td>
                            <td class="table-cell-custom">
                                <div
                                    class="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                                ></div>
                            </td>
                            <td class="table-cell-custom">
                                <div
                                    class="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                                ></div>
                            </td>
                            <td class="table-cell-custom">
                                <div
                                    class="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                                ></div>
                            </td>
                            <td class="table-cell-custom">
                                <div
                                    class="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                                ></div>
                            </td>
                            <td class="table-cell-custom">
                                <div
                                    class="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                                ></div>
                            </td>
                            <td class="table-cell-custom">
                                <div
                                    class="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                                ></div>
                            </td>
                            <td class="table-cell-custom">
                                <div
                                    class="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                                ></div>
                            </td>
                            <td class="table-cell-custom">
                                <div
                                    class="inline-flex rounded-full border px-6 py-2"
                                >
                                    <div
                                        class="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                                    ></div>
                                </div>
                            </td>
                            <td class="table-cell-custom">
                                <div class="flex flex-row gap-2">
                                    <div
                                        class="w-8 h-8 rounded border border-gray-200 dark:border-gray-700 animate-pulse"
                                    ></div>
                                    <div
                                        class="w-8 h-8 rounded border border-gray-200 dark:border-gray-700 animate-pulse"
                                    ></div>
                                    <div
                                        class="w-8 h-8 rounded border border-gray-200 dark:border-gray-700 animate-pulse"
                                    ></div>
                                </div>
                            </td>
                        </tr>
                    </template>

                    <!-- DATA ROWS -->
                    <template v-else>
                        <tr
                            class="table-row-custom tr-appear"
                            v-for="att in displayedAttendances"
                            :key="att.uuid"
                        >
                         <td
                        class="table-cell-custom text-gray-700 dark:text-gray-300"
                    >
                        <CheckBox
                            :model-value="selectedAttendanceIds.has(att.uuid)"
                            @update:model-value="
                                (checked) => toggleAttendanceSelection(att, checked)
                            "
                        />
                    </td>
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
                                        <span>{{
                                            att.employee.employee_id
                                        }}</span>
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
                                class="table-cell-custom"
                                :class="{
                                    'text-red-500': att.is_late,
                                }"
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
                                {{ att.over_time?.start_time || "-" }} - {{ att.over_time?.end_time || "-" }}
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
                                        :title="'Edit'"
                                        @click="openAttendanceEditor(att)"
                                    />
                                    <IconButton
                                        :class="['border border-gray-300 dark:border-gray-600 rounded p-2', { 'opacity-50': !att.is_modify }]"
                                        :icon-color="'text-gray-400 dark:text-gray-400'"
                                        :icon-name="'clock-rotate-left'"
                                        :title="'History Log'"
                                        :disabled="!att.is_modify"
                                        @click="log = att"
                                    />
                                    <IconButton
                                        class="border border-gray-300 dark:border-gray-600 rounded p-2"
                                        :icon-color="'text-gray-400 dark:text-gray-400'"
                                        :icon-name="'trash'"
                                        :title="'Delete'"
                                        @click="tbd = att"
                                    />
                                </div>
                            </td>
                        </tr>

                        <!-- SKELETON UNTUK LOAD MORE -->
                        <tr
                            v-if="isLoadingMore"
                            v-for="i in Math.ceil(skeletonCount / 2)"
                            :key="'skm-' + i"
                            class="table-row-custom"
                        >
                            <td class="table-cell-custom" colspan="10">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="h-4 w-4 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"
                                    ></div>
                                    <div
                                        class="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                                    ></div>
                                </div>
                            </td>
                        </tr>
                    </template>
                </template>
            </TableComponent>
            <div
                v-if="isLoading || isLoadingMore"
                class="text-xs text-gray-500"
            >
                Loading{{ dots }}
            </div>
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
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { container } from "@/container/di";
import { TOKENS } from "@/container/tokens";
import { DomainAttendance } from "@/domain/models/Attendance";
import type { Attendance as AttendanceAttributes } from "@/domain/types/AttendanceAttributes";
import DateInput from "@/core/components/input/Date.input.vue";
import AttendanceEditModal from "./AttendanceEdit.modal.vue";
import AttendanceSummaryModal from "./AttendanceSummary.modal.vue";
import Toast from "@/core/components/Toast.vue";
import { ToastUI } from "@/core/ui/Toast.ui";
import ImportButtonComponent from "@/core/components/button/ImportButton.component.vue";
import { getStatusClass } from "@/core/utils/StatusClass";
import AttendanceLogsModal from "./AttendanceLogs.modal.vue";
import { handleErrors } from "@/core/ui/UIError";
import ConfirmModal from "@/core/components/modal/Confirm.modal.vue";
import CheckBox from "@/core/components/CheckBox.vue";
type ImportPayload = { rawFiles: File[] };

type SseEnvelope = {
    event?: string;
    data?: string;
    id?: string;
    retry?: string;
};

const verifyStreamConfig = {
    inactivityMs: 10_000,
    timeoutToast: {
        message:
            "Streaming dihentikan karena tidak ada data baru selama 10 detik",
        type: "warning" as const,
        duration: 4000,
    },
};

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
const alerts = ref<ToastUI | null>(null);
const tbd = ref<DomainAttendance | null>(null);
const deleting = ref<boolean>(false)

const isImporting = ref(false);
const importMessages = ref<string[]>([]);
const activeImportController = ref<AbortController | null>(null);
const selectionsAtt = ref<DomainAttendance[]>([]);

const tbe = ref<DomainAttendance | null>(null);
const selectedSummary = ref<string | null>(null);
const log = ref<DomainAttendance | null>(null);

const isLoading = ref(false);
const isLoadingMore = ref(false);
const skeletonCount = 10;

const selectedAttendanceIds = ref<Set<string>>(new Set<string>());
const multiEditQueue = ref<DomainAttendance[]>([]);
const multiEditActive = ref(false);
const shouldAdvanceMultiEdit = ref(false);
const displayedAttendances = computed(() => {
    const targetDate =
        date.value instanceof Date ? new Date(date.value) : new Date();
    const targetDay = targetDate.toDateString();

    return attendanceList.value.filter(
        (attendance) => attendance.date.toDateString() === targetDay,
    );
});

const allSelected = computed(
    () =>
        displayedAttendances.value.length > 0 &&
        displayedAttendances.value.every((attendance) =>
            selectedAttendanceIds.value.has(attendance.uuid),
        ),
);

function clearSelection() {
    if (selectedAttendanceIds.value.size === 0) return;
    selectedAttendanceIds.value = new Set<string>();
}

function toggleSelectAll(checked: boolean) {
    const nextSelection = new Set(selectedAttendanceIds.value);
    if (checked) {
        displayedAttendances.value.forEach((attendance) =>
            nextSelection.add(attendance.uuid),
        );
    } else {
        displayedAttendances.value.forEach((attendance) =>
            nextSelection.delete(attendance.uuid),
        );
    }
    selectedAttendanceIds.value = nextSelection;
}

function toggleAttendanceSelection(
    attendance: DomainAttendance,
    checked: boolean,
) {
    const nextSelection = new Set(selectedAttendanceIds.value);
    if (checked) {
        nextSelection.add(attendance.uuid);
    } else {
        nextSelection.delete(attendance.uuid);
    }
    selectedAttendanceIds.value = nextSelection;
}

function getSelectedAttendances(): DomainAttendance[] {
    if (selectedAttendanceIds.value.size === 0) {
        return [];
    }

    return attendanceList.value.filter((attendance) =>
        selectedAttendanceIds.value.has(attendance.uuid),
    );
}

function resetMultiEditState() {
    multiEditQueue.value = [];
    multiEditActive.value = false;
    shouldAdvanceMultiEdit.value = false;
}

function startMultiEdit() {
    if (multiEditActive.value) return;
    const selections = getSelectedAttendances();
    if (selections.length === 0) {
        return;
    }
    selectionsAtt.value = selections;
    const [first, ...rest] = selections;
    multiEditQueue.value = rest;
    multiEditActive.value = true;
    shouldAdvanceMultiEdit.value = false;
    tbe.value = first;
}

function handleAttendanceSave(updated: DomainAttendance) {
    const index = attendanceList.value.findIndex(
        (attendance) => attendance.uuid === updated.uuid,
    );
    if (index !== -1) {
        attendanceList.value.splice(index, 1, updated);
    }

    if (multiEditActive.value && multiEditQueue.value.length > 0) {
        shouldAdvanceMultiEdit.value = true;
        return;
    }

    shouldAdvanceMultiEdit.value = false;
}

function handleAttendanceClose() {
    if (multiEditActive.value && shouldAdvanceMultiEdit.value) {
        shouldAdvanceMultiEdit.value = false;
        const [next, ...rest] = multiEditQueue.value;
        multiEditQueue.value = rest;
        if (next) {
            nextTick(() => {
                tbe.value = next;
            });
            return;
        }
    }

    if (multiEditActive.value) {
        resetMultiEditState();
        clearSelection();
    }

    selectionsAtt.value = [];
}

function handleAttendanceAlert(alert: ToastUI) {
    alerts.value = alert;
    if (alert.type === "success") {
        getList();
    }
}

function openAttendanceEditor(attendance: DomainAttendance) {
    resetMultiEditState();
    selectionsAtt.value = [attendance];
}

watch(
    attendanceList,
    (list) => {
        if (selectedAttendanceIds.value.size === 0) return;
        const available = new Set(list.map((attendance) => attendance.uuid));
        const nextSelection = new Set<string>();
        selectedAttendanceIds.value.forEach((uuid) => {
            if (available.has(uuid)) {
                nextSelection.add(uuid);
            }
        });
        if (nextSelection.size !== selectedAttendanceIds.value.size) {
            selectedAttendanceIds.value = nextSelection;
        }
    },
    { deep: true },
);

function deselectAttendance(uuid?: string) {
    if (!uuid || !selectedAttendanceIds.value.has(uuid)) return;
    const nextSelection = new Set(selectedAttendanceIds.value);
    nextSelection.delete(uuid);
    selectedAttendanceIds.value = nextSelection;
}

// --- Progressive reveal config ---
const rowDelayMs = 60; // jeda antar row (ms) -> atur selera (30-120ms)
const rowsPerTick = 1; // berapa row ditambahkan tiap tick
let revealTimer: number | null = null;
let revealGen = 0; // untuk membatalkan reveal lama bila ada fetch baru

function cancelReveal() {
    if (revealTimer) {
        clearInterval(revealTimer);
        revealTimer = null;
    }
}

async function deleteAttendance() {
    if (!tbd.value) {
        return;
    }
    const targetUuid = tbd.value.uuid;
    try {
        deleting.value = true;
        await repository.delete(tbd.value.uuid);
        alerts.value = new ToastUI("Successfully deleted", "success", 1500);
        deselectAttendance(targetUuid);
        multiEditQueue.value = multiEditQueue.value.filter(
            (attendance) => attendance.uuid !== targetUuid,
        );
        attendanceList.value = attendanceList.value.filter(
            (attendance) => attendance.uuid !== targetUuid,
        );
        tbd.value = null;
    } catch (error) {
        const err = handleErrors(error);
        alerts.value = new ToastUI(err.message, "error", 1500);
    } finally {
        deleting.value = false;
    }
}

// Push baris satu-per-satu ke attendanceList
function revealRows(
    newItems: DomainAttendance[],
    opts: { reset?: boolean } = {},
) {
    const { reset = false } = opts;
    revealGen++;
    const myGen = revealGen;

    cancelReveal();
    if (reset) attendanceList.value = [];

    let i = 0;
    revealTimer = window.setInterval(() => {
        // jika ada fetch baru, hentikan loop lama
        if (myGen !== revealGen) {
            cancelReveal();
            return;
        }

        for (let k = 0; k < rowsPerTick && i < newItems.length; k++) {
            attendanceList.value.push(newItems[i++]);
        }
        if (i >= newItems.length) cancelReveal();
    }, rowDelayMs);
}

// helper: paksa minimal durasi (timeout) agar skeleton sempat terlihat
function minDelay<T>(promise: Promise<T>, ms = 2000): Promise<T> {
    return Promise.all([promise, new Promise((r) => setTimeout(r, ms))]).then(
        ([result]) => result,
    );
}

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
    isLoading.value = true;
    cancelReveal(); // batalkan reveal lama jika ada
    resetMultiEditState();
    clearSelection();

    try {
        date.value instanceof Date && date.value.setHours(0, 0, 0, 0);

        const fetcher = repository.getAttendanceList({
            search: search.value,
            cursor: undefined, // reset saat search/date berubah
            date:
                date.value instanceof Date
                    ? date.value.getTime().toString()
                    : undefined,
        });

        const [result, nextCursor] = await minDelay(fetcher, 1000);
        cursor.value = nextCursor;

        // MATIKAN skeleton dulu, baru tampilkan row satu per satu
        isLoading.value = false;
        revealRows(result, { reset: true });
    } catch (e) {
        isLoading.value = false;
        attendanceList.value = [];
        throw e;
    }
}

async function getListWithCursor() {
    if (!cursor.value || isLoadingMore.value) return;
    isLoadingMore.value = true;

    try {
        const fetcher = repository.getAttendanceList({
            cursor: cursor.value,
            date:
                date.value instanceof Date
                    ? date.value.getTime().toString()
                    : undefined,
        });

        const [result, nextCursor] = await minDelay(fetcher, 1000);
        cursor.value = nextCursor;

        // Tambahkan juga secara bertahap (append)
        revealRows(result, { reset: false });
    } finally {
        isLoadingMore.value = false;
    }
}

const dots = ref(".");
let dotsTimer: number | undefined;

function parseSseChunk(chunk: string): SseEnvelope | null {
    const trimmed = chunk.trim();
    if (!trimmed) return null;

    const envelope: SseEnvelope = {};
    trimmed.split("\n").forEach((line) => {
        if (!line || line.startsWith(":")) return;
        const colon = line.indexOf(":");
        const field = colon === -1 ? line : line.slice(0, colon);
        const valueRaw = colon === -1 ? "" : line.slice(colon + 1);
        const value = valueRaw.startsWith(" ") ? valueRaw.slice(1) : valueRaw;

        switch (field) {
            case "event":
                envelope.event = value;
                break;
            case "data":
                envelope.data = envelope.data
                    ? `${envelope.data}\n${value}`
                    : value;
                break;
            case "id":
                envelope.id = value;
                break;
            case "retry":
                envelope.retry = value;
                break;
        }
    });
    return envelope;
}

function resolveStreamPayload(raw: string): unknown {
    let current: unknown = raw;

    for (let depth = 0; depth < 3; depth += 1) {
        if (typeof current !== "string") {
            break;
        }

        const trimmed = current.trim();
        if (!trimmed) {
            return trimmed;
        }

        try {
            const parsed = JSON.parse(trimmed);
            if (parsed === current) {
                break;
            }
            current = parsed;
        } catch {
            break;
        }
    }

    return current;
}

type ConsumeVerifyStreamOptions = {
    inactivityMs?: number;
    onTimeout?: () => void;
};

async function consumeVerifyStream(
    stream: ReadableStream<Uint8Array>,
    onEvent: (evt: SseEnvelope) => void,
    {
        inactivityMs = verifyStreamConfig.inactivityMs,
        onTimeout,
    }: ConsumeVerifyStreamOptions = {},
) {
    const reader = stream.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    let inactivityTimer: number | null = null;

    const clearTimer = () => {
        if (inactivityTimer !== null) {
            clearTimeout(inactivityTimer);
            inactivityTimer = null;
        }
    };

    const armTimer = () => {
        clearTimer();
        if (inactivityMs && inactivityMs > 0) {
            inactivityTimer = window.setTimeout(() => {
                clearTimer();
                void reader.cancel("verify-stream-timeout");
                onTimeout?.();
            }, inactivityMs);
        }
    };

    armTimer();

    while (true) {
        const { value, done } = await reader.read();
        clearTimer();

        if (done) {
            if (buffer.trim()) {
                buffer = buffer.replace(/\r\n/g, "\n");
                buffer.split("\n\n").forEach((chunk) => {
                    const evt = parseSseChunk(chunk);
                    evt && onEvent(evt);
                });
            }
            break;
        }

        buffer += decoder.decode(value, { stream: true });
        buffer = buffer.replace(/\r\n/g, "\n");

        let boundary: number;
        while ((boundary = buffer.indexOf("\n\n")) !== -1) {
            const chunk = buffer.slice(0, boundary);
            buffer = buffer.slice(boundary + 2);
            const evt = parseSseChunk(chunk);
            evt && onEvent(evt);
        }

        armTimer();
    }

    clearTimer();
}

async function onVerifyAttendanceImport({ rawFiles }: ImportPayload) {
    if (!rawFiles.length) return;
    const file = rawFiles[0];

    // batalkan proses sebelumnya bila user memilih file baru

    isImporting.value = true;
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await repository.verifyAttendance(file);

        if (!response.ok || !response.body) {
            throw new Error(`Verify gagal (status ${response.status})`);
        }

        getAttendanceWithSse();
    } catch (error) {
        if ((error as DOMException).name === "AbortError") return;
        console.error("Verify attendance error", error);
        alerts.value = new ToastUI(
            "Gagal memverifikasi presensi",
            "error",
            3000,
        );
    } finally {
        activeImportController.value = null;
    }
}

async function getAttendanceWithSse() {
    activeImportController.value?.abort();

    const controller = new AbortController();
    activeImportController.value = controller;
    importMessages.value = [];
    isImporting.value = true;
    try {
        const response = await repository.getAttendanceSse();

        if (!response.ok || !response.body) {
            throw new Error(`Verify gagal (status ${response.status})`);
        }
        let streamTimedOut = false;
        await consumeVerifyStream(
            response.body,
            (evt) => {
                if (!evt?.data) {
                    if (evt?.event === "end") {
                        alerts.value = new ToastUI(
                            "Verifikasi selesai",
                            "success",
                            2500,
                        );
                    }
                    return;
                }

                const payload = resolveStreamPayload(evt.data);

                if (
                    payload &&
                    typeof payload === "object" &&
                    !Array.isArray(payload)
                ) {
                    const record = payload as Record<string, unknown>;
                    const rawAttendance = record.data;

                    if (rawAttendance && typeof rawAttendance === "object") {
                        const fresh = new DomainAttendance(
                            rawAttendance as AttendanceAttributes,
                        );
                        const index = attendanceList.value.findIndex(
                            (a) => a.uuid === fresh.uuid,
                        );

                        if (index === -1) {
                            attendanceList.value.unshift(fresh);
                        } else {
                            const current = attendanceList.value[index];
                            const merged = new DomainAttendance({
                                ...current,
                                ...fresh,
                                actual_check_in:
                                    fresh.actual_check_in ??
                                    current.actual_check_in,
                                actual_check_out:
                                    fresh.actual_check_out ??
                                    current.actual_check_out,
                                status: fresh.status ?? current.status,
                                updated_at:
                                    fresh.updated_at ?? current.updated_at,
                                date: fresh.date.getTime() ?? current.date,
                            } as AttendanceAttributes);

                            attendanceList.value.splice(index, 1, merged);
                        }
                    }

                    if (
                        record.message !== undefined &&
                        record.message !== null
                    ) {
                        const message = String(record.message).trim();
                        message && importMessages.value.push(message);
                    }
                } else if (payload !== undefined && payload !== null) {
                    const fallbackMessage = String(payload).trim();
                    fallbackMessage &&
                        importMessages.value.push(fallbackMessage);
                }

                if (evt.event === "end") {
                    alerts.value = new ToastUI(
                        "Verifikasi selesai",
                        "success",
                        2500,
                    );
                }
            },
            {
                inactivityMs: verifyStreamConfig.inactivityMs,
                onTimeout: () => {
                    if (streamTimedOut) return;
                    streamTimedOut = true;
                    alerts.value = new ToastUI(
                        verifyStreamConfig.timeoutToast.message,
                        verifyStreamConfig.timeoutToast.type,
                        verifyStreamConfig.timeoutToast.duration,
                    );
                    controller.abort();
                },
            },
        );
    } catch (error) {
        if ((error as DOMException).name === "AbortError") return;
        console.error("Verify attendance error", error);
        alerts.value = new ToastUI(
            "Gagal memverifikasi presensi",
            "error",
            3000,
        );
    } finally {
        isImporting.value = false;
        activeImportController.value = null;
    }
}
onBeforeUnmount(() => {
    dotsTimer && clearInterval(dotsTimer);
});

onBeforeUnmount(() => {
    dotsTimer && clearInterval(dotsTimer);
    cancelReveal();
    activeImportController.value?.abort();
});

onMounted(() => {
    getList();
});

onBeforeUnmount(() => {
    dotsTimer && clearInterval(dotsTimer);
    cancelReveal();
});
</script>

<style scoped>
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(4px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
.tr-appear {
    animation: fadeInUp 0.22s ease-out both;
}
</style>
