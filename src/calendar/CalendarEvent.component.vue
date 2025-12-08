<template>
    <div class="w-full max-w-5xl mx-auto">
        <!-- Header -->
        <div
            class="flex items-center justify-center gap-3 py-3 border-b border-gray-200 mb-2"
        >
            <button
                class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition"
                @click="goPrevMonth"
                aria-label="Previous month"
            >
                <svg
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
            </button>
            <div>
                <VueDatePicker
                    :model-value="bulan"
                    month-picker
                    @update:model-value="handleMonthChange"
                >
                    <template #dp-input="{}">
                        <div
                            class="px-4 py-2 rounded-lg bg-white border border-gray-200 shadow-sm text-gray-800 font-semibold"
                        >
                            {{ monthLabel }}
                        </div>
                    </template>
                </VueDatePicker>
            </div>

            <button
                class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition"
                @click="goNextMonth"
                aria-label="Next month"
            >
                <svg
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </button>
        </div>

        <!-- Weekday header -->
        <div
            class="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-gray-500 px-2"
        >
            <div v-for="w in weekdays" :key="w" class="py-2 select-none">
                {{ w }}
            </div>
        </div>

        <!-- Calendar grid -->
        <div class="grid grid-cols-7 gap-2 p-2">
            <button
                v-for="day in monthDays"
                :key="day.key"
                @click="onDayClick(day)"
                class="group flex flex-col items-center justify-between rounded-xl border text-center py-3 min-h-[60px] transition focus:outline-none focus:ring-2 focus:ring-blue-300"
                :class="cellClass(day)"
            >
                <div class="w-full flex justify-between px-3">
                    <span
                        class="text-sm font-semibold select-none"
                        :class="
                            day.inCurrentMonth
                                ? 'text-gray-800'
                                : 'text-gray-400'
                        "
                    >
                        {{ day.date.getDate() }}
                    </span>
                    <!-- Optional badge for today -->
                    <span
                        v-if="isToday(day.date)"
                        class="text-[10px] px-2 py-0.5 rounded-full border"
                        :class="
                            day.count > 0
                                ? 'border-blue-200 text-blue-600 bg-blue-50'
                                : 'border-gray-200 text-gray-500 bg-white'
                        "
                    >
                        Today
                    </span>
                </div>

                <div
                    class="text-xs font-medium mt-4"
                    :class="
                        day.count > 0
                            ? 'text-blue-600'
                            : day.inCurrentMonth
                              ? 'text-gray-400'
                              : 'text-gray-300'
                    "
                >
                    {{ pluralizeTasks(day.count) }}
                </div>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

type TaskData = { date: string; count: number };

const props = withDefaults(
    defineProps<{
        tasks?: TaskData[];
        /** 0-11 (opsional). Jika tidak ada, gunakan bulan sekarang. */
        initialMonth?: number;
        /** Tahun 4 digit (opsional). Jika tidak ada, gunakan tahun sekarang. */
        initialYear?: number;
    }>(),
    {
        tasks: () => [],
    },
);

const emit = defineEmits<{
    (e: "day-click", payload: { date: Date; count: number }): void;
}>();

/** ===== Helpers ===== */
const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const toKey = (d: Date) =>
    `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const formatISO = (d: Date) => toKey(d);
const isSameDate = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

const pluralizeTasks = (n: number) => (n === 1 ? "1 task" : `${n} Label`);

/** Build quick lookup from tasks prop */
const taskMap = computed<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    for (const t of props.tasks ?? []) {
        map[t.date] = (t?.count ?? 0) | 0;
    }
    return map;
});

/** ===== Calendar state ===== */
const today = new Date();
const current = reactive({
    year: props.initialYear ?? today.getFullYear(),
    month: props.initialMonth ?? today.getMonth(), // 0-11
});

const monthLabel = computed(() =>
    new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(
        new Date(current.year, current.month, 1),
    ),
);

const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function getDaysInMonth(year: number, month0: number) {
    return new Date(year, month0 + 1, 0).getDate();
}

function startOfMonth(year: number, month0: number) {
    return new Date(year, month0, 1);
}

function endOfMonth(year: number, month0: number) {
    return new Date(year, month0, getDaysInMonth(year, month0));
}

function isToday(d: Date) {
    return isSameDate(d, today);
}

type DayCell = {
    key: string;
    date: Date;
    inCurrentMonth: boolean;
    count: number;
};

/** Generate a 6-row x 7-col grid (42 cells) */
const monthDays = computed<DayCell[]>(() => {
    const first = startOfMonth(current.year, current.month);
    const last = endOfMonth(current.year, current.month);
    const leading = first.getDay(); // 0 = Sun, ... 6 = Sat
    const total = leading + last.getDate();
    const trailing = (7 - (total % 7)) % 7;
    const totalCells = leading + last.getDate() + trailing;

    const out: DayCell[] = [];
    for (let i = 0; i < totalCells; i++) {
        // Calculate the date represented by this cell
        const dayOffset = i - leading + 1;
        const date = new Date(current.year, current.month, dayOffset);
        const key = toKey(date);
        const inCurrentMonth = date.getMonth() === current.month;

        const count = taskMap.value[formatISO(date)] ?? 0;

        out.push({ key, date, inCurrentMonth, count });
    }
    return out;
});

const bulan = ref({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
});

function handleMonthChange(e: unknown) {
    if (e instanceof Object) {
        const date = e as { month: number; year: number };
        bulan.value = date;
        current.month = date.month;
        current.year = date.year;
    }
}

/** Cell style based on state */
function cellClass(day: DayCell) {
    const base =
        "bg-white border-gray-200 shadow-sm hover:shadow transition hover:-translate-y-[1px]";
    const inactive = day.inCurrentMonth ? "" : "opacity-60";
    const hasTasks =
        day.count > 0
            ? "bg-blue-50 border-blue-100 hover:bg-blue-100"
            : "hover:bg-gray-50";
    return [base, inactive, hasTasks].join(" ");
}

/** Navigation */
function goPrevMonth() {
    if (current.month === 0) {
        current.month = 11;
        current.year -= 1;
    } else {
        current.month -= 1;
    }
}
function goNextMonth() {
    if (current.month === 11) {
        current.month = 0;
        current.year += 1;
    } else {
        current.month += 1;
    }
}

/** Click handler */
function onDayClick(day: DayCell) {
    emit("day-click", { date: day.date, count: day.count });
}
</script>

<!-- Tailwind-friendly background -->
<style>
.dp--clear-btn {
    display: none;
}
</style>
