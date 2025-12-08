<template>
    <header
        class="sticky top-0 z-50 border-b border-gray-200/80 bg-white/80 backdrop-blur-md shadow-sm dark:border-gray-700/80 dark:bg-gray-900/80"
    >
        <div
            class="mx-auto flex w-full max-w-full items-center gap-6 px-4 py-2 sm:px-6 lg:px-10"
        >
            <div class="flex shrink-0 items-center gap-3">
                <div
                    class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700"
                >
                    <font-awesome-icon icon="fa-solid fa-star" />
                </div>
                <div class="flex flex-col leading-tight">
                    <span
                        class="text-lg font-extrabold text-blue-700 dark:text-blue-400"
                        >Astro</span
                    >
                </div>
            </div>

            <!-- Desktop Nav -->
            <nav aria-label="Primary" class="hidden md:flex flex-1 justify-center">
                <div
                    class="flex flex-row items-center gap-2 rounded-full bg-gray-100/70 px-2 py-1 dark:bg-gray-800/60"
                >
                    <router-link
                        v-for="navItem in navItems"
                        :key="navItem.name"
                        :to="{ name: navItem.name }"
                        v-slot="{ isActive, navigate }"
                    >
                        <button
                            type="button"
                            @click="navigate"
                            :class="[
                                'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500',
                                isActive
                                    ? 'bg-white text-blue-700 shadow-sm dark:bg-gray-700/90 dark:text-blue-300'
                                    : 'text-gray-600 hover:-translate-y-0.5 hover:bg-white hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-700/60 dark:hover:text-blue-300',
                            ]"
                        >
                            <font-awesome-icon :icon="navItem.icon" />
                            <span>{{ navItem.label }}</span>
                        </button>
                    </router-link>
                </div>
            </nav>

            <!-- Right actions (Desktop) -->
            <div class="hidden md:flex shrink-0 items-center gap-4">
                <button
                    type="button"
                    class="flex items-center gap-3 rounded-full border border-gray-200/80 bg-white/80 px-2 py-1.5 text-xs font-semibold text-gray-600 shadow-sm transition hover:border-blue-300 hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-gray-700/70 dark:bg-gray-800/80 dark:text-gray-200 dark:hover:border-blue-400 dark:hover:text-blue-300"
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
                    <font-awesome-icon
                        :icon="isDark ? 'fa-solid fa-moon' : 'fa-solid fa-sun'"
                        class="text-gray-500 transition dark:text-gray-300"
                    />
                </button>

                <div
                    class="flex items-center gap-3 rounded-full bg-gray-100/70 px-3 py-1.5 text-sm text-gray-700 shadow-sm dark:bg-gray-800/70 dark:text-gray-200"
                >
                    <div
                        class="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold uppercase leading-none text-white dark:bg-blue-500"
                    >
                        {{ userInitials }}
                    </div>
                    <div class="flex flex-col leading-tight">
                        <span class="font-semibold">{{
                            $auth.user?.name
                        }}</span>
                        <span class="text-xs text-gray-500 dark:text-gray-400"
                            >Signed In</span
                        >
                    </div>
                    <IconButton
                        class="ml-1"
                        :icon-name="'arrow-right-from-bracket'"
                        :icon-color="'text-gray-600 dark:text-gray-400'"
                        :title="'Sign out'"
                        @click="[
                            $auth.logout(),
                            $router.push({ name: 'Login' }),
                        ]"
                    />
                </div>
            </div>

            <!-- Mobile actions -->
            <div class="ml-auto flex items-center gap-2 md:hidden">
                <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:text-gray-300 dark:hover:bg-gray-800"
                    :aria-label="isMenuOpen ? 'Close menu' : 'Open menu'"
                    :aria-expanded="isMenuOpen ? 'true' : 'false'"
                    aria-controls="mobile-menu"
                    @click="isMenuOpen = !isMenuOpen"
                >
                    <font-awesome-icon :icon="isMenuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'" />
                </button>
            </div>
        </div>

        <!-- Mobile Menu -->
        <Transition name="slide-down">
            <nav
                v-if="isMenuOpen"
                id="mobile-menu"
                aria-label="Mobile Primary"
                class="md:hidden border-t border-gray-200/80 bg-white/95 shadow-sm dark:border-gray-700/80 dark:bg-gray-900/95"
            >
                <div class="px-4 py-3 space-y-3">
                    <div class="flex items-center gap-3">
                        <button
                            type="button"
                            class="flex items-center gap-3 rounded-full border border-gray-200/80 bg-white/80 px-2 py-1.5 text-xs font-semibold text-gray-600 shadow-sm transition hover:border-blue-300 hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-gray-700/70 dark:bg-gray-800/80 dark:text-gray-200 dark:hover:border-blue-400 dark:hover:text-blue-300"
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
                            <span>{{ isDark ? 'Dark Mode' : 'Light Mode' }}</span>
                        </button>
                    </div>

                    <div class="grid grid-cols-1 gap-2">
                        <router-link
                            v-for="navItem in navItems"
                            :key="navItem.name"
                            :to="{ name: navItem.name }"
                            v-slot="{ isActive, navigate }"
                        >
                            <button
                                type="button"
                                @click="navigate(); isMenuOpen = false"
                                :class="[
                                    'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 text-left w-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500',
                                    isActive
                                        ? 'bg-blue-50 text-blue-700 dark:bg-gray-800/90 dark:text-blue-300'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600 dark:text-gray-200 dark:hover:bg-gray-800/60 dark:hover:text-blue-300',
                                ]"
                            >
                                <font-awesome-icon :icon="navItem.icon" />
                                <span>{{ navItem.label }}</span>
                            </button>
                        </router-link>
                    </div>

                    <div
                        class="mt-2 flex items-center justify-between rounded-lg bg-gray-100/80 px-3 py-2 text-sm text-gray-700 shadow-sm dark:bg-gray-800/70 dark:text-gray-200"
                    >
                        <div class="flex items-center gap-3">
                            <div
                                class="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold uppercase leading-none text-white dark:bg-blue-500"
                            >
                                {{ userInitials }}
                            </div>
                            <div class="flex flex-col leading-tight">
                                <span class="font-semibold truncate max-w-[12rem]">{{ $auth.user?.name }}</span>
                                <span class="text-xs text-gray-500 dark:text-gray-400">Signed In</span>
                            </div>
                        </div>
                        <IconButton
                            :icon-name="'arrow-right-from-bracket'"
                            :icon-color="'text-gray-600 dark:text-gray-400'"
                            :title="'Sign out'"
                            @click="[$auth.logout(), $router.push({ name: 'Login' })]"
                        />
                    </div>
                </div>
            </nav>
        </Transition>
    </header>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/auth/store/Auth.store";
import IconButton from "@/core/components/button/Icon.button.vue";
import isDark from "@/core/ui/composables/dark";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useToggle } from "@vueuse/core";
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";

const toogleDark = useToggle(isDark);
const $auth = useAuthStore();
const isMenuOpen = ref(false);

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
        icon: "fa-solid fa-table",
    },
    { name: "EmployeeTimeOff", label: "Time Off", icon: "fa-solid fa-clock" },
    { name: "Calendar", label: "Calendar", icon: "fa-solid fa-calendar-check" },
    { name: "Employee", label: "Employee", icon: "fa-solid fa-building-user" },
    { name: "Settings", label: "Settings", icon: "fa-solid fa-gear" },
];

const userInitials = computed(() => {
    const name = $auth.user?.name ?? "";
    if (!name.trim()) {
        return "?";
    }
    const initials = name
        .trim()
        .split(/\s+/)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .filter(Boolean)
        .slice(0, 2)
        .join("");

    return initials || "?";
});
</script>

<style scoped></style>
