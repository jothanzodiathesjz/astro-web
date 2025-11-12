<template>
    <div class="w-full h-full min-h-0 flex flex-col px-5 dark:bg-gray-900">
        <Toast
            :duration="alerts?.duration"
            :message="alerts?.message ?? ''"
            :type="alerts?.type"
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
                <span class="font-semibold text-gray-800 dark:text-gray-200"
                    >Form Company</span
                >
            </div>
        </div>
        <!-- <div
            class="bg-white w-full dark:bg-gray-800 flex flex-row px-3 py-3 gap-2 rounded mt-4"
        >
            <IconButton @click="$router.back()" :icon-name="'fa-angle-left'" />
            <span class="font-semibold dark:text-gray-200">Form Company</span>
        </div> -->

        <div
            class="py-5 flex flex-col gap-3 mt-4 px-5 mb-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-7"
        >
            <div class="w-full flex flex-row gap-4">
                <TextInput
                    :value="companyData.name"
                    :placeholder="'Name'"
                    :label="'Name'"
                    :error="errors?.data?.name"
                    @input="(value) => (companyData.name = value)"
                />
                <TextInput
                    :value="companyData.industry"
                    :placeholder="'Industry'"
                    :label="'Industry'"
                    :error="errors?.data?.industry"
                    @input="(value) => (companyData.industry = value)"
                />
            </div>
            <div class="w-full flex flex-col gap-4">
                <div class="flex flex-row gap-5 items-end">
                    <TextInput
                        label="Country"
                        :value="companyData.address.country"
                        :placeholder="'Country'"
                        :error="errors?.data?.country"
                        @input="(v) => (companyData.address.country = v)"
                    />
                </div>
                <div class="flex flex-row gap-5 items-end">
                    <TextInput
                        label="Province"
                        :value="companyData.address.province"
                        :placeholder="'Province'"
                        :error="errors?.data?.province"
                        @input="(v) => (companyData.address.province = v)"
                    />

                    <TextInput
                        label="City"
                        :value="companyData.address.city"
                        :placeholder="'City'"
                        :error="errors?.data?.city"
                        @input="(v) => (companyData.address.city = v)"
                    />
                </div>
                <div class="flex flex-row gap-5 items-end">
                    <TextInput
                        label="Street"
                        :value="companyData.address.street"
                        :placeholder="'street'"
                        :error="errors?.data?.street"
                        @input="(v) => (companyData.address.street = v)"
                    />
                    <TextInput
                        label="Zip Code"
                        :value="companyData.address.zip_code"
                        :placeholder="'Postal Code'"
                        :error="errors?.data?.zip_code"
                        @input="(v) => (companyData.address.zip_code = v)"
                    />
                </div>
                <div class="flex flex-row gap-5 items-end">
                    <TextInput
                        label="Email"
                        :value="companyData.contact.email"
                        :placeholder="'street'"
                        :error="errors?.data?.email"
                        @input="(v) => (companyData.contact.email = v)"
                    />
                    <div class="w-full flex flex-col gap-2 items-start">
                        <PhoneInput
                            :label="'Phone Number (Whatsapp)'"
                            :phone="contactNumber"
                            @input="(v) => (contactNumber = new PhoneUI(v))"
                        />
                        <span
                            v-if="errors?.data.number"
                            class="text-xs text-red-500"
                            >{{ errors?.data.number }}</span
                        >
                    </div>
                </div>
            </div>
            <div class="w-full flex flex-row justify-end">
                <ButtonComponent
                    :variant="'primary'"
                    class="w-1/4"
                    :disabled="isSubmitting"
                    :loading="isSubmitting"
                    @click="submitCompanyForm()"
                    >Save</ButtonComponent
                >
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import TextInput from "@/core/components/input/Text.input.vue";
import ButtonComponent from "@/core/components/button/Button.component.vue";
import IconButton from "@/core/components/button/Icon.button.vue";
import PhoneInput from "@/core/components/input/Phone.input.vue";
import Toast from "@/core/components/Toast.vue";

import { container } from "@/container/di";
import { TOKENS } from "@/container/tokens";
import { handleErrors, UIError } from "@/core/ui/UIError";
import { ToastUI } from "@/core/ui/Toast.ui";
import { PhoneUI } from "@/core/ui/Phone.ui";
import { DomainCompany } from "@/domain/models/Company";
import { mapToPhoneUI } from "@/core/utils/PhoneParsing";
import { nanoid } from "nanoid";

// Constants
const VALIDATION_MESSAGES = {
    NAME_REQUIRED: "Company name is required",
    INDUSTRY_REQUIRED: "Industry is required",
    COUNTRY_REQUIRED: "Country is required",
    PROVINCE_REQUIRED: "Province is required",
    CITY_REQUIRED: "City is required",
    STREET_REQUIRED: "Street is required",
    ZIP_CODE_REQUIRED: "Zip code is required",
    PHONE_NUMBER_REQUIRED: "Phone number is required",
    COUNTRY_CODE_REQUIRED: "Country code is required",
    EMAIL_REQUIRED: "Email is required",
    SUCCESS_OPERATION: "Operation completed successfully",
    GENERAL_ERROR: "Please correct the errors in the form",
} as const;

const TOAST_DURATION = {
    SUCCESS: 1500,
    ERROR: 2000,
} as const;

// Composables
const router = useRouter();
const route = useRoute();

// Dependency injection
const repository = container.get(TOKENS.CompanyRepository);

// Reactive state
const companyData = ref<DomainCompany>(DomainCompany.empty());
const errors = ref<UIError | null>(null);
const alerts = ref<ToastUI | null>(null);
const isSubmitting = ref(false);
const contactNumber = ref<PhoneUI>(PhoneUI.empty());

// Computed properties
const isUpdateMode = computed(() => Boolean(route.params.uuid));

// Lifecycle hooks
onMounted(() => {
    if (isUpdateMode.value) {
        loadCompanyData();
    }
});

// Methods
async function loadCompanyData(): Promise<void> {
    try {
        const companyUuid = route.params.uuid as string;
        const company = await repository.getOne(companyUuid);
        companyData.value = company;

        // Parse phone number if exists
        if (company.contact.phone_number) {
            // Implement phone parsing logic here
            contactNumber.value = mapToPhoneUI(company.contact.phone_number);
        }
    } catch (error) {
        errors.value = handleErrors(error);
        alerts.value = new ToastUI(
            "Failed to load company data",
            "error",
            TOAST_DURATION.ERROR,
        );
    }
}

function validateForm(): boolean {
    const validationErrors: Record<string, string> = {};
    let isValid = true;

    if (!companyData.value.name.trim()) {
        validationErrors.name = VALIDATION_MESSAGES.NAME_REQUIRED;
        isValid = false;
    }

    if (!companyData.value.industry.trim()) {
        validationErrors.industry = VALIDATION_MESSAGES.INDUSTRY_REQUIRED;
        isValid = false;
    }

    if (!companyData.value.address.country.trim()) {
        validationErrors.country = VALIDATION_MESSAGES.COUNTRY_REQUIRED;
        isValid = false;
    }

    if (!companyData.value.address.province.trim()) {
        validationErrors.province = VALIDATION_MESSAGES.PROVINCE_REQUIRED;
        isValid = false;
    }

    if (!companyData.value.address.city.trim()) {
        validationErrors.city = VALIDATION_MESSAGES.CITY_REQUIRED;
        isValid = false;
    }

    if (!companyData.value.address.street.trim()) {
        validationErrors.street = VALIDATION_MESSAGES.STREET_REQUIRED;
        isValid = false;
    }

    if (!companyData.value.address.zip_code.trim()) {
        validationErrors.zip_code = VALIDATION_MESSAGES.ZIP_CODE_REQUIRED;
        isValid = false;
    }

    if (!contactNumber.value.number.trim()) {
        validationErrors.number = VALIDATION_MESSAGES.PHONE_NUMBER_REQUIRED;
        isValid = false;
    }

    if (!contactNumber.value.country_code.trim()) {
        validationErrors.country_code =
            VALIDATION_MESSAGES.COUNTRY_CODE_REQUIRED;
        isValid = false;
    }

    if (!companyData.value.contact.email.trim()) {
        validationErrors.email = VALIDATION_MESSAGES.EMAIL_REQUIRED;
        isValid = false;
    }

    if (!isValid) {
        errors.value = new UIError(
            VALIDATION_MESSAGES.GENERAL_ERROR,
            validationErrors,
        );
    } else {
        errors.value = null;
    }

    return isValid;
}

async function submitCompanyForm(): Promise<void> {
    if (!validateForm()) {
        return;
    }

    try {
        isSubmitting.value = true;

        const formattedPhoneNumber = `+${contactNumber.value.country_code}${contactNumber.value.number}`;
        const submissionData = {
            ...companyData.value,
            contact: {
                ...companyData.value.contact,
                phone_number: formattedPhoneNumber,
            },
        };

        if (isUpdateMode.value) {
            await repository.update(submissionData);
        } else {
            await repository.create({
                ...submissionData,
                uuid: nanoid(),
            });
        }

        alerts.value = new ToastUI(
            VALIDATION_MESSAGES.SUCCESS_OPERATION,
            "success",
            TOAST_DURATION.SUCCESS,
        );

        setTimeout(() => {
            isSubmitting.value = false;
            router.push({ name: "Company" });
        }, TOAST_DURATION.SUCCESS + 100);
    } catch (error) {
        errors.value = handleErrors(error);
        alerts.value = new ToastUI(
            errors.value?.message || "An unexpected error occurred",
            "error",
            TOAST_DURATION.ERROR,
        );
        isSubmitting.value = false;
    }
}
</script>

<style scoped></style>
