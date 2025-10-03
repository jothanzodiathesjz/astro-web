<template>
    <div class="w-full flex flex-col gap-1">
        <span v-if="label" class="dark:text-gray-200 text-sm"
            >{{ label }}
            <span
                v-if="!isOptional"
                class="text-xs text-red-600 dark:text-red-400"
                >*</span
            ></span
        >
        <div
            ref="dropdownContainer"
            class="relative flex flex-row gap-4 border bg-white dark:bg-gray-800 items-center rounded-lg"
            :class="
                showDropdown
                    ? ' border-blue-200 dark:border-blue-500'
                    : 'border-gray-300 dark:border-gray-700'
            "
        >
            <div class="px-3 flex items-center gap-3 justify-between w-full">
                <IconButton
                    v-if="iconname"
                    :disabled="true"
                    :icon-name="iconname"
                    :icon-type="'fa-solid'"
                />
                <input
                    ref="inputRef"
                    v-model="searchQuery"
                    class="bg-transparent text-sm py-3 w-full focus:outline-none dark:text-gray-200"
                    type="text"
                    :placeholder="placeholder"
                    @focus="handleFocus"
                    @blur="handleBlur"
                    @input="
                        filterOptions(($event.target as HTMLInputElement).value)
                    "
                />
                <IconButton
                    v-if="withClear"
                    :icon-name="'fa-circle-xmark'"
                    :size="'xs'"
                    @click="[$emit('clear'), (searchQuery = '')]"
                />
                <FontAwesomeIcon
                    icon="fa-solid fa-chevron-down"
                    class="text-gray-400 dark:text-gray-500"
                    :class="showDropdown ? 'rotate-180' : ''"
                    :size="'xs'"
                />
            </div>
            <Transition name="slide">
                <ul
                    v-if="showDropdown"
                    class="absolute w-full z-10 max-h-72 bg-white dark:bg-gray-800 border border-gray-300 dark:border-blue-600 rounded-md overflow-auto"
                    :class="
                        dropdownDirection === 'up'
                            ? 'bottom-full mb-2'
                            : 'top-full mt-2'
                    "
                >
                    <li
                        v-for="option in filteredOptions"
                        v-if="filteredOptions.length > 0"
                        :key="option.id"
                        class="w-full flex flex-row justify-between"
                    >
                        <div
                            class="hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 text-sm dark:text-gray-200 rounded px-3 py-3 w-full cursor-pointer"
                            :class="
                                selected?.id === option.id
                                    ? 'font-semibold bg-blue-100'
                                    : ''
                            "
                            @click="selectOption(option)"
                        >
                            {{ option.label }}
                        </div>
                        <IconButton
                            v-if="with_delete"
                            :icon-name="'fa-trash'"
                            @click="$emit('remove', option.value)"
                        />
                    </li>
                    <li v-else>
                        <div
                            class="w-full flex flex-col gap-1 items-center py-3"
                        >
                            <span class="text-sm dark:text-gray-200"
                                >No Result Found</span
                            >
                            <ButtonComponent
                                v-if="adding_button"
                                :variant="'outline'"
                                :icon="{
                                    name: 'fa-add',
                                }"
                                @click="$emit('add', searchQuery)"
                            >
                                Tambahkan Item
                            </ButtonComponent>
                        </div>
                    </li>
                </ul>
            </Transition>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { DropdownLabel } from "@/core/components/models/DropdownLabel";
import { useDebounceFn } from "@vueuse/core";
import IconButton from "../button/Icon.button.vue";
import ButtonComponent from "../button/Button.component.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// Props definition
const props = defineProps<{
    options: DropdownLabel[];
    selected: DropdownLabel | null;
    dontfilter?: boolean;
    placeholder?: string;
    iconname?: string;
    withClear?: boolean;
    adding_button?: boolean;
    with_delete?: boolean;
    debounce?: number;
    label?: string;
    isOptional?: boolean;
}>();

const $emit = defineEmits<{
    (e: "update", value: DropdownLabel): void;
    (e: "clear"): void;
    (e: "add", value: string): void;
    (e: "remove", value: string): void;
    (e: "input", value: string): void;
    (e: "clear"): void;
}>();

const searchQuery = ref("");
const showDropdown = ref(false);
const dropdownDirection = ref<"up" | "down">("down");
const inputRef = ref<HTMLElement | null>(null);
const dropdownContainer = ref<HTMLElement | null>(null);

const filteredOptions = computed(() => {
    return props.options.filter((option) => {
        if (props.dontfilter) {
            return option;
        }
        return option.label
            .toLowerCase()
            .includes(searchQuery.value?.toLowerCase() || "");
    });
});

const filterOptions = useDebounceFn((v) => {
    searchQuery.value = v;
    showDropdown.value = true;
    $emit("input", v);
    nextTick(determineDropdownDirection);
}, props.debounce || 0);

const selectOption = (option: DropdownLabel) => {
    searchQuery.value = option.label;
    showDropdown.value = false;
    $emit("update", option);
};

const hideDropdown = () => {
    // Timeout to allow click event to register before hiding
    setTimeout(() => {
        showDropdown.value = false;
    }, 200);
};

const handleFocus = () => {
    showDropdown.value = true;
    nextTick(determineDropdownDirection);
};

const handleBlur = () => {
    hideDropdown();
};

const determineDropdownDirection = () => {
    if (inputRef.value && dropdownContainer.value) {
        const inputRect = inputRef.value.getBoundingClientRect();
        // const containerRect = dropdownContainer.value.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const spaceBelow = windowHeight - inputRect.bottom;
        const spaceAbove = inputRect.top;

        dropdownDirection.value = spaceBelow > spaceAbove ? "down" : "up";
    }
};

onMounted(() => {
    if (inputRef.value) {
        determineDropdownDirection();
    }
    if (props.selected) {
        searchQuery.value = props.selected?.label!;
    }
});

watch(
    () => props.selected,
    (newval) => {
        if (props.selected) {
            searchQuery.value = newval?.label!;
            console.log(newval?.label);
        } else {
            searchQuery.value = "";
            console.log(newval?.label);
        }
    },
);
</script>

<style scoped>
/* .dropdown-container {
    position: relative;
} */
</style>
