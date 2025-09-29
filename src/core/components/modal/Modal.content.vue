<template>
    <Modal
        v-model="$props.visible"
        :close-self="closeSelf"
        :content-class="bodyClass"
        :position="position"
        @close-self="$emit('close')"
    >
        <div
            class="flex flex-col justify-center min-w-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-lg"
        >
            <div
                class="flex py-3 px-5 w-full justify-between border-b border-neutral-200 dark:border-gray-700"
            >
                <span class="font-semibold text-gray-900 dark:text-white">{{
                    header
                }}</span>
                <IconButton :icon-name="'close'" @click="$emit('close')" />
            </div>
            <div class="w-full h-full flex flex-col gap-5 items-center p-3">
                <slot></slot>
            </div>
        </div>
    </Modal>
</template>

<script setup lang="ts">
import IconButton from "../button/Icon.button.vue";
import Modal from "./Modal.vue";
import { defineProps, defineEmits } from "vue";
const $props = defineProps<{
    visible: boolean;
    header: string;
    closeSelf?: boolean;
    bodyClass?: string;
    position?: "top" | "center" | "bottom";
}>();

const $emit = defineEmits<{
    (e: "close"): void;
}>();
</script>
