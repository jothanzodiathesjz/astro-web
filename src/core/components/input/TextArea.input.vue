<template>
    <InputContainer
        :focused="focused"
        :label="props.label"
        :readonly="props.readonly"
        :optional="props.optional"
        :helper="helper"
        :hint="props.hint"
        :border-class="props.borderClass"
    >
        <template #prefix>
            <slot name="prefix"></slot>
        </template>

        <textarea
            ref="textareaRef"
            class="w-full px-2 py-3 outline-none rounded placeholder:text-sm text-sm dark:text-gray-200"
            :class="[
                isReadonly
                    ? 'bg-gray-100 dark:bg-gray-900 cursor-not-allowed'
                    : 'bg-white dark:bg-gray-800',
                isAutoResize ? 'resize-none overflow-hidden' : 'resize-y',
            ]"
            :placeholder="props.placeholder ?? ''"
            :rows="props.rows"
            :maxlength="props.maxlength"
            :readonly="isReadonly"
            :value="props.value"
            @focus="handleFocus"
            @blur="handleBlur"
            @input="handleInput"
        ></textarea>

        <template #postfix>
            <slot name="postfix"></slot>
        </template>
        <template #suffix>
            <slot name="suffix"></slot>
        </template>
        <template #actions>
            <slot name="actions"></slot>
        </template>
    </InputContainer>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useDebounceFn } from "@vueuse/core";
import type { Helper } from "../models/Helper";
import InputContainer from "./Input.container.vue";

const emit = defineEmits<{
    (e: "input", value: string): void;
    (e: "focus"): void;
    (e: "blur"): void;
}>();

const props = withDefaults(
    defineProps<{
        value?: string;
        label?: string;
        placeholder?: string;
        readonly?: boolean | "true";
        optional?: boolean | "true";
        debounce?: number;
        hint?: {
            link?: string;
            text: string;
        };
        error?: string[] | string;
        success?: string[] | string;
        rows?: number;
        maxlength?: number;
        autoResize?: boolean | "true";
        borderClass?: string;
    }>(),
    {
        value: "",
        rows: 3,
    },
);

const focused = ref(false);
const textareaRef = ref<HTMLTextAreaElement | null>(null);

const isReadonly = computed(() => {
    return props.readonly === true || props.readonly === "true";
});

const isAutoResize = computed(() => {
    return props.autoResize === true || props.autoResize === "true";
});

const helper = computed((): Helper | undefined => {
    if (props.success) {
        return {
            status: "success",
            messages: props.success,
        };
    }

    const hasErrorArray = Array.isArray(props.error) && props.error.length > 0;
    const hasErrorString =
        typeof props.error === "string" && props.error !== "";

    if (hasErrorArray || hasErrorString) {
        return {
            status: "error",
            messages: props.error,
        };
    }

    return undefined;
});

const debouncedHandleInput = useDebounceFn((value: string) => {
    emit("input", value);
}, props.debounce ?? 0);

const adjustHeight = () => {
    if (!isAutoResize.value || !textareaRef.value) {
        return;
    }

    const element = textareaRef.value;
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
};

const handleFocus = () => {
    focused.value = true;
    emit("focus");
};

const handleBlur = () => {
    focused.value = false;
    emit("blur");
};

const handleInput = (event: Event) => {
    const target = event.target as HTMLTextAreaElement;
    debouncedHandleInput(target.value);
    adjustHeight();
};

onMounted(() => {
    nextTick(adjustHeight);
});

watch(
    () => props.value,
    () => nextTick(adjustHeight),
);

watch(isAutoResize, () => nextTick(adjustHeight));
</script>

<style scoped></style>
