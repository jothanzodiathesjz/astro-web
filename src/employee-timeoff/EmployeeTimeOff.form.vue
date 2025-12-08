<template>
    <div
        class="w-full min-h-screen flex flex-col items-center pb-28 md:pb-32 bg-gray-50/60 dark:bg-gray-900 text-gray-800"
    >
        <div class="w-full max-w-6xl mx-auto px-4 lg:px-8 pt-6">
            <div class="flex items-center justify-between">
                <nav class="flex items-center gap-2 text-sm">
                    <ButtonComponent
                        @click="$router.back()"
                        :variant="'outline'"
                        :icon-name="'fa-angle-left'"
                        >Back</ButtonComponent
                    >
                    <span class="text-gray-400">/</span>
                    <button
                        @click="$router.back()"
                        class="text-blue-600 dark:text-gray-200 hover:underline"
                    >
                        Time Off Employee
                    </button>
                    <span class="text-gray-400">/</span>
                    <span class="font-semibold dark:text-gray-200"
                        >{{ "Form" }} Set Time Off</span
                    >
                </nav>
            </div>
        </div>
        <!-- Toast -->
        <Toast
            :duration="alerts?.duration"
            :message="alerts?.message ?? ''"
            :type="alerts?.type"
            :show="Boolean(alerts)"
            @on-close="alerts = null"
        />
        <div class="w-full max-w-6xl mx-auto px-4 lg:px-8 pt-6">
            <div class="flex flex-col gap-1">
                <span
                    class="text-2xl font-semibold text-gray-900 dark:text-gray-100"
                    >Set Time Off</span
                >
                <span class="text-sm text-gray-500 dark:text-gray-400"
                    >Kelola karyawan yang mengambil cuti dan tentukan
                    tanggalnya.</span
                >
            </div>
        </div>
        <div class="w-full max-w-6xl mx-auto px-4 lg:px-8 mt-4">
            <div
                class="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-700"
            >
                <div
                    class="border-b border-gray-100 dark:border-gray-700 px-6 py-4"
                >
                    <span
                        class="text-base font-medium text-gray-800 dark:text-gray-200"
                        >Detail Pengajuan</span
                    >
                </div>
                <div class="w-full flex flex-col gap-6 p-6">
                    <div class="grid gap-6 lg:grid-cols-1">
                        <EmployeeDropdown
                            :selected="selectedEmployee"
                            label="Employee"
                            placeholder="Cari employee"
                            @select="
                                (employee) => (selectedEmployee = employee)
                            "
                            @clear="selectedEmployee = null"
                        />
                        <div
                            class="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 p-4 min-h-[120px] bg-gray-50/70 dark:bg-gray-900/50 flex flex-col justify-center gap-2"
                        >
                            <template v-if="selectedEmployee">
                                <div class="w-full flex flex-row items-center">
                                    <div class="w-full flex flex-col gap-2">
                                        <span
                                            class="text-xs uppercase tracking-wider text-gray-500"
                                            >Selected Employee</span
                                        >
                                        <span
                                            class="text-lg font-semibold text-gray-900 dark:text-gray-100"
                                            >{{
                                                selectedEmployee.full_name
                                            }}</span
                                        >
                                        <span
                                            class="text-sm text-gray-500 dark:text-gray-400"
                                            >ID:
                                            {{
                                                selectedEmployee.employee_id
                                            }}</span
                                        >
                                        <span
                                            v-if="
                                                selectedEmployee.employment
                                                    ?.department?.name ||
                                                selectedEmployee.employment
                                                    ?.job_title
                                            "
                                            class="text-sm text-gray-500 dark:text-gray-400"
                                        >
                                            {{
                                                selectedEmployee.employment
                                                    ?.department?.name ||
                                                "No Department"
                                            }}
                                            <span
                                                v-if="
                                                    selectedEmployee.employment
                                                        ?.job_title
                                                "
                                            >
                                                -
                                                {{
                                                    selectedEmployee.employment
                                                        ?.job_title
                                                }}
                                            </span>
                                        </span>
                                    </div>
                                    <IconButton
                                        class=""
                                        :icon-color="'text-gray-400 dark:text-gray-400'"
                                        :icon-name="'fa-trash'"
                                        @click="selectedEmployee = null"
                                    />
                                </div>
                            </template>
                            <template v-else>
                                <span
                                    class="text-sm text-gray-500 dark:text-gray-400"
                                    >Pilih employee terlebih dahulu untuk
                                    melihat detail.</span
                                >
                            </template>
                        </div>
                    </div>
                    <TimeOffDropdown
                        :selected="selectedTimeOff"
                        @select="(timeOff) => (selectedTimeOff = timeOff)"
                        @clear="selectedTimeOff = null"
                    />
                    <MultiDateInput
                        v-model="selectedDates"
                        label="Pilih Tanggal"
                        :withTime="false"
                        :maxSelectable="10"
                        :minDate="new Date()"
                        placeholder="Pilih beberapa tanggal"
                        @clear="selectedDates = []"
                    />
                </div>
                <div
                    class="w-full flex flex-col gap-3 border-t border-gray-100 dark:border-gray-700 px-6 py-4 md:flex-row md:items-center md:justify-between"
                >
                    <span class="text-sm text-gray-500 dark:text-gray-400"
                        >Pastikan seluruh data sudah benar sebelum
                        menyimpan.</span
                    >
                    <div class="flex flex-row gap-3 justify-end">
                        <ButtonComponent
                            :variant="'outline'"
                            @click="resetForm"
                        >
                            Reset
                        </ButtonComponent>
                        <ButtonComponent
                            :variant="'primary'"
                            :loading="submiting"
                            :disabled="disabled"
                            @click="submit()"
                        >
                            Save
                        </ButtonComponent>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import ButtonComponent from "@/core/components/button/Button.component.vue";
import MultiDateInput from "@/core/components/input/MultiDate.input.vue";
import EmployeeDropdown from "@/employee/Employee.dropdown.vue";
import type { DomainEmployee } from "@/domain/models/Employee";
import {
    EmployeeTimeOffToData,
    type DomainTimeOff,
} from "@/domain/models/TimeOff";
import TimeOffDropdown from "@/settings/time/TimeOff.dropdown.vue";
import { computed, ref } from "vue";
import { container } from "@/container/di";
import { TOKENS } from "@/container/tokens";
import IconButton from "@/core/components/button/Icon.button.vue";
import { ToastUI } from "@/core/ui/Toast.ui";
import { handleErrors } from "@/core/ui/UIError";
import Toast from "@/core/components/Toast.vue";

const repository = container.get(TOKENS.TimeOffRepository);

const selectedEmployee = ref<DomainEmployee | null>(null);
const selectedDates = ref<Date[]>([]);
const selectedTimeOff = ref<DomainTimeOff | null>(null);
const submiting = ref(false);
const alerts = ref<ToastUI | null>(null);

const disabled = computed(() => {
    return (
        submiting.value ||
        selectedDates.value.length === 0 ||
        !selectedTimeOff.value ||
        !selectedEmployee.value
    );
});

async function submit() {
    if (disabled.value) return;
    submiting.value = true;
    try {
        if (selectedEmployee.value && selectedTimeOff.value) {
            const data = new EmployeeTimeOffToData(
                selectedDates.value.map((date) => date.getTime()),
                selectedEmployee.value.uuid,
                selectedTimeOff.value,
            );

            await repository.createEmployeeTimeOff(data);
            alerts.value = new ToastUI("Successfully created", "success", 1500);
            resetForm();
        } else {
            throw new Error("Data belum lengkap");
        }
    } catch (error) {
        const err = handleErrors(error);
        alerts.value = new ToastUI(err.message, "error", 2000);
    } finally {
        submiting.value = false;
    }
}

function resetForm() {
    selectedDates.value = [];
    selectedTimeOff.value = null;
    selectedEmployee.value = null;
}
</script>

<style scoped></style>
