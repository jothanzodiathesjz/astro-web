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
            class="py-5 rounded-lg flex flex-col gap-3 bg-white dark:bg-gray-800 mt-4 px-5 mb-3"
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
            <div class="w-full flex flex-row justify-end">
                <ButtonComponent
                    v-if="!isUpdate"
                    :variant="'primary'"
                    class="w-1/4"
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
import { onMounted, reactive, ref } from "vue";
import { DomainTimeOff } from "@/domain/models/TimeOff";
import { handleErrors, UIError } from "@/core/ui/UIError";
import IconButton from "@/core/components/button/Icon.button.vue";
import { useRoute } from "vue-router";

const route = useRoute();

const repository = container.get(TOKENS.TimeOffRepository);
const data = ref<DomainTimeOff>(DomainTimeOff.empty());
const alerts = ref<ToastUI | null>(null);
const errors = ref<UIError | null>(null);
const submiting = ref(false);
const isUpdate = ref(false);

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
