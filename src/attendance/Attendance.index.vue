<template>
    <div
        class="w-full h-full min-h-0 flex flex-col px-4 pb-6 dark:bg-gray-900 sm:px-6 lg:px-10 2xl:px-14"
    >
        <Toast
            :duration="vm.alerts?.duration"
            :message="vm.alerts?.message ?? ''"
            :show="vm.alerts ? true : false"
            @on-close="vm.alerts = null"
        />
        <ModalContent
            :visible="vm.selectedAttendance ? true : false"
            :header="'Detail Attendance'"
            :body-class="'w-full max-w-3xl'"
            @close="vm.selectedAttendance = null"
        >
            <span class="font-semibold dark:text-gray-200">{{
                vm.selectedAttendance
            }}</span>
        </ModalContent>
        <AttendanceSummaryModal
            :summary-type="vm.selectedSummary?.type ? vm.selectedSummary.type : null"
            :data="vm.summaryEmployeeList"
            :loading="vm.summaryLoading"
            :loading-more="vm.summaryLoadingMore"
            :total="vm.selectedSummary?.count"
            @close="[vm.selectedSummary = null, vm.summaryEmployeeList = []]"
            @paginate="() => vm.getEmployeeSummaryWithCursor()"
        />
        <AttendanceEditModal
            :visible="vm.selectionsAtt.length ? true : false"
            :selections="vm.selectionsAtt"
            @close="vm.handleAttendanceClose()"
            @save="(v) => vm.handleAttendanceSave(v)"
            @alert="(s) => vm.handleAttendanceAlert(s)"
        />
        <ConfirmModal
            :visible="vm.tbd ? true : false"
            :header="'Delete Attendance'"
            message="Are you sure you want to delete this attendance?"
            :icon="'fa-triangle-exclamation'"
            :disabled="vm.deleting"
            @confirm="vm.deleteAttendance()"
            @cancel="vm.tbd = null"
        />
        <AttendanceLogsModal :attendance="vm.log" @close="vm.log = null" />
        <ImportModal
        :model-value="vm.showImportPanel"
        title="Import File"
        :confirm-text="'Confirm'"
        :cancel-text="'Cancel'"
        :allowed-extensions="['.csv', '.xlsx', '.txt']"
        :loading="vm.isImporting"
        @cancel="vm.showImportPanel = false"
        @import="(v) => vm.onVerifyAttendanceImport({ rawFiles: v.files })"
        />
        <div class="w-full flex flex-row py-3 mt-3">
            <span class="text-lg font-semibold dark:text-gray-200"
                >Attendance</span
            >
        </div>
        <div class="mb-4">
            <div
                class="w-full flex flex-col gap-4 md:flex-row md:flex-wrap"
            >
                <div
                    v-for="value in vm.attendanceSummary"
                    :key="value.summaryType"
                    class="w-full sm:w-auto py-3 px-4 flex flex-col gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-700"
                >
                    <div class="flex flex-row items-center gap-2">
                        <font-awesome-icon
                            class="text-blue-700 dark:text-blue-500"
                            :icon="value.icon"
                        />
                        <span
                            class="font-extrabold text-blue-800 dark:text-blue-500"
                            >{{ value.total }}</span
                        >
                    </div>
                    <span class="text-sm font-medium dark:text-gray-400">{{
                        value.summaryType
                    }}</span>
                    <div class="flex flex-row items-center flex-wrap gap-2">
                        <div
                            v-for="summary in value.data"
                            :key="`${value.summaryType}-${summary.status}`"
                            class="cursor-pointer hover:bg-gray-100 flex flex-row items-center gap-1 border border-gray-100 dark:border-gray-700 py-1 px-2 rounded-md"
                            @click="[vm.setSelectedSummary(summary.statusLabel, summary.count), vm.getEmployeeSummary()]"
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
            <div
                class="w-full flex flex-col gap-3 lg:flex-row lg:items-center"
            >
                <div class="w-full sm:w-1/2 lg:w-1/4 lg:max-w-xs">
                    <DateInput
                        :model-value="vm.date"
                        :readonly="false"
                        placeholder="Select date"
                        :with-range="false"
                        :with-time="false"
                        @update:model-value="
                            (value) => {
                                value instanceof Date && (vm.date = value);
                                vm.getList();
                            }
                        "
                    />
                </div>
                <div class="flex flex-wrap gap-3 w-1/2">
                    <ButtonComponent
                        class="text-sm"
                        :variant="'outline'"
                        :icon-name="'fa-file-export'"
                        @click="vm.showImportPanel = true"
                        >Import</ButtonComponent
                    >
                    <ButtonComponent
                        class="text-sm"
                        :variant="'outline'"
                        :icon-name="'fa-file-export'"
                        >Export</ButtonComponent
                    >
                </div>
                <div
                    class="w-full flex flex-row gap-3 items-center"
                >
                    
                    <div
                        class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-4 w-full"
                    >
                    <div
                        v-if="vm.selectedAttendanceIds.size > 0"
                        class="flex flex-row items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
                    >
                        <span>{{ vm.selectedAttendanceIds.size }} selected</span>
                        <ButtonComponent
                            class="text-sm"
                            :variant="'outline'"
                            :icon-name="'fa-pen-to-square'"
                            @click="vm.startMultiEdit()"
                        >
                            Edit Selected
                        </ButtonComponent>
                    </div>
                        <IconButton
                            class="border border-gray-300 dark:border-gray-600 rounded-md p-2"
                            :icon-color="'text-gray-400 dark:text-gray-400'"
                            :icon-name="'refresh'"
                            @click="vm.getList()"
                        />
                        <div class="w-full sm:w-64 lg:w-72">
                            <TextInput
                                :value="vm.search"
                                :placeholder="'Search employee'"
                                :debounce="400"
                                :icon="{
                                    left: {
                                        name: 'fa-search',
                                    },
                                }"
                                @input="
                                    (v) => [
                                        (vm.search = v),
                                        vm.getList({ preserveSelection: true }),
                                    ]
                                "
                            />
                        </div>
                    </div>
                </div>
            </div>
            <TableComponent
                :empty="
                    !vm.isLoading &&
                    !vm.isLoadingMore &&
                    displayedAttendances.length === 0
                "
                @paginate="vm.getListWithCursor()"
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
                    <template v-if="vm.isLoading">
                        <tr
                            class="table-row-custom"
                            v-for="i in vm.skeletonCount"
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
                            :model-value="vm.selectedAttendanceIds.has(att.uuid)"
                            @update:model-value="
                                (checked) => vm.toggleAttendanceSelection(att, checked)
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
                                :class="{
                                    'text-red-500': att.is_early_leave,
                                }"
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
                                    {{ vm.formatStatus(att.status) }}
                                </span>
                            </td>
                            <td class="table-cell-custom">
                                <div class="flex flex-row gap-2">
                                    <IconButton
                                        class="border border-gray-300 dark:border-gray-600 rounded p-2"
                                        :icon-color="'text-gray-400 dark:text-gray-400'"
                                        :icon-name="'pencil'"
                                        :title="'Edit'"
                                        @click="vm.openAttendanceEditor(att)"
                                    />
                                    <IconButton
                                        :class="['border border-gray-300 dark:border-gray-600 rounded p-2', { 'opacity-50': !att.is_modify }]"
                                        :icon-color="'text-gray-400 dark:text-gray-400'"
                                        :icon-name="'clock-rotate-left'"
                                        :title="'History Log'"
                                        :disabled="!att.is_modify"
                                        @click="vm.log = att"
                                    />
                                    <IconButton
                                        class="border border-gray-300 dark:border-gray-600 rounded p-2"
                                        :icon-color="'text-gray-400 dark:text-gray-400'"
                                        :icon-name="'trash'"
                                        :title="'Delete'"
                                        @click="vm.tbd = att"
                                    />
                                </div>
                            </td>
                        </tr>

                        <!-- SKELETON UNTUK LOAD MORE -->
                        <tr
                            v-if="vm.isLoadingMore"
                            v-for="i in Math.ceil(vm.skeletonCount / 2)"
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
                v-if="vm.isLoading || vm.isLoadingMore"
                class="text-xs text-gray-500"
            >
                Loading{{ vm.dots }}
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
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { container } from "@/container/di";
import { TOKENS } from "@/container/tokens";
import DateInput from "@/core/components/input/Date.input.vue";
import AttendanceEditModal from "./AttendanceEdit.modal.vue";
import AttendanceSummaryModal from "./AttendanceSummary.modal.vue";
import Toast from "@/core/components/Toast.vue";
import { getStatusClass } from "@/core/utils/StatusClass";
import AttendanceLogsModal from "./AttendanceLogs.modal.vue";
import ConfirmModal from "@/core/components/modal/Confirm.modal.vue";
import CheckBox from "@/core/components/CheckBox.vue";
import ImportModal from "@/core/components/modal/Import.modal.vue";

const vm = ref(container.get(TOKENS.AttendanceViewModel));

const displayedAttendances = computed(() => {
    const targetDate =
        vm.value.date instanceof Date ? new Date(vm.value.date) : new Date();
    const targetDay = targetDate.toDateString();

    // return vm.value.attendanceList.filter(
    //     (attendance) => attendance.date.toDateString() === targetDay,
    // );
    return vm.value.attendanceList;
});

const allSelected = computed(
    () =>
        displayedAttendances.value.length > 0 &&
        displayedAttendances.value.every((attendance) =>
            vm.value.selectedAttendanceIds.has(attendance.uuid),
        ),
);

/**
 * Toggle the selection of all attendances in the displayed attendance list.
 * @param {boolean} checked - Whether to select or deselect all attendances.
 */
function toggleSelectAll(checked: boolean) {
    displayedAttendances.value.forEach((attendance) => {
        vm.value.toggleAttendanceSelection(attendance, checked);
    });
}


onBeforeUnmount(() => {
    vm.value.dotsTimer && clearInterval(vm.value.dotsTimer);
});

onBeforeUnmount(() => {
    vm.value.dotsTimer && clearInterval(vm.value.dotsTimer);
    vm.value.cancelReveal();
    vm.value.activeImportController?.abort();
});

onMounted(() => {
    vm.value.getTotals();
    vm.value.getList();
});

onBeforeUnmount(() => {
    vm.value.dotsTimer && clearInterval(vm.value.dotsTimer);
    vm.value.cancelReveal();
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
