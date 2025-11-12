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
            <span>General Information</span>
            <div class="w-full flex flex-row gap-4">
                <TextInput
                    :value="data.name"
                    :placeholder="'Name'"
                    :label="'Name'"
                    :error="errors?.data?.name"
                    @input="(value) => (data.name = value)"
                />
                <TextInput
                    :value="data.code"
                    :placeholder="'Code'"
                    :label="'Code'"
                    :error="errors?.data?.code"
                    @input="(value) => (data.code = value)"
                />
            </div>
            <div class="w-full flex flex-col gap-2">
                <span class="text-sm dark:text-gray-300">Head Office</span>
                <SwitchComponent :checked="data.is_head_office" @click="data.is_head_office = !data.is_head_office"/>
            </div>
            <span>Contact</span>
            <div class="flex flex-row gap-5 items-end">
                <TextInput
                    label="Email"
                    :value="data.contact.email"
                    :placeholder="'Email'"
                    :error="errors?.data?.email"
                    @input="(v) => (data.contact.email = v)"
                />
                <div class="w-full flex flex-col gap-2 items-start">
                    <PhoneInput
                        :label="'Phone Number (Whatsapp)'"
                        :phone="contactNumber"
                        placeholder="Phone Number"
                        @input="(v) => (contactNumber = new PhoneUI(v))"
                    />
                    <span
                        v-if="errors?.data.number"
                        class="text-xs text-red-500"
                        >{{ errors?.data.number }}</span
                    >
                </div>
            </div>
            <span>Address</span>
            <div class="w-full flex flex-col gap-4">
                <div class="flex flex-row gap-5 items-end">
                    <TextInput
                        label="Country"
                        :value="data.address.country"
                        :placeholder="'Country'"
                        :error="errors?.data?.country"
                        @input="(v) => (data.address.country = v)"
                    />
                </div>
                <div class="flex flex-row gap-5 items-end">
                    <TextInput
                        label="Province"
                        :value="data.address.province"
                        :placeholder="'Province'"
                        :error="errors?.data?.province"
                        @input="(v) => (data.address.province = v)"
                    />

                    <TextInput
                        label="City"
                        :value="data.address.city"
                        :placeholder="'City'"
                        :error="errors?.data?.city"
                        @input="(v) => (data.address.city = v)"
                    />
                </div>
                <div class="flex flex-row gap-5 items-end">
                    <TextInput
                        label="Street"
                        :value="data.address.street"
                        :placeholder="'street'"
                        :error="errors?.data?.street"
                        @input="(v) => (data.address.street = v)"
                    />
                    <TextInput
                        label="Zip Code"
                        :value="data.address.zip_code"
                        :placeholder="'Zip Code'"
                        :error="errors?.data?.zip_code"
                        @input="(v) => (data.address.zip_code = v)"
                    />
                </div>
            </div>
            <span>Payroll Info</span>
            <div class="flex flex-row gap-5 items-end">
                <TextInput
                    label="HQ Initial"
                    :value="data.payroll_info.hq_initial"
                    :placeholder="'Hq Initial'"
                    :error="errors?.data?.hq_initial"
                    @input="(v) => (data.payroll_info.hq_initial = v)"
                />
                <TextInput
                    label="HQ Code"
                    :value="data.payroll_info.hq_code"
                    :placeholder="'Hq Code'"
                    :error="errors?.data?.hq_code"
                    @input="(v) => (data.payroll_info.hq_code = v)"
                />
            </div>
            <div class="w-full flex flex-row gap-4">
                <NumberInput
                    :label="'UMR'"
                    :model-value="data.payroll_info.umr"
                    :error="errors?.data?.umr"
                    @update:model-value="(v) => (data.payroll_info.umr = v)"
                />
                <TextInput
                    label="UMR Province"
                    :value="data.payroll_info.umr_province"
                    :placeholder="'Umr Province'"
                    :error="errors?.data?.umr_province"
                    @input="(v) => (data.payroll_info.umr_province = v)"
                />
            </div>
            <div class="w-full flex flex-row gap-4">
                <TextInput
                    label="UMR City"
                    :value="data.payroll_info.umr_city"
                    :placeholder="'Umr City'"
                    :error="errors?.data?.umr_city"
                    @input="(v) => (data.payroll_info.umr_city = v)"
                />
                <TextInput
                    label="Bpjs Code"
                    :value="data.payroll_info.bpjs_code"
                    :placeholder="'Bpjs Code'"
                    :error="errors?.data?.bpjs_code"
                    @input="(v) => (data.payroll_info.bpjs_code = v)"
                />
            </div>
            <div class="w-full flex flex-row gap-4">
                <TextInput
                    label="JKK"
                    :value="data.payroll_info.jkk"
                    :placeholder="'JKK'"
                    :error="errors?.data?.jkk"
                    @input="(v) => (data.payroll_info.jkk = v)"
                />
                <TextInput
                    label="KLU Code"
                    :value="data.payroll_info.klu_code"
                    :placeholder="'KLU Code'"
                    :error="errors?.data?.klu_code"
                    @input="(v) => (data.payroll_info.klu_code = v)"
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
