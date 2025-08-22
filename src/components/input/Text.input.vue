<template>
  <InputContainer
    :focused="focused"
    :label="label"
    :readonly="readonly"
    :optional="optional"
    :icon="icon"
    :helper="helper"
    :hint="hint"
  >
    <template #prefix>
      <FontAwesomeIcon
        v-if="icon?.left"
        :icon="['fa-solid', icon.left.name]"
        class="left-icon pl-2 text-gray-400 dark:text-gray-500"
      />
    </template>
    <input
      class="w-full px-2 py-3 outline-none rounded placeholder:text-sm text-sm dark:text-gray-200"
      :class="[
        isReadonly
          ? 'bg-gray-100 dark:bg-gray-900'
          : 'bg-white dark:bg-gray-800',
      ]"
      :type="isHidden && !overrideHidden ? 'password' : 'text'"
      @focus="[(focused = true), $emit('focus')]"
      @keypress.enter="$emit('enter')"
      @blur="[(focused = false), $emit('blur')]"
      :placeholder="placeholder ?? ''"
      :value="value"
      @input="debouncedHandleInput(($event.target as HTMLInputElement).value)"
      :readonly="isReadonly"
    />
    <template #postfix>
      <div class="icon-container pr-2 h-full flex items-center w-min">
        <!-- <IconButton
          v-if="isHidden"
          size="sm"
          :icon-name="overrideHidden ? 'eye' : 'eye-slash'"
          :icon-type="'fa-solid'"
          :icon-color="'bg-gray-400 dark:bg-gray-500'"
          @click="overrideHidden = !overrideHidden"
        /> -->
        <FontAwesomeIcon
          v-if="icon?.right && !isHidden"
          :icon="icon.right"
          class="right-icon transition-transform transform duration-500 text-gray-400 dark:text-gray-500"
          :class="[
            iconClass ?? '',
            icon.right.name === 'data_usage'
              ? 'animate-spin text-primary-hover'
              : '',
          ]"
        />
        <button
          class="cursor-crosshair"
          v-if="isHidden"
          @click="overrideHidden = !overrideHidden"
        >
          {{ overrideHidden ? "👀" : "🙈" }}
        </button>
      </div>
    </template>

    <template #suffix><slot name="suffix"></slot></template>
    <template #actions><slot name="actions"></slot></template>
  </InputContainer>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { Helper } from "../models/Helper";
import InputContainer from "./Input.container.vue";
import { useDebounceFn } from "@vueuse/core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import type { AwesomeIcon } from "../models/AwesomeIcon";
// import IconButton from "../button/Icon.button.vue";

const $emit = defineEmits<{
  (e: "input", value: string): void;
  (e: "focus"): void;
  (e: "blur"): void;
  (e: "enter"): void;
}>();

const overrideHidden = ref(false);

const $props = defineProps<{
  value: string;
  label?: string;
  hidden?: boolean | "true" | "false";
  placeholder?: string;
  readonly?: boolean | "true";
  optional?: boolean | "true";
  debounce?: number;
  iconClass?: string;
  hint?: {
    link?: string;
    text: string;
  };
  icon?: {
    left?: AwesomeIcon;
    right?: AwesomeIcon;
  };
  error?: string[] | string;
  success?: string[] | string;
}>();

const debouncedHandleInput = useDebounceFn((value: string) => {
  $emit("input", value.trimStart());
}, $props.debounce ?? 0);

const focused = ref<boolean>(false);

const isReadonly = computed(() => {
  return $props.readonly === true || $props.readonly === "true";
});

const isHidden = computed(() => {
  return $props.hidden === true || $props.hidden === "true";
});

const helper = computed((): Helper | undefined => {
  if ($props.success) {
    return {
      status: "success",
      messages: $props.success,
    };
  }
  if ($props.error) {
    return {
      status: "error",
      messages: $props.error,
    };
  }
  return undefined;
});
</script>

<style scoped></style>
