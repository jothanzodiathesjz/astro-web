<template>
    <div class="w-full h-full flex flex-col dark:bg-gray-900 px-5 pb-7">
        <Toast
            :duration="vm.alerts?.duration"
            :message="vm.alerts?.message ?? ''"
            :show="vm.alerts ? true : false"
            :type="vm.alerts?.type"
            @on-close="vm.errors = null"
        />
        <!-- <div
            class="bg-white w-full dark:bg-gray-700 flex flex-row px-3 py-3 gap-2 rounded mt-4"
        >
            <IconButton @click="$router.back()" :icon-name="'fa-angle-left'" />
            <span class="font-semibold dark:text-gray-200">Form User</span>
        </div> -->
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
                    >User</span
                >
                <IconButton :icon-name="'fa-angle-right'" />
                <span class="font-semibold text-gray-800 dark:text-gray-200"
                    >{{ vm.isUpdate ? "Detail" : "Form" }} User</span
                >
            </div>
        </div>
        <!-- <div class="flex flex-row py-2 gap-2">
            <span
                @click="$router.back()"
                class="font-semibold text-blue-600 dark:text-gray-200 cursor-pointer"
                >User</span
            >
            <IconButton :icon-name="'fa-angle-right'" />
            <span class="font-semibold text-gray-800 dark:text-gray-200"
                >{{ vm.isUpdate ? "Detail" : "Form" }} User</span
            >
        </div> -->
        <div
            class="w-full flex flex-col mt-5 px-5 py-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-700"
        >
            <div class="w-full p-5 flex flex-col gap-3">
                <div class="w-full flex flex-col gap-4">
                    <span class="font-semibold dark:text-gray-200"
                        >Personal Data</span
                    >
                    <div class="flex flex-row gap-5 items-end">
                        <TextInput
                            label="Username"
                            :value="vm.user.username"
                            :placeholder="'Username'"
                            :error="vm.errors?.data?.username"
                            @input="(value) => (vm.user.username = value)"
                        />
                        <TextInput
                            label="Full name"
                            :value="vm.user.name"
                            :placeholder="'Fullname'"
                            :error="vm.errors?.data?.name"
                            @input="(value) => (vm.user.name = value)"
                        />
                    </div>
                    <div class="flex flex-row gap-5 items-end">
                        <TextInput
                            label="Email"
                            :value="vm.user.email"
                            :placeholder="'email@gmail.com'"
                            :error="vm.errors?.data?.email"
                            @input="(value) => (vm.user.email = value)"
                        />
                        <TextInput
                            label="Branch Id"
                            :readonly="true"
                            :value="vm.user.branch_uuid.toUpperCase()"
                            :placeholder="'Branch Id'"
                        />
                    </div>
                    <div class="grid grid-cols-2 gap-5 items-end">
                        <div class="flex flex-col gap-2">
                            <span class="text-sm dark:text-gray-400"
                                >Gender</span
                            >
                            <div class="flex flex-row gap-16 shrink-0 py-2">
                                <div
                                    class="flex flex-row gap-3"
                                    v-for="gender in ['MALE', 'FEMALE']"
                                >
                                    <button
                                        class="border flex items-center justify-center rounded-full w-6 h-6 border-gray-300 shrink-0 relative"
                                        @click="
                                            vm.selectedGender =
                                                gender === 'MALE' ? 'M' : 'F'
                                        "
                                    >
                                        <span
                                            :class="
                                                vm.selectedGender ===
                                                (gender === 'MALE' ? 'M' : 'F')
                                                    ? 'bg-blue-500 absolute w-3 h-3 rounded-full'
                                                    : ''
                                            "
                                        ></span>
                                    </button>
                                    <span class="dark:text-gray-400 text-sm">{{
                                        gender
                                    }}</span>
                                </div>
                            </div>
                            <span
                                class="text-xs text-red-500"
                                v-if="vm.errors?.data?.gender"
                                >{{ vm.errors?.data?.gender }}</span
                            >
                        </div>
                    </div>
                </div>
                <div class="w-full flex flex-col gap-4 mt-5">
                    <span class="font-semibold dark:text-gray-200"
                        >Advance Data</span
                    >
                    <div class="grid grid-cols-2 gap-5 items-start">
                        <TextInput
                            label="Employee Id"
                            :value="vm.user.employee_id"
                            :placeholder="'ID'"
                            :error="vm.errors?.data?.employeeId"
                            @input="(value) => (vm.user.employee_id = value)"
                        />
                        <div class="flex flex-col gap-1">
                            <TextDropdownInput
                                :options="vm.roleOptions"
                                label="Role"
                                :selected="vm.selectedRole"
                                :dontfilter="true"
                                :placeholder="'Role'"
                                @update="(value) => (vm.selectedRole = value)"
                            />
                            <span
                                class="text-xs text-red-500"
                                v-if="vm.errors?.data?.role"
                                >{{ vm.errors?.data?.role }}</span
                            >
                        </div>
                    </div>
                    <div class="flex flex-row gap-5 items-start">
                        <TextInput
                            label="Password"
                            :hidden="true"
                            :value="vm.password"
                            :placeholder="'Password'"
                            :error="vm.errors?.data?.password"
                            @input="(value) => (vm.password = value)"
                        />
                        <TextInput
                            label="Repeat Password"
                            :hidden="true"
                            :value="vm.confirmPassword"
                            :placeholder="'Repeat Password'"
                            @input="(value) => (vm.confirmPassword = value)"
                            :error="
                                vm.confirmPassword &&
                                vm.password !== vm.confirmPassword
                                    ? 'Password not match'
                                    : ''
                            "
                        />
                    </div>
                    <div class="flex flex-col gap-2">
                        <div class="flex flex-row items-center gap-4">
                            <span class="text-sm dark:text-gray-400"
                                >Select Access Feature</span
                            >
                        </div>
                        <div class="grid grid-cols-6 gap-3">
                            <div
                                class="flex flex-row gap-3 items-center"
                                @click="vm.toggleSelectAll(isAllSelected)"
                            >
                                <button
                                    class="flex flex-row gap-2 items-center rounded font-semibold"
                                >
                                    <FontAwesomeIcon
                                        v-if="isAllSelected"
                                        class="text-xl text-blue-500"
                                        icon="fa-regular fa-circle-check"
                                    />
                                    <font-awesome-icon
                                        v-else
                                        class="text-xl text-gray-500"
                                        icon="fa-regular fa-circle"
                                    />
                                </button>
                                <span class="text-xs">ALL</span>
                            </div>
                            <div
                                v-for="option in vm.accessFeatureOptions"
                                :key="option"
                                class="flex flex-row gap-3 items-center"
                                @click="
                                    vm.selectedAccessFeature.has(option)
                                        ? vm.selectedAccessFeature.delete(
                                              option,
                                          )
                                        : vm.selectedAccessFeature.add(option)
                                "
                            >
                                <button
                                    class="flex flex-row gap-2 items-center rounded font-semibold"
                                    :class="
                                        vm.selectedAccessFeature.has(option)
                                            ? ''
                                            : ''
                                    "
                                >
                                    <FontAwesomeIcon
                                        v-if="
                                            vm.selectedAccessFeature.has(option)
                                        "
                                        class="text-xl text-blue-500"
                                        icon="fa-regular fa-circle-check"
                                    />
                                    <font-awesome-icon
                                        v-else
                                        class="text-xl text-gray-500"
                                        icon="fa-regular fa-circle"
                                    />
                                </button>
                                <span class="text-xs">{{ option }}</span>
                            </div>
                        </div>
                        <span
                            class="text-xs text-red-500"
                            v-if="vm.errors?.data?.accessFeature"
                            >{{ vm.errors?.data?.accessFeature }}</span
                        >
                    </div>
                </div>
                <div class="w-full flex flex-row justify-end mt-4 gap-4">
                    <ButtonComponent
                        @click="vm.save()"
                        :variant="'primary'"
                        :disabled="vm.submiting"
                        >{{ vm.isUpdate ? "Update" : "Save" }}</ButtonComponent
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import TextInput from "@/core/components/input/Text.input.vue";
import IconButton from "@/core/components/button/Icon.button.vue";
import { computed, onMounted, ref } from "vue";
import ButtonComponent from "@/core/components/button/Button.component.vue";
import TextDropdownInput from "@/core/components/input/TextDropdown.input.vue";
import { container } from "@/container/di";
import { TOKENS } from "@/container/tokens";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useRoute } from "vue-router";
import Toast from "@/core/components/Toast.vue";

const vm = ref(container.get(TOKENS.UserFormViewModel));
const route = useRoute();

const isAllSelected = computed(() => {
    return (
        vm.value.selectedAccessFeature.size ===
        vm.value.accessFeatureOptions.length
    );
});

onMounted(() => {
    if (route.params.uuid) {
        vm.value.isUpdate = true;
        vm.value.getUser();
    }
});
</script>

<style scoped></style>
