<template>
  <div
    ref="tableContainer"
    class="w-full bg-white dark:bg-gray-800"
    :class="$props.overflowX ? 'w-full overflow-x-auto' : ''"
  >
    <table class="border-collapse w-full" :class="tableClass">
      <thead
        class="bg-white dark:bg-gray-900 shadow-gray-100 dark:shadow-gray-700 shadow-sm table-header border-collapse p-3 items-center text-sm border-gray-700 dark:border-gray-600 sticky z-[1] top-0"
      >
        <slot name="table-header"></slot>
      </thead>
      <tbody v-if="!empty" class="table-body-custom">
        <slot name="table-body"></slot>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";
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
    }
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
