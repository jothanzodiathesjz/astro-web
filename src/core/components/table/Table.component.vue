<template>
    <div
        ref="tableContainer"
        class="w-full bg-white dark:bg-gray-800"
        :class="[$props.overflowX ? 'overflow-x-auto' : '']"
    >
        <table
            class="border-separate border-spacing-0 w-full min-w-full"
            :class="tableClass"
        >
            <thead
                class="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-b table-header border-collapse px-3 py-1 items-center text-sm border-gray-200 dark:border-gray-600 sticky z-[10] top-0 rounded-t-lg"
            >
                <slot name="table-header"></slot>
            </thead>

            <tbody v-if="!empty" class="table-body-custom text-gray-800">
                <slot name="table-body"></slot>
            </tbody>

            <tbody ref="tableEndEl" class="text-xs text-gray-50">
                end0ftable
            </tbody>
        </table>
        <div
            class="w-full h-56 flex flex-col justify-center items-center"
            v-if="empty"
        >
            <div class="flex flex-row gap-2 items-center text-gray-400 text-sm">
                <font-awesome-icon icon="fa-solid fa-magnifying-glass" /> No
                data found
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
const tableContainer = ref<HTMLDivElement | null>(null);
const tableEndEl = ref<HTMLDivElement | null>(null);

let stopObserver = function () {};
onMounted(() => {
    const { stop } = useIntersectionObserver(
        tableEndEl,
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    console.log("intersecting");
                    $emit("paginate");
                }
            });
        },
        {
            root: tableContainer,
        },
    );
    stopObserver = stop;
});
onUnmounted(stopObserver);
const $props = defineProps<{
    empty: boolean;
    scroolHeight?: number;
    overflowX?: boolean;
    tableClass?: string;
    loading?: string;
}>();

const $emit = defineEmits<{
    (e: "refresh"): void;
    (e: "paginate"): void;
}>();

onMounted(async () => {});
</script>
<style scoped>
th {
    resize: horizontal;
    overflow: auto;
}
</style>
