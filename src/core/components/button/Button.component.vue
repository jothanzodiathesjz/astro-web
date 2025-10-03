<template>
    <button
        ref="buttonRef"
        :class="['relative', { 'cursor-not-allowed': disabled }]"
        :disabled="disabled"
        @click="$emit('click')"
    >
        <div
            :class="[
                baseClass,
                variantClasses,
                { 'opacity-30': disabled, shadow: withShadow },
            ]"
        >
            <font-awesome-icon
                v-if="iconName"
                :icon="['fa-solid', iconName]"
                class="mr-2 text-gray-400 dark:text-gray-500"
            />

            <span v-if="hasDefaultSlot">
                <slot></slot>
            </span>
        </div>
        <div
            v-if="loading"
            class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
            <font-awesome-icon
                class="text-gray-950 dark:text-white font-bold"
                :spin-pulse="true"
                icon="fa-solid fa-spinner"
            />
        </div>
    </button>
</template>

<script setup lang="ts">
import { computed, ref, useSlots } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus, faTrash, faGear } from "@fortawesome/free-solid-svg-icons";

// Tambahkan ikon yang dibutuhkan ke library
library.add(faPlus, faTrash, faGear);

const props = defineProps<{
    variant?:
        | "primary"
        | "secondary"
        | "danger"
        | "outline"
        | "ghost"
        | "white";
    disabled?: boolean;
    iconName?: string;
    loading?: boolean;
    withShadow?: boolean;
}>();

const emit = defineEmits(["click"]);

const slots = useSlots();
const hasDefaultSlot = computed(() => !!slots.default);

// 1. Buat ref baru untuk button
const buttonRef = ref<HTMLButtonElement | null>(null);

// 2. Gunakan defineExpose untuk membuat buttonRef dapat diakses
defineExpose({
    buttonRef,
});

const baseClass =
    "rounded-lg cursor-pointer text-sm py-2.5 px-6 transition-all duration-300 flex items-center justify-center";

const variantClasses = computed(() => {
    switch (props.variant) {
        case "secondary":
            return "bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300";
        case "danger":
            return "bg-red-600 hover:bg-red-700 text-white";
        case "outline":
            return "border border-gray-300 hover:bg-gray-100 text-gray-700 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-300";
        case "ghost":
            return "bg-transparent hover:bg-gray-100 text-gray-700 dark:hover:bg-gray-700 dark:text-gray-300";
        case "white":
            return "bg-white hover:bg-gray-100 text-gray-700 dark:hover:bg-gray-700 dark:text-gray-300";
        case "primary":
        default:
            return "bg-blue-600 hover:bg-blue-700 text-white";
    }
});
</script>

<style scoped>
/* Tambahkan gaya kustom jika diperlukan */
</style>
