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
          label="Username"
          placeholder="Masukkan username Anda"
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
          :icon="{
            left: {
              name: 'lock',
              color: 'text-gray-400 dark:text-gray-500',
            },
          }"
          @input="(value) => (password = value)"
        />

        <ButtonComponent :variant="'primary'">Masuk</ButtonComponent>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import TextInput from "@/components/input/Text.input.vue";
import ButtonComponent from "@/components/button/Button.component.vue";

// Tambahkan ikon ke library Font Awesome
library.add(faEnvelope, faLock);

const email = ref("");
const password = ref("");

const handleLogin = () => {
  console.log("Login attempt with:", {
    email: email.value,
    password: password.value,
  });
  // Tambahkan logika otentikasi di sini
};
</script>

<style scoped>
/* Tambahkan gaya kustom di sini jika diperlukan */
</style>
