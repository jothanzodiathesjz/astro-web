<template>
    <div class="w-full h-full min-h-0 flex flex-col px-14 dark:bg-gray-900">
        <div class="w-full flex flex-row py-3 mt-3">
            <span class="text-lg font-semibold dark:text-gray-200"
                >Calendar
            </span>
        </div>
        <div
            class="mb-4 w-full gap-3 flex flex-row bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-700"
        >
            <CalendarEventComponent />
            <div class="w-full border-l border-gray-200">
                <div
                    class="w-full flex flex-row gap-3 p-2 items-center border-b border-gray-200 text-gray-900 text-base"
                >
                    <div class="w-full text-center p-3">Event</div>
                    <div class="w-full text-center">Time Off</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import CalendarEventComponent from "./CalendarEvent.component.vue";
</script>

<style scoped></style>
