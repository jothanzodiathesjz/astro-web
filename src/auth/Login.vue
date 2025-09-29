<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8"
  >
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

        <span v-if="errors?.message" class="text-xs text-red-600 dark:text-red-400 p-4 border border-red-300 rounded">{{ errors?.message }}</span>

        <ButtonComponent 
        :variant="'primary'" @click="handleLogin"
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

const email = ref("");
const password = ref("");

const $auth = useAuthStore();
const router = useRouter();
const errors = ref<UIError | null>(null);
const diSabled = ref(false);

const handleLogin = async () => {
  diSabled.value = true;
  setTimeout( async () => {
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
  },2000)
 
};
</script>

<style scoped>
/* Tambahkan gaya kustom di sini jika diperlukan */
</style>
