<template>
    <div
        class="w-full min-h-screen bg-[#F3F4F6] dark:bg-gray-900 overflow-x-clip overflow-y-visible"
    >
        <MainNavbar />
        <!-- main -->
        <RouterView v-slot="{ Component }">
            <Transition name="slide-right" mode="out-in" appear>
                <component :is="Component" />
            </Transition>
        </RouterView>
    </div>
</template>

<script setup lang="ts">
import MainNavbar from './MainNavbar.vue';
</script>
