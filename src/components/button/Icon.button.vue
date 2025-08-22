<template>
  <button
    class="flex items-center justify-center icon-button"
    :disabled="isDisabled"
    :class="isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'"
    @click="$emit('click')"
    @keypress.prevent
    :title="title ?? ''"
  >
    <font-awesome-icon
      :icon="[iconType ?? 'fa-solid', iconName]"
      class="transition-transform duration-500 text-gray-400 dark:text-gray-500"
      :size="size"
      :class="[
        isDisabled
          ? transition?.whenDisabled ?? ''
          : transition?.whenEnabled ?? '',
      ]"
    />
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

defineEmits<{ (e: "click"): void }>();
const $props = defineProps<{
  iconName: string;
  iconColor?: string;
  iconType?: "fa-solid" | "fa-regular";
  size?:
    | "2xs"
    | "xs"
    | "sm"
    | "lg"
    | "xl"
    | "2xl"
    | "1x"
    | "2x"
    | "3x"
    | "4x"
    | "5x"
    | "6x"
    | "7x"
    | "8x"
    | "9x"
    | "10x";
  disabled?: boolean | "true" | "false";
  transition?: {
    whenDisabled: string;
    whenEnabled?: string;
  };
  title?: string;
}>();

const isDisabled = computed(() => {
  return $props.disabled === true || $props.disabled === "true";
});
</script>

<style>
.icon-button:active {
  transform: scale(0.8);
}
</style>
