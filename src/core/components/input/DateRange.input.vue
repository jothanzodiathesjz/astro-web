<template>
    <VueDatePicker
        ref="dpRef"
        v-model="internalValue"
        :dark="isDark"
        :auto-apply="true"
        :close-on-auto-apply="true"
        :enable-time-picker="withTime"
        :week-start="weekStart"
        :hide-offset-dates="false"
        :clearable="false"
        :range="rangeProp"
        :month-picker="false"
        @update:model-value="onDpUpdate"
    >
        <!-- ========== Custom Input (label + prev/next) ========== -->
        <template #dp-input="{ value }">
            <div
                class="flex items-center w-full px-2 py-2 border rounded-lg text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus-within:border-blue-400 dark:focus-within:border-blue-500"
            >
                <button
                    type="button"
                    class="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    @click.stop="shift(-1)"
                    aria-label="Prev period"
                >
                    <FontAwesomeIcon icon="fa-solid fa-chevron-left" />
                </button>

                <input
                    :value="displayLabel"
                    readonly
                    class="flex-1 bg-transparent outline-none px-2 dark:text-gray-200"
                    :placeholder="placeholder"
                />

                <button
                    type="button"
                    class="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    @click.stop="shift(1)"
                    aria-label="Next period"
                >
                    <FontAwesomeIcon icon="fa-solid fa-chevron-right" />
                </button>
            </div>
        </template>

        <!-- ========== Left Sidebar: mode picker ========== -->
        <template #left-sidebar>
            <div class="w-40 p-2 border-r dark:border-gray-700">
                <ul class="space-y-1 text-sm">
                    <li v-for="m in modes" :key="m.value">
                        <button
                            type="button"
                            class="w-full text-left px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                            :class="
                                mode === m.value
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                                    : 'text-gray-700 dark:text-gray-200'
                            "
                            @click="setMode(m.value)"
                        >
                            {{ m.label }}
                        </button>
                    </li>
                </ul>
            </div>
        </template>
    </VueDatePicker>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/** ====== Props & v-model ====== */
const model = defineModel<[Date, Date] | null>({ default: null });

const props = withDefaults(
    defineProps<{
        placeholder?: string;
        withTime?: boolean;
        /** 1 = Monday, 0 = Sunday (default Monday, seperti contohmu) */
        weekStart?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
        /** initial mode */
        initialMode?: "weekly" | "biweekly" | "monthly" | "custom";
        /** pakai dark mode? (atau ganti dengan composable milikmu) */
        isDark?: boolean;
    }>(),
    {
        placeholder: "Select date range",
        withTime: false,
        weekStart: 1,
        initialMode: "weekly",
        isDark: false,
    },
);

/** ====== State ====== */
const dpRef = ref<InstanceType<typeof VueDatePicker> | null>(null);
const mode = ref<"weekly" | "biweekly" | "monthly" | "custom">(
    props.initialMode,
);
const internalValue = ref<[Date, Date] | null>(null);
/** Anchor dipakai untuk weekly/biweekly/monthly */
const anchor = ref<Date>(new Date());

/** ====== Helpers tanggal ====== */
const startOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
const endOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

const addDays = (d: Date, n: number) => {
    const nd = new Date(d);
    nd.setDate(nd.getDate() + n);
    return nd;
};
const startOfWeek = (d: Date, weekStart = 1) => {
    const day = d.getDay(); // 0..6 (Sun..Sat)
    const diff = (day - weekStart + 7) % 7;
    return startOfDay(addDays(d, -diff));
};
const endOfWeek = (d: Date, weekStart = 1) =>
    endOfDay(addDays(startOfWeek(d, weekStart), 6));
const firstOfMonth = (d: Date) =>
    startOfDay(new Date(d.getFullYear(), d.getMonth(), 1));
const lastOfMonth = (d: Date) =>
    endOfDay(new Date(d.getFullYear(), d.getMonth() + 1, 0));

/** ====== Mode ui ====== */
const modes = [
    { value: "weekly", label: "Weekly" },
    { value: "biweekly", label: "Biweekly" },
    { value: "monthly", label: "Monthly" },
    { value: "custom", label: "Custom Range" },
] as const;

const isCustom = computed(() => mode.value === "custom");

/** ====== Label input ====== */
const formatID = (d: Date) =>
    d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

const displayLabel = computed(() => {
    if (!internalValue.value) return props.placeholder;
    const [s, e] = internalValue.value;
    const from = s ? formatID(s) : "";
    const to = e ? formatID(e) : "";
    const cap =
        mode.value === "custom"
            ? ""
            : mode.value === "weekly"
            ? "Weekly"
            : mode.value === "biweekly"
            ? "Biweekly"
            : "Monthly";
    return `${cap} (${from} – ${to})`;
});

/** ====== Core compute range berdasarkan mode & anchor ====== */
function computeRangeFromAnchor(
    m: typeof mode.value,
    base: Date,
): [Date, Date] {
    if (m === "weekly") {
        const s = startOfWeek(base, props.weekStart);
        const e = endOfWeek(base, props.weekStart);
        return [s, e];
    }
    if (m === "biweekly") {
        const s = startOfWeek(base, props.weekStart);
        const e = endOfDay(addDays(s, 13));
        return [s, e];
    }
    if (m === "monthly") {
        return [firstOfMonth(base), lastOfMonth(base)];
    }
    // custom: biarkan apa adanya (range bebas), fallback ke model atau null
    return internalValue.value ?? model.value ?? null!;
}

/** ====== Event dari DatePicker ====== */
function onDpUpdate(v: unknown) {
    if (isCustom.value) {
        // v: [start, end] | null
        internalValue.value = (v as [Date, Date] | null) ?? null;
        model.value = internalValue.value;
        if (!props.withTime && internalValue.value) {
            // pastikan start/end di-normalize harian
            const [s, e] = internalValue.value;
            internalValue.value = [startOfDay(s), endOfDay(e)];
            model.value = internalValue.value;
        }
        return;
    }

    // Non-custom: user memilih satu tanggal sebagai anchor
    const picked = Array.isArray(v) ? v[0] : (v as Date);
    if (!picked) return;
    anchor.value = picked;

    const range = computeRangeFromAnchor(mode.value, anchor.value);
    internalValue.value = range;
    model.value = range;
    // Tutup menu (opsional)
    dpRef.value?.closeMenu();
}

/** ====== Navigasi prev/next ====== */
function shift(step: number) {
    if (mode.value === "weekly") {
        anchor.value = addDays(anchor.value, step * 7);
    } else if (mode.value === "biweekly") {
        anchor.value = addDays(anchor.value, step * 14);
    } else if (mode.value === "monthly") {
        const a = new Date(anchor.value);
        a.setMonth(a.getMonth() + step);
        anchor.value = a;
    } else {
        // custom: geser seluruh range (jika ada)
        if (internalValue.value) {
            const [s, e] = internalValue.value;
            const delta = e
                ? (e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24) + 1
                : 1;
            const ns = addDays(s, step * delta);
            const ne = addDays(e ?? s, step * delta);
            internalValue.value = [startOfDay(ns), endOfDay(ne)];
            model.value = internalValue.value;
            return;
        }
        anchor.value = addDays(anchor.value, step);
    }

    const range = computeRangeFromAnchor(mode.value, anchor.value);
    internalValue.value = range;
    model.value = range;
}

/** ====== Ganti mode ====== */
function setMode(m: typeof mode.value) {
    mode.value = m;
    if (m === "custom") {
        // biarkan nilai existing (jika ada), jika belum ada, pakai hari ini
        if (!internalValue.value) {
            const today = new Date();
            internalValue.value = [startOfDay(today), endOfDay(today)];
            model.value = internalValue.value;
        }
        return;
    }
    // untuk weekly/biweekly/monthly, hitung dari anchor (ambil start dari range existing)
    const base = internalValue.value?.[0] ?? anchor.value ?? new Date();
    anchor.value = base;
    const range = computeRangeFromAnchor(m, base);
    internalValue.value = range;
    model.value = range;
}

/** ====== Init ====== */
onMounted(() => {
    if (model.value && Array.isArray(model.value)) {
        internalValue.value = model.value;
        anchor.value = model.value[0] ?? new Date();
    } else {
        const init = computeRangeFromAnchor(mode.value, new Date());
        internalValue.value = init;
        model.value = init;
    }
});

/** ====== Keep anchor ketika model dari luar berubah ====== */
watch(model, (nv) => {
    if (nv && Array.isArray(nv)) {
        internalValue.value = nv;
        anchor.value = nv[0] ?? anchor.value;
    }
});

const isDark = computed(() => props.isDark);
const withTime = computed(() => props.withTime);
const weekStart = computed(() => props.weekStart);
const placeholder = computed(() => props.placeholder);

const rangeProp = computed(() =>
    mode.value === "custom" ? { partialRange: true } : true,
);

// (Optional) expose method
defineExpose({ shift, setMode });
</script>

<style>
/* Sedikit tweak tema (opsional) */
:root {
    --dp-font-size: 0.875rem;
}
</style>
