<template>
  <div class="flex items-center justify-center p-4">
    <div :style="containerStyle" class="relative">
      <svg :width="size" :height="size" class="transform -rotate-90">
        <circle
          :cx="radius"
          :cy="radius"
          :r="circleRadius"
          :stroke="backgroundColor"
          :stroke-width="strokeWidth"
          fill="transparent"
        />
      </svg>
      <svg
        :width="size"
        :height="size"
        class="absolute top-0 left-0 transform -rotate-90"
      >
        <circle
          :cx="radius"
          :cy="radius"
          :r="circleRadius"
          :stroke="progressColor"
          :stroke-width="strokeWidth"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="offset"
          fill="transparent"
          stroke-linecap="round"
          class="transition-all duration-1000 ease-in-out"
        />
      </svg>
      <div
        class="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";

interface Props {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  progressColor?: string;
  backgroundColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  percentage: 0,
  size: 150,
  strokeWidth: 15,
  progressColor: "#3B82F6", // Tailwind blue-500
  backgroundColor: "#E5E7EB", // Tailwind gray-200
});

const radius = computed(() => props.size / 2);
const circleRadius = computed(() => radius.value - props.strokeWidth / 2);
const circumference = computed(() => 2 * Math.PI * circleRadius.value);

const offset = computed(() => {
  const progress = Math.min(Math.max(props.percentage, 0), 100);
  return circumference.value - (progress / 100) * circumference.value;
});

const containerStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
}));

// Tambahan: Watcher untuk reaktivitas jika persentase berubah
// Ini memastikan animasi berjalan setiap kali properti percentage berubah.
watch(
  () => props.percentage,
  () => {
    // Tidak perlu logika tambahan, computed property sudah reaktif
  }
);
</script>
