<template>
    <ModalContent
        :visible="summaryType ? true : false"
        :header="summaryHeader"
        :body-class="' mt-10'"
        :position="'top'"
        @close="emit('close')"
    >
        <div class="space-y-6">
            <section
                class="rounded-2xl border border-gray-200 bg-gray-50/80 p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/60"
            >
                <div
                    class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                >
                    <div class="flex items-center gap-4">
                        <div
                            class="flex h-14 w-14 items-center justify-center rounded-2xl border text-xl"
                            :class="summaryMeta.accent"
                        >
                            <font-awesome-icon
                                :icon="summaryMeta.icon"
                                class="text-lg"
                            />
                        </div>
                        <div class="flex flex-col gap-1">
                            <span
                                class="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400"
                            >
                                Status terpilih
                            </span>
                            <span
                                class="text-lg font-semibold text-gray-900 dark:text-gray-50"
                            >
                                {{ summaryMeta.label }}
                            </span>
                            <p
                                class="text-sm text-gray-500 dark:text-gray-400"
                            >
                                {{ summaryMeta.description }}
                            </p>
                        </div>
                    </div>
                    <div
                        class="rounded-xl bg-white px-4 py-3 text-right shadow-inner dark:bg-gray-900/60"
                    >
                        <p
                            class="text-xs font-semibold uppercase text-gray-400"
                        >
                            Total karyawan
                        </p>
                        <p
                            class="text-2xl font-bold text-gray-900 dark:text-gray-50"
                        >
                            {{ total }}
                        </p>
                    </div>
                </div>
            </section>

            <section
                class="relative rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900/60"
            >
                <div
                    class="flex items-center justify-between border-b border-gray-100 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:text-gray-400"
                >
                    <span>Daftar karyawan</span>
                </div>

                <div
                    ref="listContainer"
                    class="relative max-h-[28rem] overflow-y-auto custom-scrollbar"
                >
                    <div
                        v-if="loading"
                        class="space-y-4 px-5 py-4"
                    >
                        <div
                            v-for="index in skeletonItems"
                            :key="`skeleton-${index}`"
                            class="flex flex-col gap-4 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0 dark:border-gray-800"
                        >
                            <div class="flex items-center gap-4">
                                <div
                                    class="h-12 w-12 rounded-full border border-transparent bg-gray-200/80 dark:bg-gray-700 animate-pulse"
                                ></div>
                                <div class="flex-1 space-y-3">
                                    <div
                                        class="h-4 w-36 rounded bg-gray-200/80 dark:bg-gray-700 animate-pulse"
                                    ></div>
                                    <div
                                        class="h-3 w-24 rounded bg-gray-100 dark:bg-gray-800 animate-pulse"
                                    ></div>
                                </div>
                            </div>
                            <div class="flex flex-wrap gap-2">
                                <span
                                    class="h-7 w-28 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse"
                                ></span>
                                <span
                                    class="h-7 w-32 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse"
                                ></span>
                            </div>
                        </div>
                    </div>

                    <div
                        v-else-if="!employees.length"
                        class="flex min-h-[14rem] flex-col items-center justify-center gap-3 px-6 py-10 text-center text-gray-500 dark:text-gray-400"
                    >
                        <font-awesome-icon
                            icon="fa-solid fa-users"
                            class="text-2xl text-gray-400 dark:text-gray-600"
                        />
                        <p class="text-sm">Belum ada data untuk status ini.</p>
                    </div>

                    <ul
                        v-else
                        class="divide-y divide-gray-100 dark:divide-gray-800"
                    >
                        <li
                            v-for="employee in employees"
                            :key="employee.uuid"
                            class="flex flex-col gap-4 px-5 py-4 transition hover:bg-gray-50 dark:hover:bg-gray-800/50 sm:flex-row sm:items-center"
                        >
                            <div class="flex items-center gap-4">
                                <div
                                    class="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-sm font-semibold uppercase text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                >
                                    {{ getInitials(employee.full_name) }}
                                </div>
                                <div class="flex flex-col">
                                    <span
                                        class="text-sm font-semibold text-gray-900 dark:text-gray-100"
                                    >
                                        {{ employee.full_name }}
                                    </span>
                                    <span
                                        class="text-xs font-medium text-gray-500 dark:text-gray-400"
                                    >
                                        Nickname:
                                        {{ formatValue(employee.nick_name) }}
                                    </span>
                                </div>
                            </div>

                            <div
                                class="ml-auto flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400"
                            >
                                <span
                                    class="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 font-semibold text-gray-600 dark:border-gray-700 dark:text-gray-300"
                                >
                                    <font-awesome-icon
                                        icon="fa-solid fa-fingerprint"
                                    />
                                    {{ formatValue(employee.fingerprint_id) }}
                                </span>
                                <span
                                    class="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 font-semibold text-blue-600 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-200"
                                >
                                    <font-awesome-icon
                                        icon="fa-solid fa-id-card-clip"
                                    />
                                    {{ formatValue(employee.employee_id) }}
                                </span>
                            </div>
                        </li>
                    </ul>

                    <div
                        v-if="loadingMore && !loading && employees.length"
                        class="flex items-center gap-2 px-5 py-4 text-sm text-gray-500 dark:text-gray-400"
                    >
                        <font-awesome-icon
                            icon="fa-solid fa-spinner"
                            :spin-pulse="true"
                        />
                        <span>Memuat data berikutnya...</span>
                    </div>

                    <div ref="sentinelEl" class="h-2 w-full"></div>
                </div>
            </section>
        </div>
    </ModalContent>
</template>

<script setup lang="ts">
import ModalContent from "@/core/components/modal/Modal.content.vue";
import type { DomainEmployeeSummary } from "@/domain/models/Employee";
import { useIntersectionObserver } from "@vueuse/core";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
    faArrowRightFromBracket,
    faCircleCheck,
    faCircleXmark,
    faClock,
    faClockRotateLeft,
    faClipboardList,
    faDoorClosed,
    faDoorOpen,
    faFingerprint,
    faIdCardClip,
    faPlaneDeparture,
    faSpinner,
    faUmbrellaBeach,
    faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
    computed,
    nextTick,
    onMounted,
    onUnmounted,
    ref,
    toRefs,
    watch,
} from "vue";

library.add(
    faArrowRightFromBracket,
    faCircleCheck,
    faCircleXmark,
    faClock,
    faClockRotateLeft,
    faClipboardList,
    faDoorClosed,
    faDoorOpen,
    faFingerprint,
    faIdCardClip,
    faPlaneDeparture,
    faSpinner,
    faUmbrellaBeach,
    faUsers,
);

const props = withDefaults(
    defineProps<{
        data: DomainEmployeeSummary[];
        summaryType: string | null;
        loading?: boolean;
        loadingMore?: boolean;
        total?: number;
    }>(),
    {
        loading: false,
        loadingMore: false,
    },
);

const { data, summaryType, loading, loadingMore, total } = toRefs(props);

const emit = defineEmits<{
    (e: "close"): void;
    (e: "save"): void;
    (e: "paginate"): void;
}>();

type SummaryMeta = {
    label: string;
    description: string;
    accent: string;
    icon: IconDefinition;
};

const SUMMARY_META: Record<string, SummaryMeta> = {
    DEFAULT: {
        label: "Attendance Summary",
        description: "Daftar karyawan berdasarkan status yang dipilih.",
        accent:
            "border-blue-100 bg-blue-50 text-blue-600 dark:border-blue-500/60 dark:bg-blue-400/10 dark:text-blue-200",
        icon: faClipboardList,
    },
    ON_TIME: {
        label: "On Time",
        description: "Seluruh karyawan yang hadir tepat waktu hari ini.",
        accent:
            "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/50 dark:bg-emerald-500/10 dark:text-emerald-200",
        icon: faCircleCheck,
    },
    LATE: {
        label: "Late Clock In",
        description: "Karyawan yang terlambat melakukan clock in.",
        accent:
            "border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-500/50 dark:bg-amber-500/10 dark:text-amber-200",
        icon: faClock,
    },
    EARLY_LEAVE: {
        label: "Early Leave",
        description: "Daftar karyawan yang pulang sebelum waktunya.",
        accent:
            "border-purple-200 bg-purple-50 text-purple-600 dark:border-purple-500/60 dark:bg-purple-500/10 dark:text-purple-200",
        icon: faArrowRightFromBracket,
    },
    OVER_TIME: {
        label: "Overtime",
        description: "Karyawan yang melakukan lembur.",
        accent:
            "border-indigo-200 bg-indigo-50 text-indigo-600 dark:border-indigo-500/60 dark:bg-indigo-500/10 dark:text-indigo-200",
        icon: faClockRotateLeft,
    },
    ABSENT: {
        label: "Absent",
        description: "Karyawan yang tidak hadir hari ini.",
        accent:
            "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-500/60 dark:bg-rose-500/10 dark:text-rose-200",
        icon: faCircleXmark,
    },
    NO_CHECK_IN: {
        label: "No Clock In",
        description: "Belum terekam check in di sistem.",
        accent:
            "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-500/60 dark:bg-slate-500/10 dark:text-slate-200",
        icon: faDoorOpen,
    },
    NO_CHECK_OUT: {
        label: "No Clock Out",
        description: "Belum terekam check out di sistem.",
        accent:
            "border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-500/60 dark:bg-gray-500/10 dark:text-gray-200",
        icon: faDoorClosed,
    },
    DAY_OFF: {
        label: "Day Off",
        description: "Karyawan yang sedang menjalani hari libur.",
        accent:
            "border-cyan-200 bg-cyan-50 text-cyan-600 dark:border-cyan-500/60 dark:bg-cyan-500/10 dark:text-cyan-200",
        icon: faUmbrellaBeach,
    },
    TIME_OFF: {
        label: "Time Off",
        description: "Izin cuti atau dinas luar kantor.",
        accent:
            "border-teal-200 bg-teal-50 text-teal-600 dark:border-teal-500/60 dark:bg-teal-500/10 dark:text-teal-200",
        icon: faPlaneDeparture,
    },
};

const summaryMeta = computed(() => {
    if (!summaryType.value) return SUMMARY_META.DEFAULT;
    return SUMMARY_META[summaryType.value] || SUMMARY_META.DEFAULT;
});

const summaryHeader = computed(() =>
    summaryType.value
        ? `Attendance Summary - ${summaryMeta.value.label}`
        : "Attendance Summary",
);

const employees = computed(() => data.value || []);

const listContainer = ref<HTMLDivElement | null>(null);
const sentinelEl = ref<HTMLDivElement | null>(null);
let stopObserver: (() => void) | undefined;
const skeletonItems = 6;

onMounted(() => {
    const { stop } = useIntersectionObserver(
        sentinelEl,
        (entries) => {
            entries.forEach((entry) => {
                if (
                    entry.isIntersecting &&
                    !loading.value &&
                    !loadingMore.value
                ) {
                    emit("paginate");
                }
            });
        },
        {
            root: listContainer,
            threshold: 0.2,
        },
    );
    stopObserver = stop;
});

onUnmounted(() => {
    stopObserver?.();
});

watch(
    () => summaryType.value,
    async () => {
        await nextTick();
        if (listContainer.value) {
            listContainer.value.scrollTop = 0;
        }
    },
);

const getInitials = (name?: string) => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    const initials = parts.slice(0, 2).map((part) => part[0] || "");
    return initials.join("").toUpperCase() || "?";
};

const formatValue = (value?: string | null) => {
    if (!value) return "-";
    const formatted = `${value}`.trim();
    return formatted.length ? formatted : "-";
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(148, 163, 184, 0.6);
    border-radius: 9999px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background-color: transparent;
}
</style>
