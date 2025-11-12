<template>
    <div
        class="w-full h-full flex flex-col items-center px-14 dark:bg-gray-900 pb-6"
    >
        <Toast
            :duration="vm.alerts?.duration"
            :message="vm.alerts?.message ?? ''"
            :show="vm.alerts ? true : false"
            @on-close="vm.alerts = null"
        />
        <SchedulePreview
            :visible="vm.previewVisible"
            :schedules="vm.daySchedules"
            :efective-date="vm.effectiveDate"
            @close="vm.previewVisible = false"
        />
        <div class="w-[80%] flex flex-row items-center py-3 mt-3 gap-4">
            <ButtonComponent
                @click="$router.back()"
                :variant="'outline'"
                :icon-name="'fa-angle-left'"
                >Back</ButtonComponent
            >
            <div class="w-full flex flex-row gap-3 items-center">
                <span
                    @click="$router.back()"
                    class="font-semibold text-blue-600 dark:text-gray-200 cursor-pointer"
                    >Schedule</span
                >
                <IconButton :icon-name="'fa-angle-right'" />
                <span class="font-semibold text-gray-800 dark:text-gray-200"
                    >{{ vm.isUpdate ? "Detail" : "Form" }} Schedule</span
                >
            </div>
        </div>
        <!-- <div class="w-[80%] flex flex-row py-3 mt-3 gap-2">
            <span
                @click="$router.back()"
                class="font-semibold text-blue-600 dark:text-gray-200 cursor-pointer"
                >Schedule</span
            >
            <IconButton :icon-name="'fa-angle-right'" />
            <span class="font-semibold dark:text-gray-200"
                >{{ vm.isUpdate ? "Detail" : "Form" }} Schedule</span
            >
        </div> -->
        <div
            class="w-[80%] flex flex-col mt-5 px-8 py-3 gap-5 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-700"
        >
            <span class="font-semibold dark:text-gray-200">Add Schedule</span>
            <div class="w-full flex flex-row gap-4">
                <TextInput
                    :value="vm.data.name"
                    :placeholder="'Name'"
                    :label="'Name'"
                    :error="vm.formErrors.name"
                    :readonly="vm.isUpdate"
                    @input="
                        (value) => {
                            vm.data.name = value;
                            vm.clearFieldError('name');
                        }
                    "
                />

                <DateInput
                    label="Effective Date"
                    :model-value="vm.effectiveDate"
                    :readonly="vm.isUpdate"
                    placeholder="Effective Date"
                    :with-range="false"
                    :with-time="false"
                    :error="vm.formErrors.efectiveDate"
                    @update:model-value="
                        (value) => {
                            value instanceof Date && (vm.effectiveDate = value);
                            vm.clearFieldError('efectiveDate');
                        }
                    "
                    @clear="() => (vm.effectiveDate = undefined)"
                />
            </div>
            <div class="w-full flex flex-row gap-4">
                <TextInput
                    :value="vm.data.description"
                    :placeholder="'Description'"
                    :label="'Description'"
                    :error="vm.formErrors.description"
                    :readonly="vm.isUpdate"
                    @input="
                        (value) => [
                            (vm.data.description = value),
                            vm.clearFieldError('description'),
                        ]
                    "
                />
            </div>
            <div class="w-full flex flex-row justify-between items-center">
                <span class="font-semibold dark:text-gray-200"
                    >Set Shift Pattern</span
                >
                <ButtonComponent
                    :variant="'outline'"
                    :icon-name="'fa-calendar'"
                    @click="vm.previewVisible = true"
                    >Preview Schedule</ButtonComponent
                >
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
                            Shift
                        </th>
                        <th
                            class="table-header-custom text-start font-normal dark:text-gray-400"
                        >
                            Working Hours
                        </th>
                        <th
                            class="table-header-custom text-start font-normal dark:text-gray-400"
                        >
                            Break Hours
                        </th>

                        <th class="table-header-custom"></th>
                    </tr>
                </template>
                <template #table-body>
                    <tr
                        v-for="(day, index) in vm.daySchedules"
                        :key="index"
                        class="table-row-custom"
                    >
                        <td
                            class="table-cell-custom text-gray-700 dark:text-gray-300"
                        >
                            <span
                                class="border border-gray-300 rounded px-2 py-1 bg-purple-200 dark:bg-gray-700 dark:text-gray-300"
                                >Day {{ day.day }}</span
                            >
                        </td>
                        <td
                            class="table-cell-custom text-gray-700 dark:text-gray-300"
                        >
                            <div class="flex flex-col gap-1">
                                <ShiftDropdown
                                :selected="day.shift"
                                :with-clear="true"
                                @select="
                                    (value) => (day.shift = value)
                                "
                                @clear="day.shift = null"
                                />
                                <span
                                    class="text-xs text-red-500"
                                    v-if="!day.shift"
                                    >Shift is required</span
                                >
                            </div>
                        </td>

                        <td
                            class="table-cell-custom text-gray-700 dark:text-gray-300"
                        >
                            <div
                                v-if="day.shift"
                                class="flex flex-col gap-1 items-start"
                            >
                                <span
                                    >{{ day.shift?.schedule_in }} -
                                    {{ day.shift?.schedule_out }}</span
                                >
                                <span class="text-xs text-gray-500">{{
                                    calculateDuration(
                                        day.shift?.schedule_in,
                                        day.shift?.schedule_out,
                                    )
                                }}</span>
                            </div>
                            <span v-else>-</span>
                        </td>
                        <td
                            class="table-cell-custom text-gray-700 dark:text-gray-300"
                        >
                            <div
                                v-if="day.shift"
                                class="flex flex-col gap-1 items-start"
                            >
                                <span
                                    >{{ day.shift?.break_start }} -
                                    {{ day.shift?.break_end }}</span
                                >
                                <span class="text-xs text-gray-500">{{
                                    calculateDuration(
                                        day.shift?.break_start,
                                        day.shift?.break_end,
                                    )
                                }}</span>
                            </div>
                            <span v-else>-</span>
                        </td>
                        <td class="table-cell-custom">
                            <IconButton
                                :icon-name="'fa-trash'"
                                :size="'lg'"
                                @click="vm.removeDaySchedule(index)"
                            />
                        </td>
                    </tr>
                </template>
            </TableComponent>
            <div>
                <ButtonComponent
                    :variant="'outline'"
                    :icon-name="'fa-plus'"
                    @click="vm.addDaySchedule()"
                    >Add Day</ButtonComponent
                >
            </div>
            <div class="w-full flex flex-row justify-end">
                <ButtonComponent
                    v-if="!vm.isUpdate"
                    :disabled="vm.submiting"
                    :loading="vm.submiting"
                    @click="vm.save()"
                >
                    Save
                </ButtonComponent>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import IconButton from "@/core/components/button/Icon.button.vue";
import { onMounted, ref } from "vue";
import Toast from "@/core/components/Toast.vue";
import TextInput from "@/core/components/input/Text.input.vue";
import ButtonComponent from "@/core/components/button/Button.component.vue";
import DateInput from "@/core/components/input/Date.input.vue";
import TableComponent from "@/core/components/table/Table.component.vue";
import { container } from "@/container/di";
import { TOKENS } from "@/container/tokens";
import { calculateDuration } from "@/core/utils/CalculateDuration";
import SchedulePreview from "./SchedulePreview.vue";
import ShiftDropdown from "@/shift/Shift.dropdown.vue";
// import { useRoute } from "vue-router";

const vm = ref(container.get(TOKENS.ScheduleFormViewModel));

onMounted(() => {
    vm.value.initialize();
});
</script>

<style scoped></style>
