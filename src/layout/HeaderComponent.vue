<template>
  <div
    class="w-full flex flex-row items-center py-2 gap-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-14 sticky z-50 top-0"
  >
    <div class="flex flex-row items-center gap-4">
      <span class="text-blue-700 dark:text-blue-500 font-extrabold text-2xl"
        >Astro</span
      >
      <div class="border-l-3 border-gray-200 dark:border-gray-700 py-4"></div>
    </div>

    <div class="w-full flex flex-row justify-center">
      <div class="flex flex-row gap-4 rounded-4xl py-3 px-4 text-sm">
        <router-link
          v-for="navItem in navItems"
          :key="navItem.name"
          :to="{ name: navItem.name }"
          v-slot="{ isActive, navigate }"
        >
          <button
            @click="navigate"
            :class="[
              'py-1',
              'px-4',
              'rounded',
              'bg-transparent',
              'cursor-pointer',
              {
                'text-blue-800 dark:text-blue-500 bg-gray-100 dark:bg-gray-800':
                  isActive,
                'text-gray-700 dark:text-gray-300': !isActive,
              },
            ]"
          >
            <font-awesome-icon :icon="navItem.icon" />
            <span class="ml-2">{{ navItem.label }}</span>
          </button>
        </router-link>
      </div>
    </div>
    <div class="px-4 py-3 flex flex-row items-center gap-2">
      <font-awesome-icon
        :icon="isDark ? 'fa-solid fa-sun' : 'fa-regular fa-moon'"
        class="text-gray-700 dark:text-white"
      />

      <div
        class="w-14 rounded-full flex flex-row items-center cursor-pointer p-1"
        :class="
          isDark ? 'justify-end bg-gray-700' : 'justify-start bg-gray-200'
        "
        @click="toogleDark()"
      >
        <div
          class="w-6 h-6 rounded-full"
          :class="isDark ? 'bg-gray-300' : 'bg-white'"
        ></div>
      </div>
    </div>
    <div class="flex flex-row gap-3 py-3 shrink-0">
      <div
        class="py-1 px-4 rounded text-sm flex flex-row gap-2 items-center text-gray-700 dark:text-gray-300"
      >
        <font-awesome-icon icon="fa-solid fa-user" />
        <div class="flex flex-col">
          <span>Jothan Zodiathes</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useDark, useToggle } from "@vueuse/core";
import { RouterLink } from "vue-router";

const isDark = useDark({
  selector: "body",
  attribute: "color-scheme",
  valueDark: "dark",
  valueLight: "light",
});

const toogleDark = useToggle(isDark);

// Definisikan array untuk navigasi
const navItems = [
  { name: "Dashboard", label: "Dashboard", icon: "fa-solid fa-gauge" },
  {
    name: "Attendance",
    label: "Attendance",
    icon: "fa-solid fa-clipboard-list",
  },
  { name: "Schedule", label: "Schedule", icon: "fa-solid fa-calendar-check" },
  { name: "Shift", label: "Shift", icon: "fa-solid fa-calendar-check" },
  { name: "Employee", label: "Employee", icon: "fa-solid fa-building-user" },
];
</script>

<style scoped></style>
