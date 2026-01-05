<template>
    <div class="w-full flex flex-col gap-5 px-12 ">
        <div class="px-5">
            <div
                class="w-full border-b border-gray-300 dark:border-gray-600 pt-4 gap-5 flex flex-row items-start justify-start"
            >
                <router-link
                    v-for="value in routes"
                    :key="value.name"
                    :to="{ name: value.name }"
                    class=""
                    v-slot="{ isActive, navigate }"
                >
                    <button
                        class="p-3 text-sm cursor-pointer font-semibold"
                        :class="
                            isActive
                                ? 'text-blue-500 border-b-2 border-blue-500  dark:text-gray-100 '
                                : 'text-gray-600  dark:text-gray-400 '
                        "
                        @click="navigate"
                    >
                        {{ value.label }}
                    </button>
                </router-link>
            </div>
        </div>
        <RouterView v-slot="{ Component }">
            <Transition name="slide-right" mode="out-in" appear>
                <component :is="Component" />
            </Transition>
        </RouterView>
    </div>
</template>

<script setup lang="ts">
const routes = [
    {
        name: "Company",
        label: "Company",
        active: false,
    },
    {
        name: "Department",
        label: "Department",
        active: true,
    },
    {
        name: "TimeOff",
        label: "Time Off",
        active: false,
    },
    {
        name: "TimeOffPolicy",
        label: "Policy",
        active: false,
    },
    {
        name: "Overtime",
        label: "Overtime",
        active: false,
    },
    {
        name: "Holiday",
        label: "Holiday",
        active: false,
    },
    {
        name: "Users",
        label: "Users",
        active: false,
    },
];
</script>
