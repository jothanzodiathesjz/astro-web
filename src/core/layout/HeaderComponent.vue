<template>
    <div
        class="w-full flex flex-row items-center py-1 gap-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-14 sticky z-50 top-0"
    >
        <div class="flex flex-row items-center gap-3">
            <font-awesome-icon icon="fa-solid fa-star" class="text-blue-700" />
            <span
                class="text-blue-700 dark:text-blue-500 font-extrabold text-2xl"
                >Astro</span
            >
            <div
                class="border-l-3 border-gray-200 dark:border-gray-700 py-4"
            ></div>
        </div>

        <div class="w-full flex flex-row justify-center">
            <div class="flex flex-row gap-4 rounded-4xl py-2 px-4 text-sm">
                <router-link
                    v-for="navItem in navItems"
                    :key="navItem.name"
                    :to="{ name: navItem.name }"
                    v-slot="{ isActive, navigate }"
                >
                    <button
                        @click="navigate"
                        :class="[
                            'py-2',
                            'px-4',
                            'cursor-pointer rounded',
                            {
                                'text-blue-800 dark:text-blue-500 bg-gray-200 dark:bg-gray-700':
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
                class="w-10 rounded-full flex flex-row items-center cursor-pointer p-1"
                :class="
                    isDark
                        ? 'justify-end bg-gray-700'
                        : 'justify-start bg-gray-200'
                "
                @click="toogleDark()"
            >
                <div
                    class="w-4 h-4 rounded-full"
                    :class="isDark ? 'bg-gray-300' : 'bg-white'"
                ></div>
            </div>
        </div>
        <div class="flex flex-row gap-3 py-3 shrink-0 relative">
            <div
                class="py-1 px-4 rounded text-sm flex flex-row gap-2 items-center text-gray-700 dark:text-gray-300"
            >
                <IconButton
                    ref="settingsButton"
                    :icon-name="'arrow-right-from-bracket'"
                    :icon-color="'text-gray-700 dark:text-gray-500'"
                    :size="'lg'"
                    @click="[$auth.logout(), $router.push({ name: 'Login' })]"
                />
                <span class="font-bold">{{ $auth.user?.name }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/auth/store/Auth.store";
import IconButton from "@/core/components/button/Icon.button.vue";
import isDark from "@/core/ui/composables/dark";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useToggle } from "@vueuse/core";
import { onMounted, onUnmounted, ref } from "vue";
import { RouterLink } from "vue-router";

const toogleDark = useToggle(isDark);
const $auth = useAuthStore();

// Definisikan array untuk navigasi
const navItems = [
    { name: "Dashboard", label: "Dashboard", icon: "fa-solid fa-gauge" },
    {
        name: "Attendance",
        label: "Attendance",
        icon: "fa-solid fa-clipboard-list",
    },
    {
        name: "ScheduleIndex",
        label: "Schedule",
        icon: "fa-solid fa-calendar-check",
    },
    { name: "Shift", label: "Shift", icon: "fa-solid fa-calendar-check" },
    { name: "Employee", label: "Employee", icon: "fa-solid fa-building-user" },
    { name: "Settings", label: "Settings", icon: "fa-solid fa-gear" },
];

const selectedSettings = ref(false);
const dropdownMenu = ref<HTMLElement | null>(null);
const settingsButton = ref<InstanceType<typeof IconButton> | null>(null);

const handleClickOutside = (event: MouseEvent) => {
    const isInsideDropdown =
        dropdownMenu.value && dropdownMenu.value.contains(event.target as Node);
    const isInsideButton =
        settingsButton.value &&
        settingsButton.value?.iconButtonRef?.contains(event.target as Node);

    // Jika klik tidak ada di dalam dropdown DAN tidak ada di dalam tombol
    if (!isInsideDropdown && !isInsideButton) {
        selectedSettings.value = false;
    }
};
// const route = useRoute();
// const settingActive = computed(() => {
//     return route.path.includes("user") ? true : false;
// });

// const toggleSettings = () => {
//     selectedSettings.value = !selectedSettings.value;
// };

onMounted(() => {
    window.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
    window.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped></style>
