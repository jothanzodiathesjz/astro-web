<template>
    <div
        class="w-full min-h-0 flex flex-col px-4 pb-6 dark:bg-gray-900 sm:px-6 lg:px-10 2xl:px-14"
    >
        <span class="text-lg font-semibold dark:text-gray-200 mt-6"
            >Dashboard</span
        >
        <div class="w-full flex flex-col gap-4 mt-4 md:flex-row md:flex-wrap">
            <div
                class="p-4 w-full md:w-1/2 xl:w-1/3 2xl:w-1/4 bg-white dark:bg-gray-800 flex flex-col gap-5 rounded shadow-sm"
            >
                <div class="flex flex-row justify-between items-center">
                    <span class="text-sm font-semibold dark:text-gray-200"
                        >Total Employee</span
                    >
                    <span class="text-lg font-semibold dark:text-gray-200"
                        >150</span
                    >
                </div>
                <div
                    class="rounded-full border-[30px] border-red-500 w-36 h-36 mx-auto"
                ></div>
                <div
                    class="w-full flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-10"
                >
                    <div
                        class="w-32 text-sm justify-center border border-gray-300 dark:border-gray-500 p-1 rounded flex flex-row items-center gap-2"
                    >
                        <span class="bg-red-500 w-3 h-3 rounded-full"></span>
                        <span class="dark:text-gray-300">Male</span>
                    </div>
                    <div
                        class="w-32 text-sm justify-center border border-gray-300 dark:border-gray-500 p-1 rounded flex flex-row items-center gap-2"
                    >
                        <span class="bg-purple-500 w-3 h-3 rounded-full"></span>
                        <span class="dark:text-gray-300">Male</span>
                    </div>
                </div>
                <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div class="flex flex-col gap-2 items-center text-sm">
                        <span class="dark:text-gray-300">Staff</span>
                        <span class="dark:text-gray-300">50</span>
                    </div>
                    <div class="flex flex-col gap-2 items-center text-sm">
                        <span class="dark:text-gray-300">Produksi</span>
                        <span class="dark:text-gray-300">50</span>
                    </div>
                    <div class="flex flex-col gap-2 items-center text-sm">
                        <span class="dark:text-gray-300">Harles</span>
                        <span class="dark:text-gray-300">50</span>
                    </div>
                </div>
            </div>
            <div
                class="p-4 w-full md:w-1/2 xl:w-1/3 2xl:w-1/4 bg-white dark:bg-gray-800 flex flex-col gap-5 rounded shadow-sm"
            >
                <div class="flex flex-row justify-between items-center">
                    <span class="text-sm font-semibold dark:text-gray-200"
                        >Total Employee</span
                    >
                    <span class="text-lg font-semibold dark:text-gray-200"
                        >150</span
                    >
                </div>
                <DonutChart :percentage="50" />
                <div
                    class="w-full flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-10"
                >
                    <div
                        class="w-32 text-sm justify-center border border-gray-300 dark:border-gray-500 p-1 rounded flex flex-row items-center gap-2"
                    >
                        <span class="bg-red-500 w-3 h-3 rounded-full"></span>
                        <span class="dark:text-gray-300">Male</span>
                    </div>
                    <div
                        class="w-32 text-sm justify-center border border-gray-300 dark:border-gray-500 p-1 rounded flex flex-row items-center gap-2"
                    >
                        <span class="bg-purple-500 w-3 h-3 rounded-full"></span>
                        <span class="dark:text-gray-300">Male</span>
                    </div>
                </div>
                <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div class="flex flex-col gap-2 items-center text-sm">
                        <span class="dark:text-gray-300">Staff</span>
                        <span class="dark:text-gray-300">50</span>
                    </div>
                    <div class="flex flex-col gap-2 items-center text-sm">
                        <span class="dark:text-gray-300">Produksi</span>
                        <span class="dark:text-gray-300">50</span>
                    </div>
                    <div class="flex flex-col gap-2 items-center text-sm">
                        <span class="dark:text-gray-300">Harles</span>
                        <span class="dark:text-gray-300">50</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import DonutChart from '@/core/components/DonutChart.vue';

</script>

<style scoped></style>
