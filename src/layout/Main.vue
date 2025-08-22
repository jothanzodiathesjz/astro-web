<template>
  <div class="w-full min-h-0 bg-[#F3F4F6] dark:bg-gray-800">
    <HeaderComponent />
    <!-- main -->
    <RouterView v-slot="{ Component }">
      <Transition mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>

<script setup lang="ts">
import HeaderComponent from "./HeaderComponent.vue";
</script>
