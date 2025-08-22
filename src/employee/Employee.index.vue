<template>
  <div class="w-full min-h-0 flex flex-col px-14 bg-gray-50 dark:bg-gray-900">
    <div class="w-full flex flex-row py-3 mt-3">
      <span class="text-2xl font-semibold dark:text-gray-200">Employee</span>
    </div>
    <!-- <div class="mb-4">
      <div class="w-full flex flex-row gap-5">
        <div
          class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 py-3 px-4 rounded-md flex flex-col gap-2"
        >
          <div class="flex flex-row items-center gap-2">
            <font-awesome-icon
              class="text-blue-700 dark:text-blue-500"
              icon="fa-solid fa-user-group"
            />
            <span class="font-extrabold text-blue-800 dark:text-blue-500"
              >150</span
            >
          </div>
          <span class="text-sm font-medium dark:text-gray-400">Employee</span>
          <div class="flex flex-row items-center flex-wrap gap-2">
            <div
              class="flex flex-row items-center gap-1 border border-gray-100 dark:border-gray-700 py-1 px-2 rounded-md"
            >
              <span
                class="text-xs font-semibold text-green-600 dark:text-green-400"
              >
                Present
              </span>
              <span
                class="text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                50
              </span>
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <div
      class="py-5 rounded-lg flex flex-col gap-3 bg-white dark:bg-gray-800 mt-4 px-5 mb-3"
    >
      <span class="dark:text-gray-200">List Employee</span>
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
          <ButtonComponent
            @click="$router.push({ name: 'EmployeeForm' })"
            class="text-sm"
            :variant="'primary'"
            >Add Employee</ButtonComponent
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
              Branch
            </th>
            <th
              class="table-header-custom text-start font-normal dark:text-gray-400"
            >
              Organazation
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
              Employment Status
            </th>
            <th class="table-header-custom"></th>
          </tr>
        </template>
        <template #table-body>
          <tr
            class="table-row-custom"
            v-for="emp in employeeList"
            :key="emp.name"
          >
            <td class="table-cell-custom text-gray-700 dark:text-gray-300">
              <div class="flex flex-row gap-3 w-52 shrink-0">
                <div
                  class="rounded-full w-10 h-10 bg-gray-200 flex flex-row items-center justify-center"
                >
                  {{ emp.name.charAt(0) }}
                </div>
                <div class="flex flex-col gap-2">
                  <span class="font-semibold text-blue-500">{{
                    emp.name
                  }}</span>
                  <span>{{ emp.employee_id }}</span>
                </div>
              </div>
            </td>
            <td class="table-cell-custom text-gray-700 dark:text-gray-300">
              {{ emp.branch }}
            </td>
            <td class="table-cell-custom text-gray-700 dark:text-gray-300">
              {{ emp.organization }}
            </td>
            <td class="table-cell-custom text-gray-700 dark:text-gray-300">
              {{ emp.job_position }}
            </td>
            <td class="table-cell-custom text-gray-700 dark:text-gray-300">
              {{ emp.job_level }}
            </td>
            <td class="table-cell-custom text-gray-700 dark:text-gray-300">
              {{ emp.job_status }}
            </td>
            <td class="table-cell-custom">
              <div class="flex flex-row gap-2">
                <IconButton :icon-name="'eye'" />
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
import IconButton from "@/components/button/Icon.button.vue";
import ButtonComponent from "@/components/button/Button.component.vue";
import dataEmployee from "../dummy/employee.json";

const employeeList: typeof dataEmployee = dataEmployee;
</script>

<style scoped></style>
