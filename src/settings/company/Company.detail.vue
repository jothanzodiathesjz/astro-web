<template>
    <div class="w-full h-full min-h-0 flex flex-col px-5 dark:bg-gray-900">
        <Toast
            :duration="alerts?.duration"
            :message="alerts?.message ?? ''"
            :type="alerts?.type"
            :show="alerts ? true : false"
            @on-close="((alerts = null), (errors = null))"
        />

        <div
            class="w-full flex flex-row justify-between items-center px-3 gap-2 rounded"
        >
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
            <div class="flex flex-row justify-end gap-3">
                <ButtonComponent
                    :variant="'outline'"
                    :icon-name="'fa-pen'"
                    @click="
                        $router.push({
                            name: 'CompanyEdit',
                            params: { uuid: companyData.uuid },
                        })
                    "
                    >Edit</ButtonComponent
                >
                <ButtonComponent
                    @click="
                        $router.push({
                            name: 'Branch',
                        })
                    "
                    >Atur Branch</ButtonComponent
                >
            </div>
        </div>

        <div
            v-if="companyData.uuid"
            class="py-5 flex flex-col gap-5 overflow-y-auto"
        >
            <div
                class="bg-white dark:bg-gray-800 flex flex-col rounded-lg p-5 dark:border-gray-700"
            >
                <h2 class="font-bold mb-4 text-gray-900 dark:text-gray-200">
                    General Information
                </h2>
                <div class="space-y-3">
                    <div class="text-sm flex items-center gap-3">
                        <span
                            class="text-gray-500 dark:text-gray-400 font-medium w-32"
                            >Name</span
                        >
                        <span class="text-gray-900 dark:text-gray-100 flex-1">{{
                            companyData.name
                        }}</span>
                    </div>
                    <div class="text-sm flex items-center gap-3">
                        <span
                            class="text-gray-500 dark:text-gray-400 font-medium w-32"
                            >Industry</span
                        >
                        <span class="text-gray-900 dark:text-gray-100 flex-1">{{
                            companyData.industry
                        }}</span>
                    </div>
                    <div class="text-sm flex items-center gap-3">
                        <span
                            class="text-gray-500 dark:text-gray-400 font-medium w-32"
                            >UUID</span
                        >
                        <span
                            class="text-gray-900 dark:text-gray-100 flex-1 break-all"
                            >{{ companyData.uuid }}</span
                        >
                    </div>
                </div>
            </div>

            <div
                class="bg-white dark:bg-gray-800 rounded-lg p-5 dark:border-gray-700"
            >
                <h2 class="font-bold mb-4 text-gray-900 dark:text-gray-200">
                    Contact Information
                </h2>
                <div class="space-y-3">
                    <div class="text-sm flex items-center gap-3">
                        <span
                            class="text-gray-500 dark:text-gray-400 font-medium w-32"
                            >Phone</span
                        >
                        <a
                            :href="`tel:${companyData.contact.phone_number}`"
                            class="text-blue-600 dark:text-blue-400 hover:underline flex-1"
                        >
                            {{ companyData.contact.phone_number }}
                        </a>
                    </div>
                    <div class="text-sm flex items-center gap-3">
                        <span
                            class="text-gray-500 dark:text-gray-400 font-medium w-32"
                            >Email</span
                        >
                        <a
                            :href="`mailto:${companyData.contact.email}`"
                            class="text-blue-600 dark:text-blue-400 hover:underline flex-1"
                        >
                            {{ companyData.contact.email }}
                        </a>
                    </div>
                </div>
            </div>

            <div
                class="bg-white dark:bg-gray-800 rounded-lg p-5 dark:border-gray-700"
            >
                <h2 class="font-bold mb-4 text-gray-900 dark:text-gray-200">
                    Address
                </h2>
                <div class="space-y-3">
                    <div class="text-sm flex gap-3">
                        <span
                            class="text-gray-500 dark:text-gray-400 font-medium w-32"
                            >Street</span
                        >
                        <span class="text-gray-900 dark:text-gray-100 flex-1">{{
                            companyData.address.street
                        }}</span>
                    </div>
                    <div class="text-sm flex items-center gap-3">
                        <span
                            class="text-gray-500 dark:text-gray-400 font-medium w-32"
                            >City</span
                        >
                        <span class="text-gray-900 dark:text-gray-100 flex-1">{{
                            companyData.address.city
                        }}</span>
                    </div>
                    <div class="text-sm flex items-center gap-3">
                        <span
                            class="text-gray-500 dark:text-gray-400 font-medium w-32"
                            >Province</span
                        >
                        <span class="text-gray-900 dark:text-gray-100 flex-1">{{
                            companyData.address.province
                        }}</span>
                    </div>
                    <div class="text-sm flex items-center gap-3">
                        <span
                            class="text-gray-500 dark:text-gray-400 font-medium w-32"
                            >Zip Code</span
                        >
                        <span class="text-gray-900 dark:text-gray-100 flex-1">{{
                            companyData.address.zip_code
                        }}</span>
                    </div>
                    <div class="text-sm flex items-center gap-3">
                        <span
                            class="text-gray-500 dark:text-gray-400 font-medium w-32"
                            >Country</span
                        >
                        <span class="text-gray-900 dark:text-gray-100 flex-1">{{
                            companyData.address.country
                        }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div
            v-else-if="errors"
            class="flex flex-col items-center justify-center h-full text-center p-5 dark:text-gray-400"
        >
            <p class="text-lg font-semibold">Failed to load data.</p>
            <p class="text-sm mt-2">Please try again later.</p>
        </div>
        <div v-else class="flex items-center justify-center h-full">
            <p class="text-lg text-gray-500 dark:text-gray-400">
                Loading company data...
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import IconButton from "@/core/components/button/Icon.button.vue";
import Toast from "@/core/components/Toast.vue";
import { container } from "@/container/di";
import { TOKENS } from "@/container/tokens";
import { handleErrors, UIError } from "@/core/ui/UIError";
import { ToastUI } from "@/core/ui/Toast.ui";
import { DomainCompany } from "@/domain/models/Company";
import ButtonComponent from "@/core/components/button/Button.component.vue";

const TOAST_DURATION = {
    SUCCESS: 1500,
    ERROR: 2000,
} as const;

// Composables
const route = useRoute();

// Dependency injection
const repository = container.get(TOKENS.CompanyRepository);

// Reactive state
const companyData = ref<DomainCompany>(DomainCompany.empty());
const errors = ref<UIError | null>(null);
const alerts = ref<ToastUI | null>(null);

// Lifecycle hooks
onMounted(() => {
    loadCompanyData();
});

// Methods
async function loadCompanyData(): Promise<void> {
    try {
        const companyUuid = route.params.uuid as string;
        const company = await repository.getOne(companyUuid);
        companyData.value = company;
    } catch (error) {
        errors.value = handleErrors(error);
        alerts.value = new ToastUI(
            "Failed to load company data",
            "error",
            TOAST_DURATION.ERROR,
        );
    }
}
</script>

<style scoped>
/* Optional: You can add more specific styles here if needed. */
</style>
