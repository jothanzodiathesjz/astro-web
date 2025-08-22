<template>
  <button
    :class="[
      baseClass,
      variantClasses,
      { 'opacity-75 cursor-not-allowed': disabled },
    ]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <font-awesome-icon
      v-if="iconName"
      :icon="['fa-solid', iconName]"
      class="mr-2 text-gray-400 dark:text-gray-500"
    />

    <span v-if="hasDefaultSlot">
      <slot></slot>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed, useSlots } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus, faTrash, faGear } from "@fortawesome/free-solid-svg-icons";

// Tambahkan ikon yang dibutuhkan ke library
library.add(faPlus, faTrash, faGear);

const props = defineProps<{
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
  disabled?: boolean;
  iconName?: string; // Nama ikon dari Font Awesome (contoh: 'plus', 'trash')
}>();

const emit = defineEmits(["click"]);

const slots = useSlots();
const hasDefaultSlot = computed(() => !!slots.default);

const baseClass =
  "rounded-lg cursor-pointer text-sm py-2.5 px-6 transition-all duration-300 flex items-center justify-center";

const variantClasses = computed(() => {
  switch (props.variant) {
    case "secondary":
      return "bg-gray-200 hover:bg-gray-300 text-gray-800 dark:hover:bg-gray-600 dark:text-gray-200";
    case "danger":
      return "bg-red-600 hover:bg-red-700 text-white";
    case "outline":
      return "border border-gray-300 hover:bg-gray-100 text-gray-700 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-300";
    case "ghost":
      return "bg-transparent hover:bg-gray-100 text-gray-700 dark:hover:bg-gray-700 dark:text-gray-300";
    case "primary":
    default:
      return "bg-blue-600 hover:bg-blue-700 text-white";
  }
});
</script>

<style scoped>
/* Tambahkan gaya kustom jika diperlukan */
</style>
