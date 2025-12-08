<template>
    <div
        class="w-full h-full min-h-0 flex flex-col px-4 pb-6 dark:bg-gray-900 sm:px-6 lg:px-10 2xl:px-14"
    >
        <div class="flex flex-row py-3 mt-3">
            <div
                class="p-3 flex flex-row flex-wrap gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-700"
            >
                <router-link
                    v-for="value in routes"
                    :key="value.name"
                    :to="{ name: value.name }"
                    v-slot="{ isActive, navigate }"
                >
                    <ButtonComponent
                        :variant="isActive ? 'secondary' : 'ghost'"
                        :with-shadow="isActive ? true : false"
                        @click="navigate"
                        >{{ value.label }}</ButtonComponent
                    >
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
import ButtonComponent from "@/core/components/button/Button.component.vue";

const routes = [
    {
        name: "Scheduler",
        label: "Scheduler",
    },
    {
        name: "Schedule",
        label: "Schedule",
    },
    {
        name: "Shift",
        label: "Shift",
    }
];
</script>
