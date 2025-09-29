<template>
    <ModalContent
        :visible="visible"
        :header="'Preview Schedule'"
        :body-class="'w-[50rem] mt-10'"
        :position="'top'"
        @close="$emit('close')"
    >
        <div
            class="w-full flex flex-row items gap-3 border border-blue-200 dark:border-blue-500 py-3 px-4 rounded dark:text-gray-300"
        >
            <FontAwesomeIcon
                class="text-blue-700 dark:text-blue-500"
                :icon="['fa-solid', 'fa-circle-info']"
                :size="'xl'"
            />
            <span v-if="!efectiveDate"
                >Pilih Tanggal Efektif Untuk Melihat Jadwal</span
            >
            <span v-else
                >Ini adalah pratinjau berdasarkan tanggal efektif yang Anda
                pilih untuk jadwal ini.</span
            >
        </div>
        <div
            v-if="efectiveDate"
            class="w-full mt-3 flex flex-row overflow-auto pb-4"
        >
            <div
                v-for="(value, i) in schedules"
                class="w-56 shrink-0 border border-gray-200 dark:border-gray-700 flex flex-col gap-2"
            >
                <div
                    class="flex flex-row justify-between p-3 border-b border-gray-200 dark:border-gray-700 items-center"
                >
                    <span class="text-center text-sm dark:text-gray-300">{{
                        new Date(
                            (efectiveDate as Date).getTime() +
                                i * 24 * 60 * 60 * 1000,
                        ).toLocaleDateString("id-ID", {
                            weekday: "short", // Sat
                            day: "numeric", // 20
                            month: "short", // Sep
                        })
                    }}</span>
                    <font-awesome-icon
                        icon="fa-regular fa-calendar"
                        class="dark:text-gray-300"
                    />
                </div>
                <div class="p-1 flex justify-center flex-col">
                    <div
                        class="p-3 w-full text-sm text-start text-white flex flex-col dark:text-gray-300 bg-blue-500 rounded"
                    >
                        <span
                            >{{ value.shift?.schedule_in }} -
                            {{ value.shift?.schedule_out }}</span
                        >
                        <span class="text-xs">{{ value.shift?.name }}</span>
                    </div>
                </div>
            </div>
        </div>
    </ModalContent>
</template>

<script setup lang="ts">
import ModalContent from "@/core/components/modal/Modal.content.vue";
import type { DomainDaySchedule } from "@/domain/models/Schedule";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

defineProps<{
    visible: boolean;
    schedules: DomainDaySchedule[];
    efectiveDate: Date | Date[] | undefined;
}>();

defineEmits<{
    (e: "close"): void;
}>();
</script>
