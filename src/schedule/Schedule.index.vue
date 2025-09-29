<template>
    <div class="w-full h-full min-h-0 flex flex-col px-14 dark:bg-gray-900">
        <div class="flex flex-row py-3 mt-3">
            <div class="bg-white dark:bg-gray-800 p-3 flex flex-row rounded-lg">
              <router-link 
              v-for="value in routes" 
              :key="value.name" 
              :to="{ name: value.name }"
              v-slot="{ isActive, navigate }"
              >
                <ButtonComponent :variant="isActive ? 'secondary' : 'ghost'" :with-shadow="isActive ? true : false" @click="navigate">{{ value.label }}</ButtonComponent>
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
        name: "Schedule",
        label: "Schedule",
    },
    {
        name: "Scheduler",
        label: "Scheduler",
    },
];
</script>
