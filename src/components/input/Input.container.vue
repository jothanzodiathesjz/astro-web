<template>
  <div class="flex flex-col w-full">
    <div
      class="flex flex-row w-full justify-between mb-1 items-center"
      v-if="label"
    >
      <span class="text-sm label dark:text-gray-300">{{ label }}</span>
      <a
        :href="hint.link"
        rel="noreferrer nooppener nofollow"
        target="_blank"
        v-if="hint && hint.link"
        class="text-xs font-light text-blue-800 dark:text-blue-500 transition-colors duration-300"
      >
        {{ hint.text }}
      </a>
      <span
        class="text-xs font-light text-gray-400 dark:text-gray-500"
        v-if="hint && !hint.link"
      >
        {{ hint.text }}
      </span>
      <span
        class="text-xs font-light text-gray-400 dark:text-gray-500"
        v-if="isOptional && !hint"
      >
        Opsional
      </span>
    </div>
    <div class="flex flex-row w-full items-center gap-5">
      <div
        class="flex flex-row w-full placeholder:text-gray-300 dark:placeholder:text-gray-500 rounded-lg placeholder:font-light placeholder:text-sm items-center input-container transition-colors duration-300 overflow-hidden"
        :class="[
          border,
          isReadonly
            ? 'bg-gray-100 dark:bg-gray-900 cursor-not-allowed'
            : 'bg-white dark:bg-gray-800 cursor-text',
        ]"
      >
        <slot name="prefix"></slot>
        <slot></slot>
        <slot name="postfix"></slot>
        <slot name="suffix"></slot>
      </div>
      <slot name="actions"></slot>
    </div>

    <HelperInput v-if="helper" :helper="helper"></HelperInput>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import HelperInput from "./Helper.input.vue";
import type { Helper } from "../models/Helper";

const $props = defineProps<{
  focused: boolean;
  label?: string;
  readonly?: boolean | "true" | "false";
  optional?: boolean | "true" | "false";
  hint?: { link?: string; text: string }; // no longer than 8 characters
  helper?: Helper;
  borderClass?: string;
}>();

const isReadonly = computed<boolean>((): boolean => {
  return $props.readonly === "true" || $props.readonly === true;
});

const isOptional = computed<boolean>((): boolean => {
  return $props.optional === "true" || $props.optional === true;
});

const border = computed((): string => {
  if ($props.borderClass) return $props.borderClass;
  if ($props.focused) {
    if ($props.helper?.status === "error") {
      return "border border-red-200 dark:border-red-500";
    } else if ($props.helper?.status === "warning") {
      return "border border-orange-200 dark:border-orange-500";
    } else if ($props.helper?.status === "success") {
      return "border border-green-200 dark:border-green-500";
    } else {
      return "border border-blue-200 dark:border-blue-500";
    }
  }

  if ($props.helper?.status === "error") {
    return "border border-red-300 dark:border-red-600";
  } else if ($props.helper?.status === "warning") {
    return "border border-orange-300 dark:border-orange-600";
  } else if ($props.helper?.status === "success") {
    return "border border-green-300 dark:border-green-600";
  } else {
    return "border border-gray-300 dark:border-gray-600";
  }
});
</script>

<style lang="scss" scoped></style>
