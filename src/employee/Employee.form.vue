<template>
    <div
        class="w-full min-h-screen flex flex-col items-center pb-28 md:pb-32 bg-gray-50/60 dark:bg-gray-900 text-gray-800"
    >
        <!-- Page header / breadcrumb -->
        <div class="w-full max-w-6xl mx-auto px-4 lg:px-8 pt-6">
            <div class="flex items-center justify-between">
                <nav class="flex items-center gap-2 text-sm">
                    <ButtonComponent
                        @click="$router.back()"
                        :variant="'outline'"
                        :icon-name="'fa-angle-left'"
                        >Back</ButtonComponent
                    >
                    <span class="text-gray-400">/</span>
                    <button
                        @click="$router.back()"
                        class="text-blue-600 dark:text-gray-200 hover:underline"
                    >
                        Employee
                    </button>
                    <span class="text-gray-400">/</span>
                    <span class="font-semibold dark:text-gray-200"
                        >{{ vm.isUpdate ? "Detail" : "Form" }} Employee</span
                    >
                </nav>
            </div>
        </div>

        <!-- Toast -->
        <Toast
            :duration="vm.alerts?.duration"
            :message="vm.alerts?.message ?? ''"
            :show="vm.alerts ? true : false"
            @on-close="vm.erorrs = null"
        />

        <!-- Wrapper -->
        <div class="w-full max-w-6xl mx-auto px-4 lg:px-8 mt-4">
            <div
                class="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-700"
            >
                <div class="grid grid-cols-1 md:grid-cols-12">
                    <!-- Stepper -->
                    <aside
                        class="md:col-span-4 lg:col-span-3 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700"
                    >
                        <div class="p-4 md:p-6 sticky top-4 md:top-6">
                            <h3
                                class="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3"
                            >
                                Steps
                            </h3>
                            <div
                                class="flex md:block overflow-x-auto md:overflow-visible gap-2 md:gap-0"
                            >
                                <div
                                    v-for="s in stepsOptions"
                                    :key="s.value"
                                    class="group w-full md:w-auto shrink-0 md:shrink md:block"
                                >
                                    <div
                                        class="flex items-center md:items-start gap-3 px-3 py-2 md:px-3 md:py-2 rounded-xl transition hover:bg-blue-50/60 dark:hover:bg-gray-700/60"
                                        :class="
                                            vm.steps === s.value
                                                ? 'bg-blue-50/70 dark:bg-gray-700/70 ring-1 ring-blue-200'
                                                : ''
                                        "
                                        :aria-current="
                                            vm.steps === s.value
                                                ? 'step'
                                                : false
                                        "
                                    >
                                        <span
                                            class="inline-flex items-center justify-center h-7 w-7 rounded-full text-xs font-semibold border transition"
                                            :class="
                                                vm.steps === s.value
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300'
                                            "
                                        >
                                            {{ s.value }}
                                        </span>
                                        <span
                                            class="text-sm font-medium dark:text-gray-200"
                                            >{{ s.label }}</span
                                        >
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    <!-- Content -->
                    <section class="md:col-span-8 lg:col-span-9">
                        <!-- Top progress (subtle) -->
                        <div
                            class="h-1 bg-gray-100 dark:bg-gray-700 rounded-t-2xl overflow-hidden"
                        >
                            <div
                                class="h-full bg-blue-500 transition-all duration-500"
                                :style="{
                                    width:
                                        (vm.steps / stepsOptions.length) * 100 +
                                        '%',
                                }"
                            ></div>
                        </div>

                        <div class="p-4 md:p-6 lg:p-8 space-y-6">
                            <!-- Step 1 -->
                            <transition name="fade" mode="out-in">
                                <div
                                    v-if="vm.steps === 1"
                                    key="step-1"
                                    class="space-y-6"
                                >
                                    <header>
                                        <h2
                                            class="text-lg font-semibold dark:text-gray-200"
                                        >
                                            Personal Detail
                                        </h2>
                                        <p
                                            class="text-sm text-gray-500 dark:text-gray-400"
                                        >
                                            Isi identitas dasar karyawan.
                                        </p>
                                    </header>

                                    <div class="grid md:grid-cols-2 gap-5">
                                        <TextInput
                                            label="First Name"
                                            :value="
                                                vm.employee.personalDetail
                                                    .firstName
                                            "
                                            :placeholder="'Firstname'"
                                            :error="vm.erorrs?.data?.firstName"
                                            @input="
                                                (v) =>
                                                    (vm.employee.personalDetail.firstName =
                                                        v)
                                            "
                                        />
                                        <TextInput
                                            label="Last Name"
                                            :value="
                                                vm.employee.personalDetail
                                                    .lastName
                                            "
                                            :placeholder="'Lastname'"
                                            :error="vm.erorrs?.data?.lastName"
                                            @input="
                                                (v) =>
                                                    (vm.employee.personalDetail.lastName =
                                                        v)
                                            "
                                        />
                                    </div>

                                    <div class="grid md:grid-cols-2 gap-5">
                                        <TextInput
                                            label="Nickname"
                                            :value="
                                                vm.employee.personalDetail
                                                    .nickName
                                            "
                                            :placeholder="'Nickname'"
                                            :error="vm.erorrs?.data?.nickName"
                                            @input="
                                                (v) =>
                                                    (vm.employee.personalDetail.nickName =
                                                        v)
                                            "
                                        />
                                        <div class="flex flex-col gap-2">
                                            <label class="text-sm"
                                                >Birth Date
                                                <span class="text-red-500"
                                                    >*</span
                                                ></label
                                            >
                                            <DateInput
                                                :model-value="
                                                    vm.employee.personalDetail
                                                        .birthDate
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
                                                v-if="
                                                    vm.erorrs?.data?.birthDate
                                                "
                                                class="text-xs text-red-500"
                                                >{{
                                                    vm.erorrs?.data?.birthDate
                                                }}</span
                                            >
                                        </div>
                                    </div>

                                    <div class="grid md:grid-cols-2 gap-5">
                                        <TextInput
                                            label="Birth Place"
                                            :value="
                                                vm.employee.personalDetail
                                                    .birthPlace
                                            "
                                            :placeholder="'Place'"
                                            :error="vm.erorrs?.data?.birthPlace"
                                            @input="
                                                (v) =>
                                                    (vm.employee.personalDetail.birthPlace =
                                                        v)
                                            "
                                        />
                                        <div class="flex flex-col gap-2">
                                            <TextDropdownInput
                                                label="Golongan Darah"
                                                :options="vm.bloodGroupOptions"
                                                placeholder="Pilih Golongan Darah"
                                                :selected="selectedBlood"
                                                :dontfilter="true"
                                                @update="
                                                    (v) =>
                                                        (vm.employee.personalDetail.bloodType =
                                                            v.value)
                                                "
                                                @clear="
                                                    () =>
                                                        (vm.employee.personalDetail.bloodType =
                                                            null)
                                                "
                                            />
                                            <span
                                                v-if="
                                                    vm.erorrs?.data?.bloodType
                                                "
                                                class="text-xs text-red-500"
                                                >{{
                                                    vm.erorrs?.data?.bloodType
                                                }}</span
                                            >
                                        </div>
                                    </div>

                                    <div class="grid md:grid-cols-2 gap-5">
                                        <div class="flex flex-col gap-2">
                                            <TextDropdownInput
                                                label="Religion"
                                                :options="vm.religionOptions"
                                                placeholder="Pilih Agama"
                                                :selected="selectedReligion"
                                                :dontfilter="true"
                                                @update="
                                                    (v) =>
                                                        (vm.employee.personalDetail.religion =
                                                            v.value)
                                                "
                                                @clear="
                                                    () =>
                                                        (vm.employee.personalDetail.religion =
                                                            null)
                                                "
                                            />
                                            <span
                                                v-if="vm.erorrs?.data?.religion"
                                                class="text-xs text-red-500"
                                                >{{
                                                    vm.erorrs?.data?.religion
                                                }}</span
                                            >
                                        </div>

                                        <div class="flex flex-col gap-2">
                                            <TextDropdownInput
                                                label="Status"
                                                :options="
                                                    vm.maritalStatusOptions
                                                "
                                                placeholder="Status"
                                                :selected="
                                                    selectedMaritalStatus
                                                "
                                                :dontfilter="true"
                                                :with-clear="true"
                                                @update="
                                                    (v) =>
                                                        (vm.employee.personalDetail.maritalStatus =
                                                            v.value)
                                                "
                                                @clear="
                                                    () =>
                                                        (vm.employee.personalDetail.maritalStatus =
                                                            null)
                                                "
                                            />
                                            <span
                                                v-if="
                                                    vm.erorrs?.data
                                                        ?.maritalStatus
                                                "
                                                class="text-xs text-red-500"
                                                >{{
                                                    vm.erorrs?.data
                                                        ?.maritalStatus
                                                }}</span
                                            >
                                        </div>
                                    </div>

                                    <div class="flex flex-col gap-2">
                                        <label
                                            class="text-sm dark:text-gray-400"
                                            >Gender
                                            <span class="text-red-500"
                                                >*</span
                                            ></label
                                        >
                                        <div class="flex gap-8 py-2">
                                            <label
                                                class="inline-flex items-center gap-3 cursor-pointer"
                                            >
                                                <span class="relative">
                                                    <input
                                                        type="radio"
                                                        name="gender"
                                                        class="peer sr-only"
                                                        :checked="
                                                            vm.employee
                                                                .personalDetail
                                                                .gender === 'M'
                                                        "
                                                        @change="
                                                            vm.employee.personalDetail.gender =
                                                                'M'
                                                        "
                                                    />
                                                    <span
                                                        class="block h-5 w-5 rounded-full border border-gray-300 dark:border-gray-600 peer-checked:border-blue-600 peer-checked:ring-4 ring-blue-100"
                                                    ></span>
                                                    <span
                                                        class="absolute inset-1 rounded-full bg-blue-600 scale-0 peer-checked:scale-100 transition"
                                                    ></span>
                                                </span>
                                                <span
                                                    class="text-sm dark:text-gray-300"
                                                    >Male</span
                                                >
                                            </label>

                                            <label
                                                class="inline-flex items-center gap-3 cursor-pointer"
                                            >
                                                <span class="relative">
                                                    <input
                                                        type="radio"
                                                        name="gender"
                                                        class="peer sr-only"
                                                        :checked="
                                                            vm.employee
                                                                .personalDetail
                                                                .gender === 'F'
                                                        "
                                                        @change="
                                                            vm.employee.personalDetail.gender =
                                                                'F'
                                                        "
                                                    />
                                                    <span
                                                        class="block h-5 w-5 rounded-full border border-gray-300 dark:border-gray-600 peer-checked:border-blue-600 peer-checked:ring-4 ring-blue-100"
                                                    ></span>
                                                    <span
                                                        class="absolute inset-1 rounded-full bg-blue-600 scale-0 peer-checked:scale-100 transition"
                                                    ></span>
                                                </span>
                                                <span
                                                    class="text-sm dark:text-gray-300"
                                                    >Female</span
                                                >
                                            </label>
                                        </div>
                                        <span
                                            v-if="vm.erorrs?.data?.gender"
                                            class="text-xs text-red-500"
                                            >{{ vm.erorrs?.data?.gender }}</span
                                        >
                                    </div>
                                </div>
                            </transition>

                            <!-- Step 2 -->
                            <transition name="fade" mode="out-in">
                                <div
                                    v-if="vm.steps === 2"
                                    key="step-2"
                                    class="space-y-6"
                                >
                                    <header>
                                        <h2
                                            class="text-lg font-semibold dark:text-gray-200"
                                        >
                                            Address
                                        </h2>
                                        <p
                                            class="text-sm text-gray-500 dark:text-gray-400"
                                        >
                                            Alamat domisili karyawan.
                                        </p>
                                    </header>

                                    <div class="grid md:grid-cols-2 gap-5">
                                        <TextInput
                                            optional="true"
                                            label="Country"
                                            :value="vm.employee.address.country"
                                            :placeholder="'Country'"
                                            @input="
                                                (v) =>
                                                    (vm.employee.address.country =
                                                        v)
                                            "
                                        />
                                        <TextInput
                                            optional="true"
                                            label="Province"
                                            :value="
                                                vm.employee.address.province
                                            "
                                            :placeholder="'Province'"
                                            @input="
                                                (v) =>
                                                    (vm.employee.address.province =
                                                        v)
                                            "
                                        />
                                        <TextInput
                                            optional="true"
                                            label="City"
                                            :value="vm.employee.address.city"
                                            :placeholder="'City'"
                                            @input="
                                                (v) =>
                                                    (vm.employee.address.city =
                                                        v)
                                            "
                                        />
                                        <TextInput
                                            optional="true"
                                            label="Street"
                                            :value="vm.employee.address.street"
                                            :placeholder="'Street'"
                                            @input="
                                                (v) =>
                                                    (vm.employee.address.street =
                                                        v)
                                            "
                                        />
                                        <TextInput
                                            optional="true"
                                            label="Zip Code"
                                            :value="vm.employee.address.zipCode"
                                            :placeholder="'Postal Code'"
                                            @input="
                                                (v) =>
                                                    (vm.employee.address.zipCode =
                                                        v)
                                            "
                                        />
                                    </div>
                                </div>
                            </transition>

                            <!-- Step 3 -->
                            <transition name="fade" mode="out-in">
                                <div
                                    v-if="vm.steps === 3"
                                    key="step-3"
                                    class="space-y-6"
                                >
                                    <header>
                                        <h2
                                            class="text-lg font-semibold dark:text-gray-200"
                                        >
                                            Contact Detail
                                        </h2>
                                    </header>

                                    <div class="grid md:grid-cols-2 gap-5">
                                        <TextInput
                                            label="Email"
                                            :value="
                                                vm.employee.contactDetail.email
                                            "
                                            :placeholder="'email@gmail.com'"
                                            :error="vm.erorrs?.data?.email"
                                            @input="
                                                (v) =>
                                                    (vm.employee.contactDetail.email =
                                                        v)
                                            "
                                        />
                                        <div class="flex flex-col gap-2">
                                            <PhoneInput
                                                :label="'Phone Number (Whatsapp)'"
                                                :phone="
                                                    vm.employee.contactDetail
                                                        .phoneNumber
                                                "
                                                @input="
                                                    (v) =>
                                                        (vm.employee.contactDetail.phoneNumber =
                                                            new PhoneUI(v))
                                                "
                                            />
                                            <span
                                                v-if="
                                                    vm.erorrs?.data?.phoneNumber
                                                "
                                                class="text-xs text-red-500"
                                                >{{
                                                    vm.erorrs?.data?.phoneNumber
                                                }}</span
                                            >
                                        </div>
                                    </div>

                                    <div class="pt-2">
                                        <h3
                                            class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3"
                                        >
                                            Emergency Contact
                                        </h3>
                                        <div class="grid md:grid-cols-2 gap-5">
                                            <TextInput
                                                label="Name"
                                                :value="
                                                    vm.employee.contactDetail
                                                        .emergencyName
                                                "
                                                :placeholder="'Name'"
                                                :error="
                                                    vm.erorrs?.data
                                                        ?.emergencyName
                                                "
                                                @input="
                                                    (v) =>
                                                        (vm.employee.contactDetail.emergencyName =
                                                            v)
                                                "
                                            />
                                            <div class="flex flex-col gap-2">
                                                <TextDropdownInput
                                                    label="Relasi"
                                                    :options="
                                                        vm.relationOptions
                                                    "
                                                    placeholder="Relasi"
                                                    :selected="selectedRelation"
                                                    :dontfilter="true"
                                                    :with-clear="true"
                                                    @update="
                                                        (v) =>
                                                            (vm.employee.contactDetail.emergencyRelation =
                                                                v.value)
                                                    "
                                                    @clear="
                                                        () =>
                                                            (vm.employee.contactDetail.emergencyRelation =
                                                                null)
                                                    "
                                                />
                                                <span
                                                    v-if="
                                                        vm.erorrs?.data
                                                            ?.emergencyRelation
                                                    "
                                                    class="text-xs text-red-500"
                                                    >{{
                                                        vm.erorrs?.data
                                                            ?.emergencyRelation
                                                    }}</span
                                                >
                                            </div>
                                            <div
                                                class="md:col-span-2 flex flex-col gap-2"
                                            >
                                                <PhoneInput
                                                    :label="'Phone Number (Whatsapp)'"
                                                    :phone="
                                                        vm.employee
                                                            .contactDetail
                                                            .emergencyPhoneNumber
                                                    "
                                                    @input="
                                                        (v) =>
                                                            (vm.employee.contactDetail.emergencyPhoneNumber =
                                                                new PhoneUI(v))
                                                    "
                                                />
                                                <span
                                                    v-if="
                                                        vm.erorrs?.data
                                                            ?.emergencyPhoneNumber
                                                    "
                                                    class="text-xs text-red-500"
                                                    >{{
                                                        vm.erorrs?.data
                                                            ?.emergencyPhoneNumber
                                                    }}</span
                                                >
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </transition>

                            <!-- Step 4 -->
                            <transition name="fade" mode="out-in">
                                <div
                                    v-if="vm.steps === 4"
                                    key="step-4"
                                    class="space-y-6"
                                >
                                    <header>
                                        <h2
                                            class="text-lg font-semibold dark:text-gray-200"
                                        >
                                            Employment Data
                                        </h2>
                                    </header>

                                    <div class="grid md:grid-cols-2 gap-5">
                                        <TextInput
                                            label="Employee Id"
                                            :value="
                                                vm.employee.employmentDetail
                                                    .employeeId
                                            "
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
                                            :value="
                                                vm.employee.employmentDetail
                                                    .fingerCode
                                            "
                                            :placeholder="'Finger Code'"
                                            :error="vm.erorrs?.data?.fingerCode"
                                            @input="
                                                (v) =>
                                                    (vm.employee.employmentDetail.fingerCode =
                                                        v)
                                            "
                                        />
                                    </div>

                                    <div class="grid md:grid-cols-2 gap-5">
                                        <div class="flex flex-col gap-2">
                                            <TextDropdownInput
                                                label="Department"
                                                :options="vm.departMentOptions"
                                                placeholder="Pilih Department"
                                                :selected="selectedDepartment"
                                                :dontfilter="true"
                                                :with-clear="true"
                                                @update="
                                                    (v) =>
                                                        (vm.employee.employmentDetail.department =
                                                            v.value)
                                                "
                                                @clear="
                                                    () =>
                                                        (vm.employee.employmentDetail.department =
                                                            null)
                                                "
                                            />
                                            <span
                                                v-if="
                                                    vm.erorrs?.data?.department
                                                "
                                                class="text-xs text-red-500"
                                                >{{
                                                    vm.erorrs?.data?.department
                                                }}</span
                                            >
                                        </div>

                                        <div class="flex flex-col gap-2">
                                            <TextDropdownInput
                                                label="Job Level"
                                                :options="vm.jobLevelOptions"
                                                placeholder="Pilih Job Level"
                                                :selected="selectedJobLevels"
                                                :dontfilter="true"
                                                :with-clear="true"
                                                @update="
                                                    (v) =>
                                                        (vm.employee.employmentDetail.jobLevel =
                                                            v.value)
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
                                                >{{
                                                    vm.erorrs?.data?.jobLevel
                                                }}</span
                                            >
                                        </div>
                                    </div>

                                    <div class="grid md:grid-cols-2 gap-5">
                                        <TextInput
                                            label="Job Title"
                                            :value="
                                                vm.employee.employmentDetail
                                                    .jobTitle
                                            "
                                            :placeholder="'Job Title'"
                                            :error="vm.erorrs?.data?.jobTitle"
                                            @input="
                                                (v) =>
                                                    (vm.employee.employmentDetail.jobTitle =
                                                        v)
                                            "
                                        />
                                        <div class="flex flex-col gap-2">
                                            <TextDropdownInput
                                                label="Employment Type"
                                                :options="
                                                    vm.employmentTypeOptions
                                                "
                                                placeholder="Pilih Type"
                                                :selected="
                                                    selectedEmploymentType
                                                "
                                                :dontfilter="true"
                                                :with-clear="true"
                                                @update="
                                                    (v) =>
                                                        (vm.employee.employmentDetail.employmentType =
                                                            v.value)
                                                "
                                                @clear="
                                                    () =>
                                                        (vm.employee.employmentDetail.employmentType =
                                                            null)
                                                "
                                            />
                                            <span
                                                v-if="
                                                    vm.erorrs?.data
                                                        ?.employmentType
                                                "
                                                class="text-xs text-red-500"
                                                >{{
                                                    vm.erorrs?.data
                                                        ?.employmentType
                                                }}</span
                                            >
                                        </div>
                                    </div>

                                    <div class="grid md:grid-cols-2 gap-5">
                                        <div class="flex flex-col gap-2">
                                            <label
                                                class="text-sm dark:text-gray-400"
                                                >Start Date
                                                <span
                                                    class="text-red-500 text-xs"
                                                    >*</span
                                                ></label
                                            >
                                            <DateInput
                                                :model-value="
                                                    vm.employee.employmentDetail
                                                        .startDate
                                                "
                                                :with-range="false"
                                                :placeholder="'Start date'"
                                                :readonly="false"
                                                :with-time="false"
                                                @update:model-value="
                                                    (v) =>
                                                        (vm.employee.employmentDetail.startDate =
                                                            v instanceof Date
                                                                ? v
                                                                : undefined)
                                                "
                                            />
                                            <span
                                                v-if="
                                                    vm.erorrs?.data?.startDate
                                                "
                                                class="text-xs text-red-500"
                                                >{{
                                                    vm.erorrs?.data?.startDate
                                                }}</span
                                            >
                                        </div>

                                        <div class="flex flex-col gap-2">
                                            <label
                                                class="text-sm dark:text-gray-400"
                                                >End Date</label
                                            >
                                            <DateInput
                                                :model-value="
                                                    vm.employee.employmentDetail
                                                        .endDate
                                                "
                                                :with-range="false"
                                                :placeholder="'End date'"
                                                :readonly="false"
                                                :with-time="false"
                                                @update:model-value="
                                                    (v) =>
                                                        (vm.employee.employmentDetail.endDate =
                                                            v instanceof Date
                                                                ? v
                                                                : undefined)
                                                "
                                            />
                                            <span
                                                v-if="vm.erorrs?.data?.endDate"
                                                class="text-xs text-red-500"
                                                >{{
                                                    vm.erorrs?.data?.endDate
                                                }}</span
                                            >
                                        </div>
                                    </div>

                                    <div class="grid md:grid-cols-2 gap-5">
                                        <div class="flex flex-col gap-2">
                                            <label
                                                class="text-sm dark:text-gray-400"
                                                >Resign Date</label
                                            >
                                            <DateInput
                                                :model-value="
                                                    vm.employee.employmentDetail
                                                        .resignDate
                                                "
                                                :with-range="false"
                                                :placeholder="'Resign date'"
                                                :readonly="false"
                                                :with-time="false"
                                                @update:model-value="
                                                    (v) =>
                                                        (vm.employee.employmentDetail.resignDate =
                                                            v instanceof Date
                                                                ? v
                                                                : undefined)
                                                "
                                            />
                                            <span
                                                v-if="
                                                    vm.erorrs?.data?.resignDate
                                                "
                                                class="text-xs text-red-500"
                                                >{{
                                                    vm.erorrs?.data?.resignDate
                                                }}</span
                                            >
                                        </div>

                                        <div class="flex flex-col gap-2">
                                            <label
                                                class="text-sm dark:text-gray-400"
                                                >Status
                                                <span
                                                    class="text-red-500 text-xs"
                                                    >*</span
                                                ></label
                                            >
                                            <TextDropdownInput
                                                :options="vm.statusOptions"
                                                placeholder="Status"
                                                :selected="selectedStatus"
                                                :dontfilter="true"
                                                :with-clear="true"
                                                @update="
                                                    (v) =>
                                                        (vm.employee.employmentDetail.status =
                                                            v.value)
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
                                                >{{
                                                    vm.erorrs?.data?.status
                                                }}</span
                                            >
                                        </div>
                                    </div>
                                </div>
                            </transition>

                            <!-- Step 5 -->
                            <transition name="fade" mode="out-in">
                                <div
                                    v-if="vm.steps === 5"
                                    key="step-5"
                                    class="space-y-6"
                                >
                                    <header>
                                        <h2
                                            class="text-lg font-semibold dark:text-gray-200"
                                        >
                                            Bank Detail
                                        </h2>
                                    </header>

                                    <div class="grid md:grid-cols-2 gap-5">
                                        <TextInput
                                            label="Account Name"
                                            :value="
                                                vm.employee.bankDetail
                                                    .accountName
                                            "
                                            :placeholder="'Account Name'"
                                            :error="
                                                vm.erorrs?.data?.accountName
                                            "
                                            @input="
                                                (v) =>
                                                    (vm.employee.bankDetail.accountName =
                                                        v)
                                            "
                                        />
                                        <TextInput
                                            label="Account Number"
                                            :value="
                                                vm.employee.bankDetail
                                                    .accountNumber
                                            "
                                            :placeholder="'Account Number'"
                                            :error="
                                                vm.erorrs?.data?.accountNumber
                                            "
                                            @input="
                                                (v) =>
                                                    (vm.employee.bankDetail.accountNumber =
                                                        v)
                                            "
                                        />
                                        <TextInput
                                            label="Bank Name"
                                            :value="
                                                vm.employee.bankDetail.bankName
                                            "
                                            :placeholder="'Bank Name'"
                                            :error="vm.erorrs?.data?.bankName"
                                            @input="
                                                (v) =>
                                                    (vm.employee.bankDetail.bankName =
                                                        v)
                                            "
                                        />
                                        <TextInput
                                            label="IFSC Code"
                                            :value="
                                                vm.employee.bankDetail.ifscCode
                                            "
                                            :placeholder="'IFSC Code'"
                                            :error="vm.erorrs?.data?.ifscCode"
                                            @input="
                                                (v) =>
                                                    (vm.employee.bankDetail.ifscCode =
                                                        v)
                                            "
                                        />
                                    </div>
                                </div>
                            </transition>

                            <!-- Step 6 -->
                            <transition name="fade" mode="out-in">
                                <div
                                    v-if="vm.steps === 6"
                                    key="step-6"
                                    class="space-y-6"
                                >
                                    <header>
                                        <h2
                                            class="text-lg font-semibold dark:text-gray-200"
                                        >
                                            Insurance
                                        </h2>
                                    </header>

                                    <div class="grid md:grid-cols-2 gap-5">
                                        <TextInput
                                            label="No Bpjs Ketenagakerjaan"
                                            :value="
                                                vm.employee.insuranceDetail
                                                    .bpjsKetenagakerjaan
                                            "
                                            :placeholder="'Bpjs Ketenagakerjaan'"
                                            :error="
                                                vm.erorrs?.data
                                                    ?.bpjsKetenagakerjaan
                                            "
                                            @input="
                                                (v) =>
                                                    (vm.employee.insuranceDetail.bpjsKetenagakerjaan =
                                                        v)
                                            "
                                        />
                                        <TextInput
                                            label="No Bpjs Kesehatan"
                                            :value="
                                                vm.employee.insuranceDetail
                                                    .bpjsKesehatan
                                            "
                                            :placeholder="'Bpjs Kesehatan'"
                                            :error="
                                                vm.erorrs?.data?.bpjsKesehatan
                                            "
                                            @input="
                                                (v) =>
                                                    (vm.employee.insuranceDetail.bpjsKesehatan =
                                                        v)
                                            "
                                        />
                                    </div>
                                </div>
                            </transition>
                        </div>
                    </section>
                </div>
            </div>
        </div>

        <!-- Sticky action bar -->
        <div class="fixed bottom-0 inset-x-0 z-40">
            <div class="mx-auto w-full max-w-6xl px-4 lg:px-8 pb-4">
                <div
                    class="rounded-2xl shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur px-4 py-3"
                >
                    <div class="flex items-center justify-between gap-3">
                        <div class="text-sm text-gray-600 dark:text-gray-400">
                            Step {{ vm.steps }} of {{ stepsOptions.length }}
                        </div>
                        <div class="flex gap-3">
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
        </div>
    </div>
</template>

<script setup lang="ts">
import TextInput from "@/core/components/input/Text.input.vue";
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
import { formatFeatureLabel } from "@/core/utils/Text";

const vm = ref(container.get(TOKENS.EmployeeFormViewModel));

const stepsOptions = [
    { label: "Personal Detail", value: 1 },
    { label: "Address", value: 2 },
    { label: "Contact Detail", value: 3 },
    { label: "Employment Data", value: 4 },
    { label: "Bank Detail", value: 5 },
    { label: "Insurance Detail", value: 6 },
];

const selectedBlood = computed(() =>
    vm.value.employee.personalDetail.bloodType
        ? new DropdownLabel(vm.value.employee.personalDetail.bloodType)
        : null,
);
const selectedReligion = computed(() =>
    vm.value.employee.personalDetail.religion
        ? new DropdownLabel(vm.value.employee.personalDetail.religion)
        : null,
);
const selectedDepartment = computed(() =>
    vm.value.employee.employmentDetail.department
        ? new DropdownLabel(
              vm.value.employee.employmentDetail.department,
              "code",
              "name",
          )
        : null,
);
const selectedJobLevels = computed(() =>
    vm.value.employee.employmentDetail.jobLevel
        ? {
            id: vm.value.employee.employmentDetail.jobLevel,
            label: formatFeatureLabel(vm.value.employee.employmentDetail.jobLevel),
            value: vm.value.employee.employmentDetail.jobLevel,
        } as DropdownLabel<string>
        : null,
);
const selectedEmploymentType = computed(() =>
    vm.value.employee.employmentDetail.employmentType
        ?{
            id: vm.value.employee.employmentDetail.employmentType,
            label: formatFeatureLabel(vm.value.employee.employmentDetail.employmentType),
            value: vm.value.employee.employmentDetail.employmentType,
        } as DropdownLabel<string>
        : null,
);
const selectedStatus = computed(() =>
    vm.value.employee.employmentDetail.status
        ? {
            id: vm.value.employee.employmentDetail.status,
            label: formatFeatureLabel(vm.value.employee.employmentDetail.status),
            value: vm.value.employee.employmentDetail.status,
        } as DropdownLabel<string>
        : null,
);
const selectedMaritalStatus = computed(() =>
    vm.value.employee.personalDetail.maritalStatus
        ? new DropdownLabel(vm.value.employee.personalDetail.maritalStatus)
        : null,
);
const selectedRelation = computed(() =>
    vm.value.employee.contactDetail.emergencyRelation
        ? new DropdownLabel(vm.value.employee.contactDetail.emergencyRelation)
        : null,
);

onMounted(() => {
    vm.value.initialize();
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
