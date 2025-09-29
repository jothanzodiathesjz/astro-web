<template>
    <div>
        <Modal
            v-model="showModal"
            :close-self="false"
            :content-class="contentClass ? contentClass : '-top-14'"
            :position="'center'"
        >
            <div class="flex flex-col justify-center min-w-[500px]">
                <div
                    class="flex py-3 px-5 w-full border-b border-gray-200 dark:border-gray-700"
                >
                    <span
                        class="font-semibold text-dark-main dark:text-gray-300"
                        >{{ header }}</span
                    >
                </div>
                <div class="w-full h-full flex flex-col gap-5 items-center p-5">
                    <FontAwesomeIcon
                        class="text-3xl text-gray-700 dark:text-gray-300"
                        :icon="['fa-solid', $props.icon]"
                    />
                    <span class="text-center w-[80%] dark:text-gray-300">{{
                        message
                    }}</span>
                    <div
                        class="flex flex-row p-2 justify-end gap-4 items-center"
                    >
                        <ButtonComponent
                            :variant="'secondary'"
                            @click="$emit('cancel')"
                            >{{
                                customLabelButton?.cancel || "Cancel"
                            }}</ButtonComponent
                        >
                        <ButtonComponent
                            :variant="'primary'"
                            :disabled="disabled"
                            @click="$emit('confirm')"
                            >{{
                                customLabelButton?.confirm || "Confirm"
                            }}</ButtonComponent
                        >
                    </div>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import { ref, watch } from "vue";
import ButtonComponent from "../button/Button.component.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Modal from "./Modal.vue";

const $props = defineProps<{
    visible: boolean;
    header: string;
    icon: string;
    message: string;
    disabled?: boolean;
    contentClass?: string;
    customLabelButton?: {
        confirm: string;
        cancel: string;
    };
}>();

const $emit = defineEmits<{
    (e: "confirm"): void;
    (e: "cancel"): void;
}>();

const showModal = ref<boolean>($props.visible);

watch(
    () => $props.visible,
    (newVal) => {
        showModal.value = newVal;
    },
);
</script>

<style scoped></style>
