<template>
    <div
        class="w-full rounded shadow border overflow-y-scroll scrollbar-thin scrollbar-track-primary-surface scrollbar-thumb-primary-border max-h-64 bg-white dropdown-container"
        :class="
            refined_options.length > 0 ? 'border-blue-300' : 'border-red-300'
        "
        ref="root"
    >
        <div v-if="refined_options.length === 0" class="p-4">
            <span class="text-gray-500 dark:text-gray-400 text-sm"
                >Hasil pencarian tidak ditemukan untuk
                <span class="italic">"{{ search }}"</span></span
            >
        </div>
        <div
            v-for="option in refined_options"
            :key="option.id"
            class="w-full flex flex-row justify-between"
        >
            <button
                class="w-full rounded hover:bg-blue-300 px-2 py-3.5 text-left transition-colors"
                :class="
                    selected?.id === option.id
                        ? 'font-bold selected-dropdown'
                        : ''
                "
                @click.prevent="$emit('select', option)"
            >
                <div class="flex flex-col">
                    <span>{{ option.label }}</span>
                    <span
                        class="text-xs text-gray-400"
                        v-if="option.subtitle"
                        >{{ option.subtitle }}</span
                    >
                </div>
            </button>
            <IconButton
                v-if="withDelete"
                @click="$emit('delete', option)"
                :icon-name="'delete'"
            />
        </div>

        <div class="w-full h-0" ref="dropEndEl"></div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, onUnmounted } from "vue";
import type { DropdownLabel } from "./models/DropdownLabel";
import { useIntersectionObserver } from "@vueuse/core";
import IconButton from "./button/Icon.button.vue";
const dropEndEl = ref<HTMLDivElement | null>(null);
const $props = defineProps<{
    search: string;
    options: DropdownLabel[];
    dont_filter?: boolean | "true" | "false";
    selected?: DropdownLabel;
    withDelete?: boolean;
}>();
const $emit = defineEmits<{
    (e: "select", option: DropdownLabel): void;
    (e: "paginate"): void;
    (e: "delete", option: DropdownLabel): void;
}>();

const root = ref<HTMLDivElement | null>(null);
onMounted(() => {
    root.value!.querySelector(".selected-dropdown")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
    });
});

let stopObserver = function () {};
onMounted(() => {
    const { stop } = useIntersectionObserver(
        dropEndEl,
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    $emit("paginate");
                }
            });
        },
        {
            root: root,
        },
    );
    stopObserver = stop;
});
onUnmounted(stopObserver);

const noFilter = computed(
    () => $props.dont_filter === true || $props.dont_filter === "true",
);

const refined_options = computed(() => {
    if (noFilter.value) return $props.options;
    return $props.options.filter((o) => {
        if ($props.search === "") return true;

        return o.label.toLowerCase().includes($props.search.toLowerCase());
    });
});
</script>

<style scoped></style>
