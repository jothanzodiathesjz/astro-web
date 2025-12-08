<template>
    <InputContainer
        :focused="focused"
        :label="label"
        :readonly="readonly"
        :optional="optional"
        :icon="icon"
        :helper="helper"
        :hint="hint"
    >
        <template #prefix>
            <FontAwesomeIcon
                v-if="icon?.left"
                :icon="['fa-solid', icon.left.name]"
                class="left-icon pl-2 text-gray-400 dark:text-gray-500"
            />
        </template>

        <input
            class="w-full px-2 py-3 outline-none rounded placeholder:text-sm text-sm dark:text-gray-200"
            :class="[
                isReadonly
                    ? 'bg-gray-100 dark:bg-gray-900'
                    : 'bg-white dark:bg-gray-800',
            ]"
            type="number"
            @focus="[(focused = true), $emit('focus')]"
            @blur="[(focused = false), $emit('blur')]"
            :placeholder="placeholder ?? ''"
            :value="modelValue"
            @input="
                debouncedHandleInput(($event.target as HTMLInputElement).value)
            "
            :readonly="isReadonly"
            :min="min"
            :max="max"
        />

        <!-- <template #postfix>
            <div
                class="flex flex-row items-center justify-center p-1 text-gray-400 dark:text-gray-500"
            >
                <button
                    @click="increment"
                    class="flex items-center justify-center w-6 h-6 rounded-full transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                    <FontAwesomeIcon icon="fa-solid fa-plus" />
                </button>
                <button
                    @click="decrement"
                    class="flex items-center justify-center w-6 h-6 rounded-full transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                    <FontAwesomeIcon icon="fa-solid fa-minus" />
                </button>
            </div>
        </template> -->

        <template #suffix><slot name="suffix"></slot></template>
        <template #actions><slot name="actions"></slot></template>
    </InputContainer>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { Helper } from "../models/Helper";
import InputContainer from "./Input.container.vue";
import { useDebounceFn } from "@vueuse/core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import type { AwesomeIcon } from "../models/AwesomeIcon";

const emit = defineEmits<{
    (e: "update:modelValue", value: number): void;
    (e: "focus"): void;
    (e: "blur"): void;
}>();

const props = defineProps<{
    modelValue: number;
    label?: string;
    placeholder?: string;
    readonly?: boolean | "true";
    optional?: boolean | "true";
    debounce?: number;
    iconClass?: string;
    hint?: {
        link?: string;
        text: string;
    };
    icon?: {
        left?: AwesomeIcon;
    };
    error?: string[] | string;
    success?: string[] | string;
    min?: number;
    max?: number;
}>();

const focused = ref<boolean>(false);

const debouncedHandleInput = useDebounceFn((value: string) => {
    const numberValue = parseFloat(value);
    if (!isNaN(numberValue)) {
        emit("update:modelValue", numberValue);
    }
}, props.debounce ?? 0);

const isReadonly = computed(() => {
    return props.readonly === true || props.readonly === "true";
});

const helper = computed((): Helper | undefined => {
    if (props.success) {
        return {
            status: "success",
            messages: props.success,
        };
    }
    if (props.error) {
        return {
            status: "error",
            messages: props.error,
        };
    }
    return undefined;
});

// const increment = () => {
//     if (!isReadonly.value) {
//         const newValue = props.modelValue + 1;
//         if (props.max === undefined || newValue <= props.max) {
//             emit("update:modelValue", newValue);
//         }
//     }
// };

// const decrement = () => {
//     if (!isReadonly.value) {
//         const newValue = props.modelValue - 1;
//         if (props.min === undefined || newValue >= props.min) {
//             emit("update:modelValue", newValue);
//         }
//     }
// };
</script>

<style scoped>
/* Menghilangkan panah bawaan pada input type number */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type="number"] {
    -moz-appearance: textfield;
}
</style>
