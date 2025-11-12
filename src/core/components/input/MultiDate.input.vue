<template>
    <VueDatePicker
        v-model="dates"
        :dark="isDark"
        :multi-dates="true"
        :multi-dates-limit="maxSelectable || undefined"
        :enable-time-picker="withTime"
        :clearable="false"
        :min-date="minDate"
        :max-date="maxDate"
        :auto-apply="false"
        :hide-offset-dates="true"
        :month-change-on-scroll="false"
        :esc-close="true"
        :teleport="false"
    >
        <!-- Custom input -->
        <template #dp-input="{ value }">
            <TextInput
                :value="displayValue"
                :label="label"
                :placeholder="placeholder"
                :readonly="false"
                :error="error"
                :icon="{ left: { name: 'fa-calendar' } }"
            >
                <template #suffix>
                    <span
                        v-if="dates.length"
                        class="mr-2 shrink-0 text-sm text-gray-500 dark:text-gray-400"
                    >
                        {{ dates.length }} tgl
                    </span>
                    <IconButton
                        class="mr-2"
                        :size="'xs'"
                        :icon-name="'fa-circle-xmark'"
                        @click="clearDates"
                    />
                </template>
            </TextInput>
        </template>

        <!-- Menandai tanggal yang di-highlight (opsional) -->
        <template #day="{ day, date }">
            <div
                class="w-8 h-8 flex items-center justify-center rounded-full"
                :class="[
                    isSelected(date)
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700',
                    isHighlighted(date) && !isSelected(date)
                        ? 'ring-2 ring-blue-400'
                        : '',
                ]"
            >
                {{ day }}
            </div>
        </template>
    </VueDatePicker>
</template>

<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import isDark from "@/core/ui/composables/dark";
import TextInput from "./Text.input.vue";
import IconButton from "../button/Icon.button.vue";
import { computed } from "vue";

// v-model => Date[]
const dates = defineModel<Date[]>({ default: [] });

const props = withDefaults(
    defineProps<{
        label?: string;
        placeholder?: string;
        error?: string[] | string;
        withTime?: boolean;

        // batasan & validasi opsional
        maxSelectable?: number; // batasi jumlah tanggal yang bisa dipilih
        minDate?: Date | string; // tanggal minimum
        maxDate?: Date | string; // tanggal maksimum
        disabledDates?: (Date | string)[]; // array tanggal yang di-disable
        allowedDates?: (date: Date) => boolean; // filter custom
        highlightDates?: (Date | string)[]; // tanggal yang diberi highlight ring
    }>(),
    {
        label: "",
        placeholder: "Pilih beberapa tanggal…",
        withTime: false,
        maxSelectable: undefined,
        minDate: undefined,
        maxDate: undefined,
        disabledDates: undefined,
        allowedDates: undefined,
        highlightDates: undefined,
    },
);

const emit = defineEmits<{
    (e: "clear"): void;
}>();

const fmt = (d: Date) =>
    d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
    });

const displayValue = computed(() => {
    if (!dates.value?.length) return "";
    // tampilkan maksimal 3 tanggal, sisanya jadi "+N"
    const sorted = [...dates.value].sort((a, b) => a.getTime() - b.getTime());
    const head = sorted.slice(0, 3).map(fmt).join(", ");
    const rest = sorted.length > 3 ? ` +${sorted.length - 3}` : "";
    return head + rest;
});

function clearDates(e?: MouseEvent) {
    if (e) e.stopPropagation();
    dates.value = [];
    emit("clear");
}

// util: cocokkan tanggal by Y-M-D
function ymd(d: Date) {
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}
function isSameDay(a: Date, b: Date) {
    return ymd(a) === ymd(b);
}

function isSelected(date: Date) {
    return dates.value.some((d) => isSameDay(d, date));
}

function normalizeDate(v: Date | string): Date {
    return v instanceof Date ? v : new Date(v);
}
function isHighlighted(date: Date) {
    if (!props.highlightDates?.length) return false;
    return props.highlightDates.some((v) => isSameDay(normalizeDate(v), date));
}
</script>

<style scoped>
/* :root {
  --dp-font-family: font-family: "Be Vietnam Pro", sans-serif;
  --dp-font-size: 0.875rem;
} */

.dp__theme_dark {
    --dp-background-color: #1e2939;
    --dp-menu-border-color: #4a5565;
}
.dp__cell_inner :hover {
    background: rgba(255, 0, 0, 0) !important;
}
.dp--clear-btn {
    display: none;
}
</style>
