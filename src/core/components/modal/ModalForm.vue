<template>
    <div>
        <transition name="fade" @after-enter="overlayVisible = true">
            <div
                v-if="overlayVisible"
                class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
                @click.self="closeSelf ? $emit('close-self') : ''"
            >
                <transition name="pop-up">
                    <div
                        v-if="contentVisible"
                        class="fixed w-full max-h-screen left-0 z-50 bottom-0 flex flex-col pb-20 rounded-t-md border border-neutral-80 bg-off-white"
                    >
                        <div
                            class="w-full py-2 p-3 flex flex-row justify-between items-center border-b bg-white border-neutral-50/25"
                        >
                            <span class="text-lg font-semibold">{{
                                header
                            }}</span>
                            <button
                                class="flex justify-center items-center p-2 hover:scale-105"
                            >
                                <span
                                    class="material-icons-outlined text-2xl"
                                    @click="$emit('close')"
                                    >close</span
                                >
                            </button>
                        </div>
                        <slot></slot>
                    </div>
                </transition>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from "vue";

const $props = defineProps<{
    visible: boolean;
    header: string;
    closeSelf?: boolean;
}>();

const overlayVisible = ref($props.visible);
const contentVisible = ref(overlayVisible.value);

const $emit = defineEmits<{
    (e: "close-self"): (v: boolean) => void;
    (e: "close"): void;
}>();

watch(
    () => $props.visible,
    (newVal, _oldVal) => {
        if (newVal === false) {
            contentVisible.value = newVal;
            setTimeout(() => {
                overlayVisible.value = newVal;
            }, 100);
        } else {
            overlayVisible.value = newVal;
            setTimeout(() => {
                contentVisible.value = newVal;
            }, 100);
        }
    },
);
</script>
