<template>
    <div class="w-full h-full min-h-0 flex flex-col px-5 dark:bg-gray-900">
        <Toast
            :duration="alerts?.duration"
            :message="alerts?.message ?? ''"
            :show="alerts ? true : false"
            @on-close="((alerts = null), (errors = null))"
        />
        <!-- <div
            class="bg-white w-full dark:bg-gray-700 flex flex-row px-3 py-3 gap-2 rounded mt-4"
        >
            <IconButton @click="$router.back()" :icon-name="'fa-angle-left'" />
            <span class="font-semibold dark:text-gray-200"
                >Form Department</span
            >
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
                    >Department</span
                >
                <IconButton :icon-name="'fa-angle-right'" />
                <span class="font-semibold text-gray-800 dark:text-gray-200"
                    >Form Department</span
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
            <div class="w-full flex flex-row justify-end">
                <ButtonComponent
                    :variant="'primary'"
                    class="w-full sm:w-auto md:w-1/4"
                    :disabled="submiting"
                    :loading="submiting"
                    @click="createDepartment()"
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
import { ref } from "vue";
import type { Department } from "@/domain/types/EmployeeAttributes";
import { handleErrors, UIError } from "@/core/ui/UIError";
import { ToastUI } from "@/core/ui/Toast.ui";
import { useRouter } from "vue-router";
import Toast from "@/core/components/Toast.vue";
import IconButton from "@/core/components/button/Icon.button.vue";

const router = useRouter();
const repository = container.get(TOKENS.DepartmentRepository);
const data = ref<Department>({
    code: "",
    name: "",
});
const errors = ref<UIError | null>(null);
const alerts = ref<ToastUI | null>(null);
const submiting = ref(false);

// Mengembalikan nilai boolean untuk menandakan validasi berhasil atau tidak
function validate(): boolean {
    const err: Record<string, string> = {}; // Gunakan tipe data yang lebih spesifik
    let isValid = true;

    if (data.value.code.trim() === "") {
        err.code = "Code is required";
        isValid = false;
    }
    if (data.value.name.trim() === "") {
        err.name = "Name is required";
        isValid = false;
    }

    // Jika ada error, buat instance UIError baru
    if (!isValid) {
        // Pesan error utama bisa diatur jika ada lebih dari satu error
        const generalMessage = "Please correct the errors in the form.";
        errors.value = new UIError(generalMessage, err);
    } else {
        // Jika tidak ada error, kosongkan variabel errors
        errors.value = null;
    }

    return isValid;
}

async function createDepartment() {
    // Panggil fungsi validate dan periksa hasilnya
    const isValid = validate();
    if (!isValid) {
        // Jika validasi gagal, hentikan proses
        return;
    }

    try {
        submiting.value = true;
        await repository.create(data.value);
        alerts.value = new ToastUI("success", "success", 1500);
        setTimeout(() => {
            submiting.value = false;
            router.push({ name: "Department" });
        }, 1600);
    } catch (error) {
        errors.value = handleErrors(error);
        alerts.value = new ToastUI(errors.value?.message, "error", 2000);
        submiting.value = false;
    }
}
</script>

<style scoped></style>
