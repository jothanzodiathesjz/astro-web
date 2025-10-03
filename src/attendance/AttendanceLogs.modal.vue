<template>
    <ModalContent
        :visible="attendance ? true : false"
        :header="'History Log'"
        :body-class="'w-[40rem] mt-10'"
        :position="'top'"
        @close="$emit('close')"
    >
        <div class="w-full h-[70vh] overflow-y-auto pr-2">
            <div
                v-if="attendance"
                class="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-900/40"
            >
                <div class="flex gap-3 flex-row justify-between items-start">
                    <div class="flex flex-col gap-1">
                        <span
                            class="text-base font-semibold text-gray-800 dark:text-gray-100"
                        >
                            {{ attendance.employee.full_name }}
                        </span>
                        <span
                            class="text-sm font-bold text-gray-500 dark:text-gray-400"
                        >
                            ID: {{ attendance.employee.employee_id }} · Shift:
                            {{ attendance.shift.name || "-" }}
                        </span>
                    </div>
                    <div class="sm:text-right flex flex-col gap-1">
                        <p
                            class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                        >
                            Tanggal Kehadiran
                        </p>
                        <p
                            class="text-sm font-medium text-gray-700 dark:text-gray-200"
                        >
                            {{
                                new Date(
                                    attendance.attendance_date,
                                ).toLocaleDateString("id-ID", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                })
                            }}
                        </p>
                        <span
                            :class="[
                                'inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors',
                                getStatusClass(attendance.status),
                            ]"
                        >
                            {{ formatStatus(attendance.status) }}
                        </span>
                    </div>
                </div>
            </div>

            <div
                v-if="isLoading"
                class="flex h-full min-h-[12rem] flex-col items-center justify-center gap-3 text-gray-500 dark:text-gray-300"
            >
                <font-awesome-icon
                    icon="fa-solid fa-spinner"
                    :spin-pulse="true"
                    class="text-lg text-blue-500"
                />
                <span class="text-sm">Memuat riwayat perubahan...</span>
            </div>

            <div
                v-else-if="!hasLogs"
                class="flex h-full min-h-[12rem] flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white/60 p-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-400"
            >
                <font-awesome-icon
                    icon="fa-regular fa-clock"
                    class="mb-3 text-2xl text-gray-300 dark:text-gray-600"
                />
                <p>Belum ada riwayat perubahan untuk data presensi ini.</p>
            </div>

            <div v-else class="space-y-4 pr-2">
                <div
                    v-for="(log, index) in sortedLogs"
                    :key="`${log.created_at}-${log.field}-${index}`"
                    class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800/70"
                >
                    <div
                        class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"
                    >
                        <div class="flex flex-col gap-1">
                            <span
                                class="text-sm font-semibold text-gray-800 dark:text-gray-100"
                            >
                                {{ formatFieldName(log.field) }}
                            </span>
                            <span
                                class="text-sm text-gray-500 dark:text-gray-400"
                            >
                                Modified by: {{ log.inserted_by || "-" }}
                            </span>
                        </div>
                        <span
                            class="text-xs font-medium text-gray-400 dark:text-gray-500"
                        >
                            {{ formatTimestamp(log.created_at) }}
                        </span>
                    </div>

                    <div class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div
                            class="rounded-md bg-gray-50 p-3 text-sm dark:bg-gray-900/40"
                        >
                            <p
                                class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                            >
                                Before
                            </p>
                            <p class="mt-1 text-gray-700 dark:text-gray-200">
                                {{ formatValue(log.old_value) }}
                            </p>
                        </div>
                        <div
                            class="rounded-md bg-blue-50 p-3 text-sm dark:bg-blue-900/40"
                        >
                            <p
                                class="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-200"
                            >
                                After
                            </p>
                            <p class="mt-1 text-gray-700 dark:text-gray-100">
                                {{ formatValue(log.new_value) }}
                            </p>
                        </div>
                    </div>

                    <p
                        v-if="log.notes && log.notes.trim().length"
                        class="mt-3 rounded-md bg-amber-50 p-3 text-sm text-amber-700 dark:bg-amber-900/30 dark:text-amber-200"
                    >
                        Catatan: {{ log.notes }}
                    </p>
                </div>
            </div>
        </div>
        <div
            class="w-full flex flex-row justify-end gap-3 border-t border-gray-200 pt-3"
        >
            <ButtonComponent :variant="'outline'" @click="$emit('close')">
                Cancel
            </ButtonComponent>
        </div>
    </ModalContent>
</template>

<script setup lang="ts">
import ModalContent from "@/core/components/modal/Modal.content.vue";
import ButtonComponent from "@/core/components/button/Button.component.vue";
import {
    DomainAttendanceLogs,
    type DomainAttendance,
} from "@/domain/models/Attendance";
import { container } from "@/container/di";
import { TOKENS } from "@/container/tokens";
import { ToastUI } from "@/core/ui/Toast.ui";
import { computed, ref, watch } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { formatStatus, getStatusClass } from "@/core/utils/StatusClass";

library.add(faSpinner, faClock);

const $props = defineProps<{
    attendance: DomainAttendance | null;
}>();

const $emit = defineEmits<{
    (e: "close"): void;
    (e: "save", updated: DomainAttendance): void;
    (e: "alert", alert: ToastUI): void;
}>();

const dataLogs = ref<DomainAttendanceLogs | null>(null);

const repository = container.get(TOKENS.attendanceRepository);
const isLoading = ref(false);
const attendance = computed(() => $props.attendance);

const sortedLogs = computed(() => {
    const logs = dataLogs.value?.logs ?? [];
    return [...logs].sort((a, b) => (b.created_at ?? 0) - (a.created_at ?? 0));
});

const hasLogs = computed(() => sortedLogs.value.length > 0);

const formatValue = (value?: string) => {
    if (!value) return "-";
    const trimmed = value.trim();
    return trimmed.length ? trimmed : "-";
};

const formatFieldName = (field: string) => {
    if (!field) return "Field";
    return field
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return "-";
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString("id-ID", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    });
};

async function getLogs() {
    if (!attendance.value) return;
    try {
        isLoading.value = true;
        dataLogs.value = await repository.getLogs(attendance.value.uuid);
    } catch (error) {
        console.log(error);
        $emit("alert", new ToastUI("Gagal memuat riwayat presensi.", "error"));
    } finally {
        isLoading.value = false;
    }
}

watch(
    () => attendance.value?.uuid,
    async (uuid) => {
        if (!uuid) {
            dataLogs.value = null;
            return;
        }

        await getLogs();
    },
    { immediate: true },
);
</script>

<style scoped></style>
