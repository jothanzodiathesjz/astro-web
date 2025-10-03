<template>
    <VueDatePicker
        v-model="time"
        time-picker
        :dark="isDark"
        :disabled="disabled"
        :minutes-increment="minuteStep"
        :seconds-increment="secondStep"
        :enable-seconds="withSeconds"
        :clearable="!disabled"
        :position="'left'"
        :teleport="true"
        :auto-apply="autoApply ? true : false"
    >
        <template #dp-input="{ value }">
            <TextInput
                :value="value ?? ''"
                :label="props.label"
                :placeholder="props.placeholder ?? ''"
                :readonly="isReadonly || disabled"
                :optional="props.optional"
                :hint="props.hint"
                :error="props.error"
                :success="props.success"
                :border-class="props.borderClass"
            >
                <template v-if="withClear" #suffix>
                    <IconButton
                        class="mr-2"
                        :size="'xs'"
                        :icon-name="'fa-circle-xmark'"
                        @click="
                            (e) => {
                                e.stopPropagation();
                                $emit('clear');
                            }
                        "
                    />
                </template>
            </TextInput>
        </template>
    </VueDatePicker>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import isDark from "@/core/ui/composables/dark";
import { UITime } from "@/core/ui/UITime";
import TextInput from "./Text.input.vue";
import IconButton from "../button/Icon.button.vue";

type TimeValue = {
    hours: number;
    minutes: number;
    seconds?: number;
};

const emit = defineEmits<{
    (e: "update:modelValue", value: UITime | null): void;
    (e: "change", value: UITime | null): void;
    (e: "clear"): void;
}>();

const props = withDefaults(
    defineProps<{
        modelValue?: UITime | null;
        disabled?: boolean | "true" | "false";
        is24Hour?: boolean;
        minuteStep?: number;
        secondStep?: number;
        withSeconds?: boolean;
        readonly?: boolean | "true";
        placeholder?: string;
        label?: string;
        autoApply?: boolean;
        optional?: boolean | "true";
        hint?: {
            link?: string;
            text: string;
        };
        error?: string[] | string;
        success?: string[] | string;
        borderClass?: string;
        withClear?: boolean;
    }>(),
    {
        modelValue: null,
        disabled: false,
        is24Hour: true,
        minuteStep: 1,
        secondStep: 1,
        withSeconds: false,
        readonly: false,
        placeholder: "",
        label: "",
        autoApply: false,
        withClear: false,
    },
);

const minuteStep = computed(() => Math.max(props.minuteStep ?? 1, 1));
const secondStep = computed(() => Math.max(props.secondStep ?? 1, 1));
const withSeconds = computed(() => props.withSeconds);
const disabled = computed(
    () => props.disabled === true || props.disabled === "true",
);
const isReadonly = computed(
    () => props.readonly === true || props.readonly === "true",
);

const time = ref<UITime | null>(normalizeTime(props.modelValue));
let suppressEmit = false;

watch(
    () => props.modelValue,
    (value) => {
        const normalized = normalizeTime(value);
        if (!isSameTime(normalized, time.value)) {
            suppressEmit = true;
            time.value = normalized;
            queueMicrotask(() => {
                suppressEmit = false;
            });
        }
    },
    { deep: true },
);

watch(
    time,
    (value) => {
        if (suppressEmit) return;
        const normalized = normalizeTime(value);
        emit("update:modelValue", normalized ? normalized : null);
        emit("change", normalized ? normalized : null);
    },
    { deep: true },
);

function normalizeTime(value: UITime | null | undefined): UITime | null {
    if (!value) return null;

    const normalized: UITime = new UITime(
        clamp(value.hours, 0, props.is24Hour ? 23 : 12),
        clamp(value.minutes, 0, 59),
    );

    if (props.withSeconds) {
        normalized.seconds = clamp(value.seconds ?? 0, 0, 59);
    }

    return normalized;
}

function isSameTime(a: TimeValue | null, b: TimeValue | null): boolean {
    if (!a && !b) return true;
    if (!a || !b) return false;
    const secondsA = props.withSeconds ? (a.seconds ?? 0) : undefined;
    const secondsB = props.withSeconds ? (b.seconds ?? 0) : undefined;
    return (
        a.hours === b.hours &&
        a.minutes === b.minutes &&
        (props.withSeconds ? secondsA === secondsB : true)
    );
}

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}
</script>

<style>
:root {
    --dp-font-family: "Be Vietnam Pro", sans-serif;
    --dp-font-size: 0.875rem;
}

.dp__theme_dark {
    --dp-background-color: #1e2939;
    --dp-menu-border-color: #4a5565;
}
</style>
