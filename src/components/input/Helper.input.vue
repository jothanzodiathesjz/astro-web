<template>
  <div
    class="flex flex-col w-full mt-2 helper"
    v-if="(helper.messages?.length ?? 0) > 0"
  >
    <div
      class="flex flex-row w-full mb-1 last:mb-0"
      v-for="(message, index) in messages_array"
      :key="index"
    >
      <span
        class="material-icons-round text-[17px] flex-shrink-0 mr-2"
        :class="attribute.color"
        >{{ attribute.icon }}</span
      >
      <span
        class="text-xs font-light text-red-500 capitalize"
        :class="attribute.color"
        >{{ message.replace(/\{\{\sfield\s\}\}/, field ?? "").trim() }}</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Helper } from "../models/Helper";

const $props = defineProps<{ helper: Helper; field?: string }>();

interface Attribute {
  icon: "error" | "warning" | "check_circle";
  color: "text-red-500" | "text-orange-500" | "text-green-500";
}

const messages_array = computed((): string[] => {
  if (typeof $props.helper.messages === "string") {
    return [$props.helper.messages];
  } else {
    return $props.helper.messages;
  }
});

const attribute = (function (): Attribute {
  switch ($props.helper.status) {
    case "error":
      return { icon: "error", color: "text-red-500" };
    case "warning":
      return { icon: "warning", color: "text-orange-500" };
    case "success":
      return { icon: "check_circle", color: "text-green-500" };
  }
})();
</script>

<style scoped></style>
