<template>
    <div
        class=""
    >
        <Toast
            :duration="vm.alerts?.duration"
            :message="vm.alerts?.message ?? ''"
            :show="vm.alerts ? true : false"
            @on-close="vm.alerts = null"
        />
        <div
            class="w-full flex flex-col items-start gap-4 py-3 mt-3 md:flex-row md:items-center"
        >
            <ButtonComponent
                @click="$router.back()"
                :variant="'outline'"
                :icon-name="'fa-angle-left'"
                >Back</ButtonComponent
            >
            <div class="w-full flex flex-row flex-wrap gap-3 items-center">
                <span
                    @click="$router.back()"
                    class="font-semibold text-blue-600 dark:text-gray-200 cursor-pointer"
                    >Shift</span
                >
                <IconButton :icon-name="'fa-angle-right'" />
                <span class="font-semibold text-gray-800 dark:text-gray-200"
                    >{{ vm.isUpdate ? "Detail" : "Form" }} Shift</span
                >
            </div>
        </div>

        <div
            class="w-full flex flex-col mt-5 px-4 py-4 gap-5 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-700 sm:px-6"
        >
            <span class="font-semibold dark:text-gray-200"
                >Shift Information</span
            >
            <div class="w-full flex flex-col gap-4 md:flex-row">
                <TextInput
                    :value="vm.data.name"
                    :placeholder="'Name'"
                    :label="'Name'"
                    :error="vm.formErrors.name"
                    @input="
                        (value) => {
                            vm.data.name = value;
                            vm.clearFieldError('name');
                        }
                    "
                />
                <TextInput
                    :value="vm.data.code"
                    :placeholder="'Code'"
                    :label="'Code'"
                    :error="vm.formErrors.code"
                    @input="
                        (value) => {
                            vm.data.code = value;
                            vm.clearFieldError('code');
                        }
                    "
                />
            </div>
            <div class="w-full flex flex-col gap-4 md:flex-row">
                <div class="w-full flex flex-col gap-2 pr-2">
                    <TextDropdownInput
                        :options="vm.labelDropdown"
                        :selected="selectedLabel"
                        :dontfilter="true"
                        label="Label"
                        placeholder="Select Label"
                        @update="
                            (v: DropdownLabel<Labels>) => {
                                vm.data.label = v.value.value;
                                vm.clearFieldError('label');
                            }
                        "
                    />
                    <span
                        v-if="vm.formErrors.label.length"
                        class="text-xs text-red-600 dark:text-red-400"
                        >{{ vm.formErrors.label[0] }}</span
                    >
                </div>
                <div class="w-full flex flex-col gap-2 pr-2">
                    <TextDropdownInput
                        :options="vm.typeDropdown"
                        :selected="selectedType"
                        :dontfilter="true"
                        label="Shift Type"
                        placeholder="Select Type"
                        @update="
                            (v: DropdownLabel<ShiftTypeOption>) => {
                                vm.data.type = v.value.value;
                                vm.clearFieldError('requiredMinutes');
                            }
                        "
                    />
                </div>
            </div>

            <div v-if="isFlexibleShift" class="w-full flex flex-col gap-2">
                <span
                    class="text-sm font-medium text-gray-700 dark:text-gray-200"
                    >Required Duration (Hours & Minutes)</span
                >
                <div class="flex flex-col gap-4 md:flex-row">
                    <NumberInput
                        :model-value="vm.requiredHours"
                        label="Hours"
                        :min="0"
                        placeholder="0"
                        @update:model-value="
                            (value) => vm.setRequiredHours(value)
                        "
                    />
                    <NumberInput
                        :model-value="vm.requiredMinutes"
                        label="Minutes"
                        :min="0"
                        :max="59"
                        placeholder="0"
                        @update:model-value="
                            (value) => vm.setRequiredMinutes(value)
                        "
                    />
                </div>
                <span
                    v-if="vm.formErrors.requiredMinutes.length"
                    class="text-xs text-red-600 dark:text-red-400"
                    >{{ vm.formErrors.requiredMinutes[0] }}</span
                >
            </div>

            <div class="w-full flex flex-col gap-4 md:flex-row">
                <div class="flex w-full flex-col gap-1">
                    <TimeInput
                        label="Schedule In"
                        :model-value="vm.scheduleIn"
                        :placeholder="'00:00'"
                        @update:model-value="
                            (value) => {
                                vm.scheduleIn = value
                                    ? UITime.from(value)
                                    : null;
                                vm.clearFieldError('scheduleIn');
                                vm.clearFieldError('scheduleOut');
                            }
                        "
                    />
                    <span
                        v-if="vm.formErrors.scheduleIn.length"
                        class="text-xs text-red-600 dark:text-red-400"
                        >{{ vm.formErrors.scheduleIn[0] }}</span
                    >
                </div>
                <div class="flex w-full flex-col gap-1">
                    <TimeInput
                        label="Schedule Out"
                        :model-value="vm.scheduleOut"
                        :placeholder="'00:00'"
                        @update:model-value="
                            (value) => {
                                vm.scheduleOut = value
                                    ? UITime.from(value)
                                    : null;
                                vm.clearFieldError('scheduleOut');
                            }
                        "
                    />
                    <span
                        v-if="vm.formErrors.scheduleOut.length"
                        class="text-xs text-red-600 dark:text-red-400"
                        >{{ vm.formErrors.scheduleOut[0] }}</span
                    >
                </div>
            </div>
            <div class="w-full flex flex-col gap-4 md:flex-row">
                <div class="flex w-full flex-col gap-1">
                    <TimeInput
                        label="Break Start"
                        :model-value="vm.breakStart"
                        :placeholder="'00:00'"
                        @update:model-value="
                            (value) => {
                                vm.breakStart = value
                                    ? UITime.from(value)
                                    : null;
                                vm.clearFieldError('breakStart');
                            }
                        "
                    />
                    <span
                        v-if="vm.formErrors.breakStart.length"
                        class="text-xs text-red-600 dark:text-red-400"
                        >{{ vm.formErrors.breakStart[0] }}</span
                    >
                </div>
                <div class="flex w-full flex-col gap-1">
                    <TimeInput
                        label="Break End"
                        :model-value="vm.breakEnd"
                        :placeholder="'00:00'"
                        @update:model-value="
                            (value) => {
                                vm.breakEnd = value ? UITime.from(value) : null;
                                vm.clearFieldError('breakEnd');
                            }
                        "
                    />
                    <span
                        v-if="vm.formErrors.breakEnd.length"
                        class="text-xs text-red-600 dark:text-red-400"
                        >{{ vm.formErrors.breakEnd[0] }}</span
                    >
                </div>
            </div>
            <div class="w-full">
                <TextInput
                    :value="vm.data.description"
                    :optional="true"
                    :placeholder="'Description'"
                    :label="'Description'"
                    @input="(value) => (vm.data.description = value)"
                />
            </div>
            <!-- <div class="w-full flex flex-col gap-2">
                <span class="text-sm dark:text-gray-300">Cross Day</span>
                <SwitchComponent :checked="data.is_cross_day" @click="data.is_cross_day = !data.is_cross_day"/>
            </div> -->
            <div class="w-full flex flex-row justify-end">
                <ButtonComponent @click="vm.save(isFlexibleShift)">
                    Save
                </ButtonComponent>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import IconButton from "@/core/components/button/Icon.button.vue";
import { computed, onMounted, ref, watch } from "vue";
import { container } from "@/container/di";
import { TOKENS } from "@/container/tokens";
import Toast from "@/core/components/Toast.vue";
import TextInput from "@/core/components/input/Text.input.vue";
import TimeInput from "@/core/components/input/Time.input.vue";
import NumberInput from "@/core/components/input/Number.input.vue";
import ButtonComponent from "@/core/components/button/Button.component.vue";
import { UITime } from "@/core/ui/UITime";
import { DropdownLabel } from "@/core/components/models/DropdownLabel";
import TextDropdownInput from "@/core/components/input/TextDropdown.input.vue";
import { type Labels, type ShiftTypeOption } from "./Shift.ui";
// import { useRoute } from "vue-router";

const vm = ref(container.get(TOKENS.ShiftFormViewModel));

const isFlexibleShift = computed(() => vm.value.data.type === "FLEXIBLE");

const selectedLabel = computed(() => {
    const temp =
        vm.value.labelDropdown.find(
            (option) => option.value.value === vm.value.data.label,
        ) ?? null;
    console.log(vm.value.data.label);
    return temp;
});

const selectedType = computed(() => {
    return (
        vm.value.typeDropdown.find(
            (option) => option.value.value === vm.value.data.type,
        ) ?? null
    );
});

watch(
    () => vm.value.data.type,
    (type) => {
        if (type === "FLEXIBLE") {
            const total = vm.value.data.required_minutes ?? 0;
            vm.value.setRequiredHours(Math.floor(total / 60));
            vm.value.setRequiredMinutes(total % 60);
        } else {
            vm.value.setRequiredHours(0);
            vm.value.setRequiredMinutes(0);
            vm.value.data.required_minutes = 0;
            vm.value.clearFieldError("requiredMinutes");
        }
    },
    { immediate: true },
);

watch(
    [vm.value.requiredHours, vm.value.requiredMinutes],
    ([hours, minutes]) => {
        if (!isFlexibleShift.value) {
            return;
        }
        const totalMinutes = hours * 60 + minutes;
        vm.value.data.required_minutes = totalMinutes;
        if (totalMinutes > 0) {
            vm.value.clearFieldError("requiredMinutes");
        }
    },
);

onMounted(() => {
    if (vm.value.route.params.uuid) {
        vm.value.isUpdate = true;
        vm.value.getShift();
    }
});
</script>

<style scoped></style>
