<template>
    <div
        class="w-full h-full flex flex-col items-center px-14 dark:bg-gray-900 pb-6 text-gray-800"
    >
        <Toast
            :duration="vm.alerts?.duration"
            :message="vm.alerts?.message ?? ''"
            :show="vm.alerts ? true : false"
            @on-close="vm.erorrs = null"
        />
        <div class="w-[90%] flex flex-row items-center py-3 mt-3 gap-4">
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
                    >Employee</span
                >
                <IconButton :icon-name="'fa-angle-right'" />
                <span class="font-semibold text-gray-800 dark:text-gray-200"
                    >{{ vm.isUpdate ? "Detail" : "Form" }} Employee</span
                >
            </div>
        </div>
        <div
            class="w-[90%] bg-white dark:bg-gray-800 flex flex-row mt-5 rounded-2xl px-8 py-3"
        >
            <div class="w-1/3 p-5 flex flex-col gap-4 border-r border-gray-200">
                <div
                    class="flex flex-row gap-2 items-center border border-gray-300 py-3 px-4 rounded"
                    v-for="value in stepsOptions"
                    :class="vm.steps === value.value ? 'bg-blue-50' : ''"
                >
                    <span
                        class="border border-gray-400 dark:border-gray-700 w-6 flex justify-center items-center h-6 shrink-0 rounded-full"
                        >{{ value.value }}</span
                    >
                    <span
                        class="dark:text-gray-300"
                        :class="vm.steps === value.value ? 'font-semibold' : ''"
                        >{{ value.label }}</span
                    >
                </div>
            </div>
            <div class="w-full p-5 flex flex-col gap-3">
                <div v-if="vm.steps === 1" class="w-full flex flex-col gap-4">
                    <span class="font-semibold dark:text-gray-200"
                        >Personal Detail</span
                    >
                    <div class="flex flex-row gap-5 items-end">
                        <TextInput
                            label="First Name"
                            :value="vm.employee.personalDetail.firstName"
                            :placeholder="'Firstname'"
                            :error="vm.erorrs?.data?.firstName"
                            @input="
                                (v) =>
                                    (vm.employee.personalDetail.firstName = v)
                            "
                        />
                        <TextInput
                            label="Last Name"
                            :value="vm.employee.personalDetail.lastName"
                            :placeholder="'Lastname'"
                            :error="vm.erorrs?.data?.lastName"
                            @input="
                                (v) => (vm.employee.personalDetail.lastName = v)
                            "
                        />
                    </div>
                    <div class="flex flex-row gap-5 items-start">
                        <TextInput
                            label="Nickname"
                            :value="vm.employee.personalDetail.nickName"
                            :placeholder="'Nickname'"
                            :error="vm.erorrs?.data?.nickName"
                            @input="
                                (v) => (vm.employee.personalDetail.nickName = v)
                            "
                        />
                        <div class="flex flex-col gap-1 w-full">
                            <span class="text-sm"
                                >Birth Date
                                <span class="text-red-500">*</span></span
                            >
                            <div class="flex flex-col gap-2">
                                <DateInput
                                    :model-value="
                                        vm.employee.personalDetail.birthDate
                                    "
                                    :with-range="false"
                                    :placeholder="'Pilih Tanggal Lahir'"
                                    :readonly="false"
                                    :with-time="false"
                                    @update:model-value="
                                        (value) =>
                                            (vm.employee.personalDetail.birthDate =
                                                value)
                                    "
                                />
                                <span
                                    class="text-xs text-red-500"
                                    v-if="vm.erorrs?.data?.birthDate"
                                    >{{ vm.erorrs?.data?.birthDate }}</span
                                >
                            </div>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-5 items-start">
                        <TextInput
                            label="Birth Place"
                            :value="vm.employee.personalDetail.birthPlace"
                            :placeholder="'Place'"
                            :error="vm.erorrs?.data?.birthPlace"
                            @input="
                                (v) =>
                                    (vm.employee.personalDetail.birthPlace = v)
                            "
                        />
                        <div class="flex flex-col gap-2">
                            <div class="flex flex-col gap-2">
                                <TextDropdownInput
                                    label="Golongan Darah"
                                    :options="vm.bloodGroupOptions"
                                    placeholder="Pilih Golongan Darah"
                                    :selected="selectedBlood"
                                    :dontfilter="true"
                                    @update="
                                        (value) =>
                                            (vm.employee.personalDetail.bloodType =
                                                value.value)
                                    "
                                    @clear="
                                        () =>
                                            (vm.employee.personalDetail.bloodType =
                                                null)
                                    "
                                />
                                <span
                                    class="text-xs text-red-500 te"
                                    v-if="vm.erorrs?.data?.bloodType"
                                    >{{ vm.erorrs?.data?.bloodType }}</span
                                >
                            </div>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-5 items-start">
                        <div class="flex flex-col gap-2">
                            <TextDropdownInput
                                label="Religion"
                                :options="vm.religionOptions"
                                placeholder="Pilih Agama"
                                :selected="selectedReligion"
                                :dontfilter="true"
                                @update="
                                    (value) =>
                                        (vm.employee.personalDetail.religion =
                                            value.value)
                                "
                                @clear="
                                    () =>
                                        (vm.employee.personalDetail.religion =
                                            null)
                                "
                            />
                            <span
                                class="text-xs text-red-500"
                                v-if="vm.erorrs?.data?.religion"
                                >{{ vm.erorrs?.data?.religion }}</span
                            >
                        </div>
                        <div class="flex flex-col gap-2">
                            <TextDropdownInput
                                label="Status"
                                :options="vm.maritalStatusOptions"
                                placeholder="Status"
                                :selected="selectedMaritalStatus"
                                :dontfilter="true"
                                :with-clear="true"
                                @update="
                                    (value) =>
                                        (vm.employee.personalDetail.maritalStatus =
                                            value.value)
                                "
                                @clear="
                                    () =>
                                        (vm.employee.personalDetail.maritalStatus =
                                            null)
                                "
                            />
                            <span
                                class="text-xs text-red-500"
                                v-if="vm.erorrs?.data?.maritalStatus"
                                >{{ vm.erorrs?.data?.maritalStatus }}</span
                            >
                        </div>
                        <div class="flex flex-col gap-2 items-start">
                            <div class="flex flex-col gap-2">
                                <span class="text-sm dark:text-gray-400"
                                    >Gender
                                    <span class="text-red-500">*</span></span
                                >
                                <div class="flex flex-row gap-16 shrink-0 py-2">
                                    <div
                                        class="flex flex-row gap-3"
                                        v-for="gender in ['MALE', 'FEMALE']"
                                    >
                                        <button
                                            class="border flex items-center justify-center rounded-full w-6 h-6 border-gray-300 shrink-0 relative"
                                            @click="
                                                vm.employee.personalDetail.gender =
                                                    gender === 'MALE'
                                                        ? 'M'
                                                        : 'F'
                                            "
                                        >
                                            <span
                                                :class="
                                                    vm.employee.personalDetail
                                                        .gender ===
                                                    (gender === 'MALE'
                                                        ? 'M'
                                                        : 'F')
                                                        ? 'bg-blue-500 absolute w-3 h-3 rounded-full'
                                                        : ''
                                                "
                                            ></span>
                                        </button>
                                        <span
                                            class="dark:text-gray-400 text-sm"
                                            >{{ gender }}</span
                                        >
                                    </div>
                                </div>
                            </div>
                            <span
                                class="text-xs text-red-500"
                                v-if="vm.erorrs?.data?.gender"
                                >{{ vm.erorrs?.data?.gender }}</span
                            >
                        </div>
                    </div>
                </div>
                <div v-if="vm.steps === 2" class="w-full flex flex-col gap-4">
                    <span class="font-semibold dark:text-gray-200"
                        >Address</span
                    >
                    <div class="flex flex-row gap-5 items-end">
                        <TextInput
                            optional="true"
                            label="Country"
                            :value="vm.employee.address.country"
                            :placeholder="'Country'"
                            @input="(v) => (vm.employee.address.country = v)"
                        />
                    </div>
                    <div class="flex flex-row gap-5 items-end">
                        <TextInput
                            optional="true"
                            label="Province"
                            :value="vm.employee.address.province"
                            :placeholder="'Province'"
                            @input="(v) => (vm.employee.address.province = v)"
                        />

                        <TextInput
                            optional="true"
                            label="City"
                            :value="vm.employee.address.city"
                            :placeholder="'City'"
                            @input="(v) => (vm.employee.address.city = v)"
                        />
                    </div>
                    <div class="flex flex-row gap-5 items-end">
                        <TextInput
                            optional="true"
                            label="Street"
                            :value="vm.employee.address.street"
                            :placeholder="'street'"
                            @input="(v) => (vm.employee.address.street = v)"
                        />
                        <TextInput
                            optional="true"
                            label="Zip Code"
                            :value="vm.employee.address.zipCode"
                            :placeholder="'Postal Code'"
                            @input="(v) => (vm.employee.address.zipCode = v)"
                        />
                    </div>
                </div>
                <div v-if="vm.steps === 3" class="w-full flex flex-col gap-4">
                    <span class="font-semibold dark:text-gray-200"
                        >Contact Detail</span
                    >
                    <div class="flex flex-row gap-5 items-start">
                        <TextInput
                            label="Email"
                            :value="vm.employee.contactDetail.email"
                            :placeholder="'email@gmail.com'"
                            :error="vm.erorrs?.data?.email"
                            @input="
                                (v) => (vm.employee.contactDetail.email = v)
                            "
                        />
                        <div class="w-full flex flex-col gap-2 items-start">
                            <PhoneInput
                                :label="'Phone Number (Whatsapp)'"
                                :phone="vm.employee.contactDetail.phoneNumber"
                                @input="
                                    (v) =>
                                        (vm.employee.contactDetail.phoneNumber =
                                            new PhoneUI(v))
                                "
                            />
                            <span
                                v-if="vm.erorrs?.data?.phoneNumber"
                                class="text-xs text-red-500"
                                >{{ vm.erorrs?.data?.phoneNumber }}</span
                            >
                        </div>
                    </div>
                    <span class="font-semibold dark:text-gray-200"
                        >Emergency Contact</span
                    >
                    <div class="grid grid-cols-2 gap-5 items-end">
                        <TextInput
                            label="Name"
                            :value="vm.employee.contactDetail.emergencyName"
                            :placeholder="'Name'"
                            :error="vm.erorrs?.data?.emergencyName"
                            @input="
                                (v) =>
                                    (vm.employee.contactDetail.emergencyName =
                                        v)
                            "
                        />
                        <div class="flex flex-col gap-2">
                            <TextDropdownInput
                                label="Relasi"
                                :options="vm.relationOptions"
                                placeholder="Relasi"
                                :selected="selectedRelation"
                                :dontfilter="true"
                                :with-clear="true"
                                @update="
                                    (value) =>
                                        (vm.employee.contactDetail.emergencyRelation =
                                            value.value)
                                "
                                @clear="
                                    () =>
                                        (vm.employee.contactDetail.emergencyRelation =
                                            null)
                                "
                            />
                            <span
                                v-if="vm.erorrs?.data?.emergencyRelation"
                                class="text-xs text-red-500"
                                >{{ vm.erorrs?.data?.emergencyRelation }}</span
                            >
                        </div>
                    </div>
                    <div class="flex flex-col gap-2 items-start">
                        <PhoneInput
                            :label="'Phone Number (Whatsapp)'"
                            :phone="
                                vm.employee.contactDetail.emergencyPhoneNumber
                            "
                            @input="
                                (v) =>
                                    (vm.employee.contactDetail.emergencyPhoneNumber =
                                        new PhoneUI(v))
                            "
                        />
                        <span
                            v-if="vm.erorrs?.data?.emergencyPhoneNumber"
                            class="text-xs text-red-500"
                            >{{ vm.erorrs?.data?.emergencyPhoneNumber }}</span
                        >
                    </div>
                </div>
                <div v-if="vm.steps === 4" class="w-full flex flex-col gap-4">
                    <span class="font-semibold dark:text-gray-200"
                        >Employment Data</span
                    >
                    <div class="flex flex-row gap-5 items-start">
                        <TextInput
                            label="Employee Id"
                            :value="vm.employee.employmentDetail.employeeId"
                            :placeholder="'ID'"
                            :error="vm.erorrs?.data?.employeeId"
                            @input="
                                (v) =>
                                    (vm.employee.employmentDetail.employeeId =
                                        v)
                            "
                        />
                        <TextInput
                            label="Finger Code"
                            :value="vm.employee.employmentDetail.fingerCode"
                            :placeholder="'Finger Code'"
                            :error="vm.erorrs?.data?.fingerCode"
                            @input="
                                (v) =>
                                    (vm.employee.employmentDetail.fingerCode =
                                        v)
                            "
                        />
                    </div>
                    <div class="flex flex-row gap-5 items-start">
                        <div class="w-full flex flex-col gap-2">
                            <TextDropdownInput
                                label="Department"
                                :options="vm.departMentOptions"
                                placeholder="Status"
                                :selected="selectedDepartment"
                                :dontfilter="true"
                                :with-clear="true"
                                @update="
                                    (value) =>
                                        (vm.employee.employmentDetail.department =
                                            value.value)
                                "
                                @clear="
                                    () =>
                                        (vm.employee.employmentDetail.department =
                                            null)
                                "
                            />
                            <span
                                v-if="vm.erorrs?.data?.department"
                                class="text-xs text-red-500"
                                >{{ vm.erorrs?.data?.department }}</span
                            >
                        </div>

                        <div class="w-full flex flex-col gap-2">
                            <TextDropdownInput
                                label="Job Level"
                                :options="vm.jobLevelOptions"
                                placeholder="Status"
                                :selected="selectedJobLevels"
                                :dontfilter="true"
                                :with-clear="true"
                                @update="
                                    (value) =>
                                        (vm.employee.employmentDetail.jobLevel =
                                            value.value)
                                "
                                @clear="
                                    () =>
                                        (vm.employee.employmentDetail.jobLevel =
                                            null)
                                "
                            />
                            <span
                                v-if="vm.erorrs?.data?.jobLevel"
                                class="text-xs text-red-500"
                                >{{ vm.erorrs?.data?.jobLevel }}</span
                            >
                        </div>
                    </div>
                    <div class="flex flex-row gap-5 items-start">
                        <div class="w-full flex flex-col gap-2">
                            <TextInput
                                label="Job Title"
                                :value="vm.employee.employmentDetail.jobTitle"
                                :placeholder="'Job Title'"
                                :error="vm.erorrs?.data?.jobTitle"
                                @input="
                                    (v) =>
                                        (vm.employee.employmentDetail.jobTitle =
                                            v)
                                "
                            />
                        </div>
                        <div class="w-full flex flex-col gap-2">
                            <TextDropdownInput
                                label="Employment Type"
                                :options="vm.employmentTypeOptions"
                                placeholder="Status"
                                :selected="selectedEmploymentType"
                                :dontfilter="true"
                                :with-clear="true"
                                @update="
                                    (value) =>
                                        (vm.employee.employmentDetail.employmentType =
                                            value.value)
                                "
                                @clear="
                                    () =>
                                        (vm.employee.employmentDetail.employmentType =
                                            null)
                                "
                            />
                            <span
                                v-if="vm.erorrs?.data?.employmentType"
                                class="text-xs text-red-500"
                                >{{ vm.erorrs?.data?.employmentType }}</span
                            >
                        </div>
                    </div>
                    <div class="flex flex-row gap-5 items-start">
                        <div class="w-full flex flex-col gap-2">
                            <span class="text-sm dark:text-gray-400"
                                >Start Date
                                <span class="text-red-500 text-xs"
                                    >*</span
                                ></span
                            >
                            <DateInput
                                :model-value="
                                    vm.employee.employmentDetail.startDate
                                "
                                :with-range="false"
                                :placeholder="'Start date'"
                                :readonly="false"
                                :with-time="false"
                                @update:model-value="
                                    (value) =>
                                        (vm.employee.employmentDetail.startDate =
                                            value instanceof Date
                                                ? value
                                                : undefined)
                                "
                            />
                            <span
                                v-if="vm.erorrs?.data?.startDate"
                                class="text-xs text-red-500"
                                >{{ vm.erorrs?.data?.startDate }}</span
                            >
                        </div>
                        <div class="w-full flex flex-col gap-2">
                            <span class="text-sm dark:text-gray-400"
                                >End Date</span
                            >
                            <DateInput
                                :model-value="
                                    vm.employee.employmentDetail.endDate
                                "
                                :with-range="false"
                                :placeholder="'End date'"
                                :readonly="false"
                                :with-time="false"
                                @update:model-value="
                                    (value) =>
                                        (vm.employee.employmentDetail.endDate =
                                            value instanceof Date
                                                ? value
                                                : undefined)
                                "
                            />
                            <span
                                v-if="vm.erorrs?.data?.endDate"
                                class="text-xs text-red-500"
                                >{{ vm.erorrs?.data?.endDate }}</span
                            >
                        </div>
                    </div>
                    <div class="flex flex-row gap-5 items-start">
                        <div class="w-full flex flex-col gap-2">
                            <span class="text-sm dark:text-gray-400"
                                >Resign Date</span
                            >
                            <DateInput
                                :model-value="
                                    vm.employee.employmentDetail.resignDate
                                "
                                :with-range="false"
                                :placeholder="'Resign date'"
                                :readonly="false"
                                :with-time="false"
                                @update:model-value="
                                    (value) =>
                                        (vm.employee.employmentDetail.resignDate =
                                            value instanceof Date
                                                ? value
                                                : undefined)
                                "
                            />
                            <span
                                v-if="vm.erorrs?.data?.resignDate"
                                class="text-xs text-red-500"
                                >{{ vm.erorrs?.data?.resignDate }}</span
                            >
                        </div>
                        <div class="w-full flex flex-col gap-2">
                            <span class="text-sm dark:text-gray-400"
                                >Status
                                <span class="text-red-500 text-xs"
                                    >*</span
                                ></span
                            >
                            <TextDropdownInput
                                :options="vm.statusOptions"
                                placeholder="Status"
                                :selected="selectedStatus"
                                :dontfilter="true"
                                :with-clear="true"
                                @update="
                                    (value) =>
                                        (vm.employee.employmentDetail.status =
                                            value.value)
                                "
                                @clear="
                                    () =>
                                        (vm.employee.employmentDetail.status =
                                            null)
                                "
                            />
                            <span
                                v-if="vm.erorrs?.data?.status"
                                class="text-xs text-red-500"
                                >{{ vm.erorrs?.data?.status }}</span
                            >
                        </div>
                    </div>
                </div>
                <div v-if="vm.steps === 5" class="w-full flex flex-col gap-4">
                    <span class="font-semibold dark:text-gray-200"
                        >Bank Detail</span
                    >
                    <div class="flex flex-row gap-5 items-start">
                        <TextInput
                            label="Account Name"
                            :value="vm.employee.bankDetail.accountName"
                            :placeholder="'Account Name'"
                            :error="vm.erorrs?.data?.accountName"
                            @input="
                                (v) => (vm.employee.bankDetail.accountName = v)
                            "
                        />
                        <TextInput
                            label="Account Number"
                            :value="vm.employee.bankDetail.accountNumber"
                            :placeholder="'Account Number'"
                            :error="vm.erorrs?.data?.accountNumber"
                            @input="
                                (v) =>
                                    (vm.employee.bankDetail.accountNumber = v)
                            "
                        />
                    </div>
                    <div class="flex flex-row gap-5 items-start">
                        <TextInput
                            label="Bank Name"
                            :value="vm.employee.bankDetail.bankName"
                            :placeholder="'Bank Name'"
                            :error="vm.erorrs?.data?.bankName"
                            @input="
                                (v) => (vm.employee.bankDetail.bankName = v)
                            "
                        />
                        <TextInput
                            label="IFSC Code"
                            :value="vm.employee.bankDetail.ifscCode"
                            :placeholder="'IFSC Code'"
                            :error="vm.erorrs?.data?.ifscCode"
                            @input="
                                (v) => (vm.employee.bankDetail.ifscCode = v)
                            "
                        />
                    </div>
                </div>
                <div v-if="vm.steps === 6" class="w-full flex flex-col gap-4">
                    <span class="font-semibold dark:text-gray-200"
                        >Insurance</span
                    >
                    <div class="flex flex-row gap-5 items-start">
                        <TextInput
                            label="No Bpjs Ketenagakerjaan"
                            :value="
                                vm.employee.insuranceDetail.bpjsKetenagakerjaan
                            "
                            :placeholder="'Bpjs Ketenagakerjaan'"
                            :error="vm.erorrs?.data?.bpjsKetenagakerjaan"
                            @input="
                                (v) =>
                                    (vm.employee.insuranceDetail.bpjsKetenagakerjaan =
                                        v)
                            "
                        />
                        <TextInput
                            label="No Bpjs Kesehatan"
                            :value="vm.employee.insuranceDetail.bpjsKesehatan"
                            :placeholder="'Bpjs Kesehatan'"
                            :error="vm.erorrs?.data?.bpjsKesehatan"
                            @input="
                                (v) =>
                                    (vm.employee.insuranceDetail.bpjsKesehatan =
                                        v)
                            "
                        />
                    </div>
                </div>
                <div class="w-full flex flex-row justify-end mt-4 gap-4">
                    <ButtonComponent
                        v-if="vm.steps > 1"
                        @click="vm.steps = vm.steps - 1"
                        :variant="'secondary'"
                        >Back</ButtonComponent
                    >
                    <ButtonComponent
                        v-if="vm.steps < 6"
                        @click="vm.stepByValidate()"
                        :variant="'primary'"
                        >Next</ButtonComponent
                    >
                    <ButtonComponent
                        v-if="vm.steps === 6"
                        :variant="'primary'"
                        :disabled="vm.submiting"
                        @click="vm.createEmployee()"
                        :loading="vm.submiting"
                        >Submit</ButtonComponent
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import TextInput from "@/core/components/input/Text.input.vue";
// import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import IconButton from "@/core/components/button/Icon.button.vue";
import TextDropdownInput from "@/core/components/input/TextDropdown.input.vue";
import { DropdownLabel } from "@/core/components/models/DropdownLabel";
import { computed, onMounted, ref } from "vue";
import ButtonComponent from "@/core/components/button/Button.component.vue";
import PhoneInput from "@/core/components/input/Phone.input.vue";
import { PhoneUI } from "@/core/ui/Phone.ui";
import DateInput from "@/core/components/input/Date.input.vue";
import { container } from "@/container/di";
import { TOKENS } from "@/container/tokens";
import Toast from "@/core/components/Toast.vue";
// import { useRoute } from "vue-router";

// const $route = useRoute();
const vm = ref(container.get(TOKENS.EmployeeFormViewModel));

const stepsOptions = [
    {
        label: "Personal Detail",
        value: 1,
    },
    {
        label: "Address",
        value: 2,
    },
    {
        label: "Contact Detail",
        value: 3,
    },
    {
        label: "Employment Data",
        value: 4,
    },
    {
        label: "Bank Detail",
        value: 5,
    },
    {
        label: "Insurance Detail",
        value: 6,
    },
];

const selectedBlood = computed(() => {
    return vm.value.employee.personalDetail.bloodType
        ? new DropdownLabel(vm.value.employee.personalDetail.bloodType)
        : null;
});

const selectedReligion = computed(() => {
    return vm.value.employee.personalDetail.religion
        ? new DropdownLabel(vm.value.employee.personalDetail.religion)
        : null;
});

const selectedDepartment = computed(() => {
    return vm.value.employee.employmentDetail.department
        ? new DropdownLabel(
              vm.value.employee.employmentDetail.department,
              "code",
              "name",
          )
        : null;
});

const selectedJobLevels = computed(() => {
    return vm.value.employee.employmentDetail.jobLevel
        ? new DropdownLabel(vm.value.employee.employmentDetail.jobLevel)
        : null;
});

const selectedEmploymentType = computed(() => {
    return vm.value.employee.employmentDetail.employmentType
        ? new DropdownLabel(vm.value.employee.employmentDetail.employmentType)
        : null;
});

const selectedStatus = computed(() => {
    return vm.value.employee.employmentDetail.status
        ? new DropdownLabel(vm.value.employee.employmentDetail.status)
        : null;
});

const selectedMaritalStatus = computed(() => {
    return vm.value.employee.personalDetail.maritalStatus
        ? new DropdownLabel(vm.value.employee.personalDetail.maritalStatus)
        : null;
});

const selectedRelation = computed(() => {
    return vm.value.employee.contactDetail.emergencyRelation
        ? new DropdownLabel(vm.value.employee.contactDetail.emergencyRelation)
        : null;
});

onMounted(() => {
    vm.value.initialize();
});
</script>

<style scoped></style>
