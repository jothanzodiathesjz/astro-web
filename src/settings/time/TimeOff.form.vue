<template>
    <div class="w-full h-full min-h-0 flex flex-col px-5 dark:bg-gray-900">
        <Toast
            :duration="alerts?.duration"
            :message="alerts?.message ?? ''"
            :type="alerts?.type"
            :show="Boolean(alerts)"
            @on-close="alerts = null"
        />
        <div class="flex flex-row items-center gap-4">
            <ButtonComponent
                @click="$router.back()"
                :variant="'outline'"
                :icon-name="'fa-angle-left'"
                >Back</ButtonComponent
            >
            <div class="w-full flex flex-row gap-3 items-center">
                <span
                    @click="$router.back()"
                    class="font-semibold text-blue-600 dark:text-gray-200 cursor-pointer"
                    >Time Off</span
                >
                <IconButton :icon-name="'fa-angle-right'" />
                <span class="font-semibold text-gray-800 dark:text-gray-200"
                    >{{ isUpdate ? "Detail" : "Form" }} Time Off</span
                >
            </div>
        </div>
        <div
            class="py-5 flex flex-col gap-3 mt-4 px-5 mb-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-7"
        >
            <div class="w-full flex flex-row gap-4">
                <TextInput
                    :value="data.name"
                    :placeholder="'Name'"
                    :label="'Name'"
                    :error="formErrors.name"
                    @input="
                        (value) => {
                            data.name = value;
                            clearFieldError('name');
                        }
                    "
                />
                <TextInput
                    :value="data.code"
                    :placeholder="'Code'"
                    :label="'Code'"
                    :error="formErrors.code"
                    @input="
                        (value) => {
                            data.code = value;
                            clearFieldError('code');
                        }
                    "
                />
            </div>
            <div class="w-full pr-2 flex flex-col gap-2">
                <TextInput
                    :value="data.description"
                    label="Description"
                    :placeholder="'Description'"
                    :error="formErrors.description"
                    @input="
                        (value) => {
                            data.description = value;
                            clearFieldError('description');
                        }
                    "
                />
            </div>
            <div
                class="w-full pr-2 flex flex-col gap-4 md:flex-row md:flex-wrap md:items-start"
            >
                <div class="w-full md:flex-1 min-w-[220px]">
                    <TimeOffCategory
                        :selected="
                            data.category ? {
                                value: data.category,
                                label: formatFeatureLabel(data.category),
                                id: data.category
                            } as DropdownLabel<string> : null
                        "
                        @update="(e) => (data.category = e.value)"
                    />
                </div>
                <div class="w-full md:flex-1 min-w-[220px]">
                    <TextDropdownInput
                        label="Duration Type"
                        placeholder="Pilih duration"
                        :options="durationOptions"
                        :selected="durationSelected"
                        :dontfilter="true"
                        :hint="{
                            text: 'Jenis durasi yang digunakan'
                        }"
                        @update="
                            (option) => {
                                data.duration_type = option.value;
                            }
                        "
                    />
                </div>
                
            </div>
            <div class="grid grid-cols-2 gap-4">
                    <NumberInput
                        :model-value="data.tolerance_minutes"
                        :placeholder="'Tolerance'"
                        :label="'Tolerance (Minutes)'"
                        :hint="{
                            text: 'Batas toleransi dalam menit sebelum dianggap pelanggaran'
                        }"
                        @update:model-value="
                            (value) => {
                                data.tolerance_minutes = value;
                            }
                        "
                    />
                </div>
            <div class="w-full pr-2 flex flex-col gap-4">
                <div class="flex flex-col gap-3">
                    <span class="text-sm">Paid</span>
                    <SwitchComponent
                    :checked="data.is_paid"
                    @click=" data.is_paid = !data.is_paid"
                    />
                    <span class="text-xs font-light text-gray-400 dark:text-gray-500">Durasi ini tetap dibayar</span>
                </div>
                <div class="flex flex-col gap-3">
                    <span class="text-sm">Deduct Leave</span>
                    <SwitchComponent
                    :checked="data.is_deduct_leave"
                    @click=" data.is_deduct_leave = !data.is_deduct_leave"
                    />
                    <span class="text-xs font-light text-gray-400 dark:text-gray-500">Mengurangi saldo cuti karyawan</span>
                </div>
            </div>
            <div class="w-full flex flex-row justify-end">
                <ButtonComponent
                    v-if="!isUpdate"
                    :variant="'primary'"
                    class="w-full sm:w-auto md:w-1/4"
                    @click="submitForm"
                    >Save</ButtonComponent
                >
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import TextInput from "@/core/components/input/Text.input.vue";
import ButtonComponent from "@/core/components/button/Button.component.vue";
import Toast from "@/core/components/Toast.vue";
import { ToastUI } from "@/core/ui/Toast.ui";
import { container } from "@/container/di";
import { TOKENS } from "@/container/tokens";
import { computed, onMounted, reactive, ref } from "vue";
import { DomainTimeOff } from "@/domain/models/TimeOff";
import { handleErrors, UIError } from "@/core/ui/UIError";
import IconButton from "@/core/components/button/Icon.button.vue";
import { useRoute } from "vue-router";
import TimeOffCategory from "./TimeOffCategory.vue";
import { DropdownLabel } from "@/core/components/models/DropdownLabel";
import NumberInput from "@/core/components/input/Number.input.vue";
import SwitchComponent from "@/core/components/button/Switch.component.vue";
import TextDropdownInput from "@/core/components/input/TextDropdown.input.vue";
import { formatFeatureLabel } from "@/core/utils/Text";

const route = useRoute();

const repository = container.get(TOKENS.TimeOffRepository);
const data = ref<DomainTimeOff>(DomainTimeOff.empty());
const alerts = ref<ToastUI | null>(null);
const errors = ref<UIError | null>(null);
const submiting = ref(false);
const isUpdate = ref(false);

const durationOptions = ["FULLDAY", "HALFDAY", "COSTUMTIME"].map(
    (item) => {
        return {
            id: item,
            label: formatFeatureLabel(item),
            value: item,
        } as DropdownLabel<string>;
    },
);

const durationSelected = computed(() =>
    data.value.duration_type
        ? {
            id: data.value.duration_type,
            label: formatFeatureLabel(data.value.duration_type),
            value: data.value.duration_type,
        } as DropdownLabel<string>
        : null,
);

type FormErrorField = "name" | "code" | "description";
const formErrors = reactive<Record<FormErrorField, string[]>>({
    name: [],
    code: [],
    description: [],
});
function clearFieldError(field: FormErrorField) {
    formErrors[field] = [];
}
function resetFormErrors() {
    (Object.keys(formErrors) as FormErrorField[]).forEach((field) => {
        formErrors[field] = [];
    });
}
function validateForm(): boolean {
    resetFormErrors();
    let isValid = true;
    if (!data.value.name.trim()) {
        formErrors.name = ["Name is required"];
        isValid = false;
    }
    if (!data.value.code.trim()) {
        formErrors.code = ["Code is required"];
        isValid = false;
    }
    if (!data.value.description.trim()) {
        formErrors.description = ["Description is required"];
        isValid = false;
    }
    return isValid;
}
async function submitForm() {
    alerts.value = null;
    if (!validateForm()) {
        alerts.value = new ToastUI(
            "Please correct the errors in the form.",
            "error",
            2000,
        );
        return;
    }
    try {
        submiting.value = true;
        if (isUpdate.value) {
            const result = await repository.update(data.value);
            data.value = result;
            alerts.value = new ToastUI("Successfully updated", "success", 1500);
        } else {
            const result = await repository.create(
                new DomainTimeOff(data.value),
            );
            data.value = result;
            alerts.value = new ToastUI("Successfully created", "success", 1500);
            data.value = DomainTimeOff.empty();
        }
    } catch (error) {
        errors.value = handleErrors(error);
        alerts.value = new ToastUI(
            errors.value?.message ?? "Error",
            "error",
            2000,
        );
    } finally {
        submiting.value = false;
    }
}

async function getData(uuid: string) {
    try {
        const result = await repository.get(uuid);
        data.value = result;
    } catch (error) {
        errors.value = handleErrors(error);
        alerts.value = new ToastUI(errors.value?.message, "error", 2000);
    }
}

onMounted(() => {
    if (route.params.uuid) {
        isUpdate.value = true;
        getData(route.params.uuid as string);
    }
});
</script>
<style scoped></style>
