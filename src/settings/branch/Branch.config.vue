div
<template>
    <div class="w-full h-full min-h-0 flex flex-col px-5 dark:bg-gray-900">
        <Toast
            :duration="alerts?.duration"
            :message="alerts?.message ?? ''"
            :show="alerts ? true : false"
            @on-close="((alerts = null), (errors = null))"
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
                    >Company</span
                >
                <IconButton :icon-name="'fa-angle-right'" />
                <span
                    @click="$router.back()"
                    class="font-semibold text-blue-600 dark:text-gray-200 cursor-pointer"
                    >Branch</span
                >
                <IconButton :icon-name="'fa-angle-right'" />
                <span class="font-semibold text-gray-800 dark:text-gray-200"
                    >Branch Form</span
                >
            </div>
        </div>

        <div
            class="py-5 rounded-lg flex flex-col gap-3 bg-white dark:bg-gray-800 mt-4 px-5 mb-3"
        >
            <span>Configuration</span>
            <div class="w-full flex flex-row gap-4">
                <TextInput
                    :value="data.name"
                    :placeholder="'Time Zone'"
                    :label="'Time Zone'"
                    :error="errors?.data?.name"
                    @input="(value) => (data.name = value)"
                />
            </div>
            <div class="w-full flex flex-row justify-end">
                <ButtonComponent
                    :variant="'primary'"
                    class="w-1/4"
                    :disabled="submiting"
                    :loading="submiting"
                    @click="createBranch()"
                    >Save</ButtonComponent
                >
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import TextInput from "@/core/components/input/Text.input.vue";
import ButtonComponent from "@/core/components/button/Button.component.vue";
import { container } from "@/container/di";
import { TOKENS } from "@/container/tokens";
import { onMounted, ref } from "vue";
import { handleErrors, UIError } from "@/core/ui/UIError";
import { ToastUI } from "@/core/ui/Toast.ui";
import { useRoute } from "vue-router";
import Toast from "@/core/components/Toast.vue";
import IconButton from "@/core/components/button/Icon.button.vue";
import SwitchComponent from "@/core/components/button/Switch.component.vue";
import { DomainBranch } from "@/domain/models/Branch";
import { PhoneUI } from "@/core/ui/Phone.ui";
import PhoneInput from "@/core/components/input/Phone.input.vue";
import NumberInput from "@/core/components/input/Number.input.vue";
import { validateBranchForm } from "./BranchForm.validate";

// const router = useRouter();
const route = useRoute();
const repository = container.get(TOKENS.BranchRepository);
const data = ref<DomainBranch>(DomainBranch.empty());
const errors = ref<UIError | null>(null);
const alerts = ref<ToastUI | null>(null);
const submiting = ref(false);
const contactNumber = ref<PhoneUI>(PhoneUI.empty());
const uuidCompany = route.params.uuid as string;
const uuidBranch = route.params.uuidBranch as string;

// Mengembalikan nilai boolean untuk menandakan validasi berhasil atau tidak

async function getBranch(uuid: string) {
    try {
        const branch = await repository.getOne(uuid, uuidCompany);
        data.value = branch;
    } catch (error) {
        errors.value = handleErrors(error);
        alerts.value = new ToastUI(errors.value?.message, "error", 2000);
    }
}

async function createBranch() {
    // Panggil fungsi validate dan periksa hasilnya
    data.value.contact.phone_number =
        contactNumber.value.toPhoneNumberString() ?? "";
    const { err, isValid } = validateBranchForm(data.value);

    if (!isValid) {
        // Jika validasi gagal, hentikan proses
        errors.value = new UIError(
            "Please correct the errors in the form.",
            err,
        );
        console.log(err);
        return;
    }

    if (!uuidCompany) {
        throw new Error("UUID Company is required");
    }
    try {
        submiting.value = true;
        await repository.create(data.value.toData(), uuidCompany);
        alerts.value = new ToastUI("success", "success", 1500);
        // setTimeout(() => {
        //     submiting.value = false;
        //     router.push({ name: "Department" });
        // }, 1600);
    } catch (error) {
        errors.value = handleErrors(error);
        alerts.value = new ToastUI(errors.value?.message, "error", 2000);
        submiting.value = false;
    }
}

onMounted(async () => {
    if (uuidBranch) {
        getBranch(uuidBranch);
    }
});
</script>

<style scoped></style>
