<template>
  <div class="w-full min-h-0 flex flex-col px-14 bg-gray-50 dark:bg-gray-900">
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
    <div class="w-full flex flex-row py-3 mt-3">
      <span class="text-2xl font-semibold dark:text-gray-200">Attendance</span>
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
            <span class="font-extrabold text-blue-800 dark:text-blue-500"
              >150</span
            >
          </div>
          <span class="text-sm font-medium dark:text-gray-400">{{
            value.summaryType
          }}</span>
          <div class="flex flex-row items-center flex-wrap gap-2">
            <div
              v-for="summary in value.data"
              class="flex flex-row items-center gap-1 border border-gray-100 dark:border-gray-700 py-1 px-2 rounded-md"
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
      class="py-5 rounded-lg flex flex-col gap-3 bg-white dark:bg-gray-800 mt-4 px-5 mb-3"
    >
      <span class="dark:text-gray-200">List Attendance</span>
      <div class="w-full flex flex-row">
        <div class="w-1/5">
          <TextInput :value="''" :placeholder="'Search employee'" />
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
        </div>
      </div>
      <TableComponent :empty="false">
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
              WorkHours
            </th>
            <th
              class="table-header-custom text-start font-normal dark:text-gray-400"
            >
              Department
            </th>
            <th class="table-header-custom"></th>
          </tr>
        </template>
        <template #table-body>
          <tr
            class="table-row-custom"
            v-for="att in attendanceList"
            :key="att.name"
          >
            <td class="table-cell-custom text-gray-700 dark:text-gray-300">
              {{ att.name }}
            </td>
            <td class="table-cell-custom text-gray-700 dark:text-gray-300">
              {{ att.clockIn }}
            </td>
            <td class="table-cell-custom text-gray-700 dark:text-gray-300">
              {{ att.clockOut }}
            </td>
            <td class="table-cell-custom text-gray-700 dark:text-gray-300">
              {{ att.overTime }}
            </td>
            <td class="table-cell-custom text-gray-700 dark:text-gray-300">
              {{ att.workHour }}
            </td>
            <td class="table-cell-custom text-gray-700 dark:text-gray-300">
              {{ att.department }}
            </td>
            <td class="table-cell-custom">
              <div class="flex flex-row gap-2">
                <IconButton
                  @click="selectedAttendance = att"
                  :icon-name="'eye'"
                />
                <IconButton :icon-name="'pencil'" />
                <IconButton :icon-name="'trash'" />
              </div>
            </td>
          </tr>
        </template>
      </TableComponent>
    </div>
  </div>
</template>

<script setup lang="ts">
import TextInput from "@/components/input/Text.input.vue";
import TableComponent from "@/components/table/Table.component.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import attendance from "../dummy/attendance.json";
import IconButton from "@/components/button/Icon.button.vue";
import ButtonComponent from "@/components/button/Button.component.vue";
import ModalContent from "@/components/modal/Modal.content.vue";
import { ref } from "vue";
import { DropdownLabel } from "@/components/models/DropdownLabel";

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

const attendanceList: typeof attendance = attendance;

const selectedAttendance = ref<(typeof attendance)[0] | null>(null);
</script>

<style scoped></style>
