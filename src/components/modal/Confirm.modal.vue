<template>
  <div>
    <Modal v-model="showModal" :close-self="false" content-class="-top-14">
      <div class="flex flex-col justify-center min-w-[500px]">
        <div class="flex py-3 px-5 w-full border-b border-neutral-50/20">
          <span class="font-semibold text-dark-main text-xl">{{ header }}</span>
        </div>
        <div class="w-full h-full flex flex-col gap-5 items-center p-5">
          <span
            style="font-size: 70px"
            class="material material-icons text-danger-hover text-center animate-heartbeat"
            >{{ icon }}</span
          >
          <span class="text-center w-[80%]">{{ message }}</span>
          <div class="flex flex-row p-2 justify-end gap-4 items-center">
            <ButtonComponent :variant="'secondary'" @click="$emit('cancel')"
              >Cancel</ButtonComponent
            >
            <ButtonComponent
              :variant="'primary'"
              :disabled="disabled"
              @click="$emit('confirm')"
              >Confirm</ButtonComponent
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

const $props = defineProps<{
  visible: boolean;
  header: string;
  icon: string;
  message: string;
  disabled?: boolean;
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
  }
);
</script>

<style scoped></style>
