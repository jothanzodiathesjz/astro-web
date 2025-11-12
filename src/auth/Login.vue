<template>
    <div
        class="relative flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8"
    >
        <button
            type="button"
            class="fixed top-4 right-4 flex items-center gap-3 rounded-full border border-gray-200/80 bg-white/80 px-2 py-1.5 text-xs font-semibold text-gray-600 shadow-sm transition hover:border-blue-300 hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-gray-700/70 dark:bg-gray-800/80 dark:text-gray-200 dark:hover:border-blue-400 dark:hover:text-blue-300"
            :aria-pressed="isDark"
            @click="toogleDark()"
        >
            <span
                class="relative flex h-6 w-12 items-center rounded-full bg-gray-200 transition dark:bg-gray-700"
            >
                <span
                    class="absolute left-1 h-4 w-4 rounded-full bg-white shadow transition transform dark:bg-gray-300"
                    :class="isDark ? 'translate-x-6' : 'translate-x-0'"
                ></span>
            </span>
            <span>{{ isDark ? "Dark Mode" : "Light Mode" }}</span>
            <FontAwesomeIcon
                :icon="isDark ? 'fa-solid fa-moon' : 'fa-solid fa-sun'"
                class="text-gray-500 transition dark:text-gray-300"
            />
        </button>
        <div class="w-full max-w-lg p-8 bg-white dark:bg-gray-800 rounded-xl">
            <div class="flex flex-col items-center gap-4 mb-8">
                <h2
                    class="text-3xl font-extrabold text-center text-gray-900 dark:text-white"
                >
                    Astro.
                </h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                    Masuk untuk melanjutkan ke dashboard.
                </p>
            </div>

            <div class="flex flex-col gap-6">
                <TextInput
                    :value="email"
                    label="Username / Email"
                    placeholder="Masukkan username atau email Anda"
                    :error="errors?.data?.email"
                    :icon="{
                        left: {
                            name: 'user',
                            color: 'text-gray-400 dark:text-gray-500',
                        },
                    }"
                    @input="(value) => (email = value)"
                />

                <TextInput
                    :value="password"
                    label="Password"
                    placeholder="Masukkan password Anda"
                    hidden="true"
                    :error="errors?.data?.password"
                    :icon="{
                        left: {
                            name: 'lock',
                            color: 'text-gray-400 dark:text-gray-500',
                        },
                    }"
                    @input="(value) => (password = value)"
                    @enter="handleLogin"
                />

                <span
                    v-if="errors?.message"
                    class="text-xs text-red-600 dark:text-red-400 p-4 border border-red-300 rounded"
                    >{{ errors?.message }}</span
                >

                <ButtonComponent
                    :variant="'primary'"
                    @click="handleLogin"
                    :disabled="diSabled"
                    >Masuk</ButtonComponent
                >
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import TextInput from "@/core/components/input/Text.input.vue";
import ButtonComponent from "@/core/components/button/Button.component.vue";
import { useAuthStore } from "./store/Auth.store";
import { useRouter } from "vue-router";
import { handleErrors, UIError } from "@/core/ui/UIError";
import { useToggle } from "@vueuse/core";
import isDark from "@/core/ui/composables/dark";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
const toogleDark = useToggle(isDark);
const $auth = useAuthStore();

const email = ref("");
const password = ref("");

const router = useRouter();
const errors = ref<UIError | null>(null);
const diSabled = ref(false);

const handleLogin = async () => {
    diSabled.value = true;
    setTimeout(async () => {
        try {
            await $auth.login({
                username: email.value,
                email: email.value,
                password: password.value,
            });
            router.push({ name: "Main" });
        } catch (error) {
            errors.value = handleErrors(error);
        } finally {
            diSabled.value = false;
        }
    }, 2000);
};
</script>

<style scoped>
/* Tambahkan gaya kustom di sini jika diperlukan */
</style>
