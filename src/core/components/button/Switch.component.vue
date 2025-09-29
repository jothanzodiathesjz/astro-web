<template>
    <div
        class="w-10 rounded-full flex flex-row items-center cursor-pointer p-1 transition-colors duration-200"
        :class="
            checked
                ? 'justify-end bg-purple-500 dark:bg-purple-600'
                : 'justify-start bg-gray-300 dark:bg-gray-700'
        "
        @click="$emit('click')"
    >
        <div
            class="w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200"
            :class="checked ? 'translate-x-0' : 'translate-x-0'"
        ></div>
    </div>
</template>

<script setup lang="ts">
defineProps<{ checked: boolean }>();
defineEmits<{
    (e: "click"): void;
}>();
</script>
