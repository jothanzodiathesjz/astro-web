<template>
  <transition name="fade" @after-enter="isVisible = true">
    <div
      v-if="isVisible"
      class="fixed inset-0 bg-black/50 z-50 flex justify-center items-center"
      @click.self="closeSelf ? $emit('close-self') : ''"
    >
      <transition name="trans-down">
        <div
          v-if="childVisible"
          class="bg-white dark:bg-gray-800 relative rounded-lg shadow-lg"
          :class="contentClass"
        >
          <slot></slot>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

interface Props {
  modelValue: boolean;
  closeSelf?: boolean;
  contentClass?: string;
}

const props = defineProps<Props>();
const $emit = defineEmits<{
  (e: "close-self"): (v: boolean) => void;
  (e: "update:modelValue", value: boolean): void;
}>();

const isVisible = ref(props.modelValue);
const childVisible = ref(isVisible.value);

watch(
  () => props.modelValue,
  (newVal, _oldVal) => {
    if (newVal === false) {
      childVisible.value = newVal;
      setTimeout(() => {
        isVisible.value = newVal;
      }, 100);
    } else {
      isVisible.value = newVal;
      setTimeout(() => {
        childVisible.value = newVal;
      }, 100);
    }
  }
);
</script>

<style scoped></style>
