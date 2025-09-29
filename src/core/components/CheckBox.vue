<template>
    <label
        :for="componentId"
        class="flex items-center cursor-pointer select-none"
        :class="{ 'opacity-50 cursor-not-allowed': disabled }"
    >
        <input
            :id="componentId"
            v-model="isChecked"
            type="checkbox"
            :disabled="disabled"
            class="absolute w-0 h-0 opacity-0 peer"
        />

        <span
            class="relative flex items-center justify-center w-5 h-5 mr-2 transition-all duration-200 bg-white border-2 rounded"
            :class="[
                disabled ? 'border-gray-300' : 'border-gray-400',
                'peer-focus:ring-2 peer-focus:ring-offset-1 peer-focus:ring-blue-400',
                'peer-checked:border-blue-600', // <-- PERUBAHAN DI SINI
            ]"
        >
            <FontAwesomeIcon
                v-if="isChecked"
                icon="fa-solid fa-check"
                class="text-xs text-blue-600"
            />
        </span>

        <span class="text-gray-700">
            <slot>{{ label }}</slot>
        </span>
    </label>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { computed } from "vue";

// Define component properties (props)
interface Props {
    modelValue: boolean; // Required for v-model
    label?: string;
    id?: string;
    disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    label: "",
    id: undefined,
    disabled: false,
});

// Define component events (emits)
const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
}>();

// Generate a unique ID if one isn't provided, for label association
const componentId = computed(
    () => props.id || `checkbox-${Math.random().toString(36).substr(2, 9)}`,
);

// Computed property to handle v-model two-way binding
const isChecked = computed({
    get() {
        return props.modelValue;
    },
    set(newValue) {
        emit("update:modelValue", newValue);
    },
});
</script>
