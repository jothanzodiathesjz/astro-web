<template>
    <VueDatePicker
        v-model="dateValue"
        :dark="isDark"
        :auto-apply="true"
        :enable-time-picker="withTime"
        :range="
            withRange && {
                partialRange: withRange,
            }
        "
        :readonly="readonly"
    >
        <template #dp-input="{ value }">
            <TextInput
                :value="
                    value &&
                    new Date(value).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: '2-digit',
                    })
                "
                :icon="{
                    left: { name: 'fa-calendar' },
                }"
                :label="label"
                :placeholder="placeholder ?? ''"
                :readonly="readonly"
                :error="error"
                :hint="hint"
            >
                <template #suffix>
                    <IconButton
                        class="mr-2"
                        :size="'xs'"
                        :icon-name="'fa-circle-xmark'"
                        @click="
                            (e) => {
                                e.stopPropagation();
                                $emit('clear');
                            }
                        "
                    />
                </template>
            </TextInput>
            <!-- <input
              class="w-full px-2 py-3 border border-gray-300 dark:border-gray-600 outline-none rounded-lg placeholder:text-sm text-sm dark:text-gray-200 bg-white dark:bg-gray-800 focus:border-blue-200 dark:focus:border-blue-500"
              :class="[
                  readonly
                      ? 'bg-gray-100 dark:bg-gray-900'
                      : 'bg-white dark:bg-gray-800',
              ]"
              :value="
                  value &&
                  new Date(value).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'long',
                      year: '2-digit',
                  })
              "
              :placeholder="placeholder ?? ''"
          /> -->
        </template>
    </VueDatePicker>
</template>

<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";
import isDark from "@/core/ui/composables/dark";
import { onMounted } from "vue";
import TextInput from "./Text.input.vue";
import IconButton from "../button/Icon.button.vue";

// Mendefinisikan prop 'dateValue' sebagai v-model
const dateValue = defineModel<Date | Date[]>();

// Props lainnya tetap seperti biasa
const props = withDefaults(
    defineProps<{
        readonly?: boolean;
        placeholder?: string;
        withTime: boolean;
        withRange?: boolean;
        label?: string;
        error?: string[] | string;
        hint?: { link?: string; text: string };
    }>(),
    {
        readonly: false,
        placeholder: "",
        withTime: false,
    },
);

defineEmits<{
    (e: "clear"): void;
}>();

onMounted(() => {
    if (props.withRange) {
        const startDate = new Date();
        const endDate = new Date(new Date().setDate(startDate.getDate() + 7));
        dateValue.value = [startDate, endDate];
    }
});
</script>

<style scoped>

.dp__theme_dark {
    --dp-background-color: #1e2939;
    --dp-menu-border-color: #4a5565;
}

</style>
