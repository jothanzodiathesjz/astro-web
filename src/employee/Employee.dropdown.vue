<template>
    <TextDropdownInput
        :label="labelText"
        :options="employeeOptions"
        :selected="selectedOption"
        :dontfilter="true"
        :with-clear="withClear"
        :placeholder="placeholderText"
        :debounce="300"
        @update="handleSelect"
        @clear="handleClear"
        @input="handleSearch"
        @paginate="loadMore"
    />
</template>

<script setup lang="ts">
import { container } from "@/container/di";
import { TOKENS } from "@/container/tokens";
import TextDropdownInput from "@/core/components/input/TextDropdown.input.vue";
import { DropdownLabel } from "@/core/components/models/DropdownLabel";
import type {
    DomainEmployee,
    DomainEmployeeSummary,
} from "@/domain/models/Employee";
import type { IQueryMetadata } from "@/http-client/query-metadata";
import { computed, onMounted, ref, watch } from "vue";

type EmployeeSelection = {
    uuid: string;
    full_name: string;
    employee_id: string;
    employment?: DomainEmployee["employment"];
};

const $props = defineProps<{
    selected: EmployeeSelection | DomainEmployeeSummary | null;
    label?: string;
    placeholder?: string;
    withClear?: boolean;
    query?: Omit<IQueryMetadata, "cursor" | "search">;
}>();

const $emit = defineEmits<{
    (e: "select", option: DomainEmployee): void;
    (e: "clear"): void;
}>();

const repository = container.get(TOKENS.EmployeeRepository);
const employeeOptions = ref<DropdownLabel<DomainEmployee>[]>([]);
const cursor = ref<string | undefined>(undefined);
const search = ref("");
const loading = ref(false);
const loadedIds = new Set<string>();
let activeFetchToken = 0;

const labelText = computed(() => $props.label ?? "Employee");
const placeholderText = computed(() => $props.placeholder ?? "Select Employee");
const withClear = computed(() => $props.withClear !== false);

const formatEmployeeLabel = (
    employee: EmployeeSelection | DomainEmployee | DomainEmployeeSummary,
) => {
    const idLabel = employee.employee_id ? ` (${employee.employee_id})` : "";
    return `${employee.full_name}${idLabel}`;
};

const selectedOption = computed<DropdownLabel | null>(() => {
    if (!$props.selected) return null;
    return {
        id: $props.selected.uuid,
        label: formatEmployeeLabel($props.selected),
        value: $props.selected,
    };
});

const buildQuery = (useCursor: boolean): IQueryMetadata => {
    const query: IQueryMetadata = {
        ...($props.query ?? {}),
    };
    if (search.value) {
        query.search = search.value;
    }
    if (useCursor && cursor.value) {
        query.cursor = cursor.value;
    }
    return query;
};

const fetchEmployees = async (reset = false) => {
    if (!reset && loading.value) return;
    if (!reset && !cursor.value) return;
    const token = ++activeFetchToken;
    if (reset) {
        cursor.value = undefined;
        employeeOptions.value = [];
        loadedIds.clear();
    }
    loading.value = true;
    try {
        const [data, nextCursor] = await repository.getALl(
            buildQuery(!reset),
        );

        if (token !== activeFetchToken) return;
        const mapped = data
            .filter((employee) => {
                if (loadedIds.has(employee.uuid)) {
                    return false;
                }
                loadedIds.add(employee.uuid);
                return true;
            })
            .map((employee) => {
                return {
                    id: employee.uuid,
                    label: formatEmployeeLabel(employee),
                    value: employee,
                } as DropdownLabel<DomainEmployee>;
            });

        employeeOptions.value = reset
            ? mapped
            : [...employeeOptions.value, ...mapped];

        cursor.value = nextCursor;
    } catch (error) {
        console.error("Failed to fetch employees", error);
    } finally {
        if (token === activeFetchToken) {
            loading.value = false;
        }
    }
};

const handleSelect = (option: DropdownLabel<DomainEmployee>) => {
    $emit("select", option.value);
};

const handleSearch = (value: string) => {
    if (search.value === value) return;
    search.value = value;
    fetchEmployees(true);
};

const handleClear = () => {
    $emit("clear");
    search.value = "";
    fetchEmployees(true);
};

const loadMore = () => {
    if (!cursor.value) return;
    fetchEmployees(false);
};

onMounted(() => {
    fetchEmployees(true);
});

watch(
    () => $props.query,
    () => {
        fetchEmployees(true);
    },
    { deep: true },
);
</script>
