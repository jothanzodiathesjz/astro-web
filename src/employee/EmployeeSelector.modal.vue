<template>
    <ModalContent
        :visible="visible"
        :header="'Select Employees'"
        :body-class="'w-full max-w-5xl mt-10'"
        :position="'top'"
        @close="handleCancel"
    >
        <div class="w-full h-full flex flex-col gap-5">
            <div class="flex flex-col gap-2">
                <TextInput
                    :value="search"
                    label="Search Employee"
                    placeholder="Cari nama atau ID karyawan"
                    :icon="{
                        left: {
                            name: 'fa-search',
                        },
                    }"
                    @input="(value) => (search = value)"
                />
                <div
                    class="flex flex-row flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400"
                >
                    <span>{{ employees.length }} hasil</span>
                    <span>Dipilih: {{ selectedEmployees.length }}</span>
                </div>
            </div>
            <div class="grid gap-5 lg:grid-cols-3">
                <div class="lg:col-span-2 flex flex-col gap-4">
                    <div
                        class="h-[50vh] overflow-auto rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/50 min-h-[320px]"
                    >
                        <div
                            v-if="loading"
                            class="flex items-center justify-center py-16 text-sm text-gray-500 dark:text-gray-400"
                        >
                            Loading employees...
                        </div>
                        <ul
                            v-else-if="employees.length"
                            class="divide-y divide-gray-100 dark:divide-gray-800"
                        >
                            <li
                                v-for="employee in employees"
                                :key="employee.uuid"
                                class="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
                            >
                                <CheckBox
                                    class="w-full"
                                    :model-value="isSelected(employee.uuid)"
                                    @update:model-value="
                                        (checked) =>
                                            toggleEmployee(employee, checked)
                                    "
                                >
                                    <div class="flex flex-col gap-0.5">
                                        <span
                                            class="text-sm font-semibold text-gray-800 dark:text-gray-100"
                                            >{{ employee.full_name }}</span
                                        >
                                        <span
                                            class="text-xs text-gray-500 dark:text-gray-400"
                                        >
                                            ID:
                                            {{ employee.employee_id || "-" }}
                                            <span
                                                v-if="employee.fingerprint_id"
                                            >
                                                • Fingerprint:
                                                {{ employee.fingerprint_id }}
                                            </span>
                                        </span>
                                        <span
                                            class="text-xs text-gray-500 dark:text-gray-400"
                                        >
                                            {{
                                                employee.employment?.department
                                                    ?.name || "No Department"
                                            }}
                                            <template
                                                v-if="
                                                    employee.employment
                                                        ?.job_title
                                                "
                                            >
                                                •
                                                {{
                                                    employee.employment
                                                        .job_title
                                                }}
                                            </template>
                                        </span>
                                    </div>
                                </CheckBox>
                            </li>
                        </ul>
                        <div
                            v-else
                            class="flex flex-col items-center justify-center gap-2 py-16 text-sm text-gray-500 dark:text-gray-400"
                        >
                            <span>Belum ada data karyawan.</span>
                        </div>
                    </div>
                    <div v-if="hasMore" class="flex flex-row justify-center">
                        <ButtonComponent
                            :variant="'outline'"
                            :loading="loadingMore"
                            @click="fetchEmployees(false)"
                        >
                            Load more
                        </ButtonComponent>
                    </div>
                </div>
                <div
                    class="h-[50vh] overflow-auto rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/40 p-4 flex flex-col gap-3"
                >
                    <div class="flex items-center justify-between">
                        <span
                            class="text-sm font-semibold text-gray-700 dark:text-gray-200"
                        >
                            Selected ({{ selectedEmployees.length }})
                        </span>
                        <button
                            v-if="selectedEmployees.length"
                            type="button"
                            class="text-xs text-blue-600 hover:underline dark:text-blue-400"
                            @click="clearSelection"
                        >
                            Clear all
                        </button>
                    </div>
                    <div class="flex-1 overflow-y-auto flex flex-col gap-3">
                        <div
                            v-if="!selectedEmployees.length"
                            class="text-sm text-gray-500 dark:text-gray-400"
                        >
                            Belum ada employee yang dipilih.
                        </div>
                        <div
                            v-for="employee in selectedEmployees"
                            :key="`selected-${employee.uuid}`"
                            class="flex flex-row items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm dark:border-gray-700 dark:bg-gray-900/60"
                        >
                            <div class="flex flex-col">
                                <span
                                    class="text-sm font-semibold text-gray-800 dark:text-gray-100"
                                    >{{ employee.full_name }}</span
                                >
                                <span
                                    class="text-xs text-gray-500 dark:text-gray-400"
                                >
                                    ID: {{ employee.employee_id || "-" }}
                                </span>
                            </div>
                            <IconButton
                                :icon-name="'fa-trash'"
                                :icon-color="'text-red-500 dark:text-red-400'"
                                @click="removeEmployee(employee.uuid)"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-row justify-end gap-3">
                <ButtonComponent :variant="'outline'" @click="handleCancel">
                    Cancel
                </ButtonComponent>
                <ButtonComponent
                    :variant="'primary'"
                    :disabled="!selectedEmployees.length"
                    @click="handleSave"
                >
                    Save Selection
                </ButtonComponent>
            </div>
        </div>
    </ModalContent>
</template>

<script setup lang="ts">
import ModalContent from "@/core/components/modal/Modal.content.vue";
import TextInput from "@/core/components/input/Text.input.vue";
import ButtonComponent from "@/core/components/button/Button.component.vue";
import IconButton from "@/core/components/button/Icon.button.vue";
import CheckBox from "@/core/components/CheckBox.vue";
import { container } from "@/container/di";
import { TOKENS } from "@/container/tokens";
import type { DomainEmployee } from "@/domain/models/Employee";
import type { IQueryMetadata } from "@/http-client/query-metadata";
import { computed, ref, watch } from "vue";
import { useDebounceFn } from "@vueuse/core";

const props = withDefaults(
    defineProps<{
        visible: boolean;
        selected?: DomainEmployee[];
        query?: Omit<IQueryMetadata, "cursor" | "search">;
    }>(),
    {
        selected: () => [],
        query: () => ({}),
    },
);

const emit = defineEmits<{
    (e: "close"): void;
    (e: "save", value: DomainEmployee[]): void;
    (e: "update:selected", value: DomainEmployee[]): void;
}>();

const repository = container.get(TOKENS.EmployeeRepository);

const search = ref("");
const employees = ref<DomainEmployee[]>([]);
const loading = ref(false);
const loadingMore = ref(false);
const cursor = ref<string | undefined>(undefined);
const selection = ref<Map<string, DomainEmployee>>(new Map());
const isModalOpen = ref(props.visible);
const visible = computed(() => props.visible);
const selectedEmployees = computed(() => Array.from(selection.value.values()));
const hasMore = computed(() => Boolean(cursor.value));
const loadedIds = new Set<string>();

const syncSelection = (items?: DomainEmployee[]) => {
    const next = new Map<string, DomainEmployee>();
    (items ?? []).forEach((employee) => {
        if (employee?.uuid) {
            next.set(employee.uuid, employee);
        }
    });
    selection.value = next;
};

const resetListState = () => {
    employees.value = [];
    cursor.value = undefined;
    loadedIds.clear();
    loading.value = false;
    loadingMore.value = false;
};

const buildQuery = (useCursor: boolean): IQueryMetadata => {
    const query: IQueryMetadata = {
        ...(props.query ?? {}),
    };
    const keyword = search.value.trim();
    if (keyword) {
        query.search = keyword;
    }
    if (useCursor && cursor.value) {
        query.cursor = cursor.value;
    }
    return query;
};

const fetchEmployees = async (reset = false) => {
    if (!isModalOpen.value) return;
    if (loading.value || loadingMore.value) return;
    if (!reset && !cursor.value) return;

    const state = reset ? loading : loadingMore;

    if (reset) {
        cursor.value = undefined;
        employees.value = [];
        loadedIds.clear();
    }

    state.value = true;
    try {
        const [data, nextCursor] = await repository.getALl(buildQuery(!reset));
        const mapped = data.filter((employee) => {
            if (loadedIds.has(employee.uuid)) {
                return false;
            }
            loadedIds.add(employee.uuid);
            return true;
        });
        employees.value = reset ? mapped : [...employees.value, ...mapped];
        cursor.value = nextCursor;
    } catch (error) {
        console.error("Failed to fetch employees", error);
    } finally {
        state.value = false;
    }
};

const toggleEmployee = (employee: DomainEmployee, checked: boolean) => {
    const next = new Map(selection.value);
    if (checked) {
        next.set(employee.uuid, employee);
    } else {
        next.delete(employee.uuid);
    }
    selection.value = next;
};

const removeEmployee = (uuid: string) => {
    const next = new Map(selection.value);
    next.delete(uuid);
    selection.value = next;
};

const clearSelection = () => {
    selection.value = new Map();
    emit("update:selected", []);
};

const isSelected = (uuid: string) => selection.value.has(uuid);

const handleSave = () => {
    const payload = selectedEmployees.value;
    emit("update:selected", payload);
    emit("save", payload);
    handleCancel();
};

const handleCancel = () => {
    emit("close");
};

const runSearch = useDebounceFn(() => {
    if (!isModalOpen.value) return;
    fetchEmployees(true);
}, 400);

watch(
    () => search.value,
    () => {
        runSearch();
    },
);

watch(
    () => props.visible,
    (value) => {
        isModalOpen.value = value;
        if (value) {
            syncSelection(props.selected);
            fetchEmployees(true);
        } else {
            search.value = "";
            resetListState();
        }
    },
    { immediate: true },
);

watch(
    () => props.selected,
    (value) => {
        if (!isModalOpen.value) {
            syncSelection(value);
        }
    },
    { deep: true, immediate: true },
);

watch(
    () => props.query,
    () => {
        if (isModalOpen.value) {
            fetchEmployees(true);
        }
    },
    { deep: true },
);
</script>

<style scoped></style>
