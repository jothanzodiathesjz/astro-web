<template>
  <button
    :type="type"
    :disabled="isDisabled"
    @click="$emit('click', $event)"
    :class="[
      baseClass,
      sizeClass,
      variantClass,
      block ? 'w-full' : 'inline-flex',
      isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    ]"
  >
    <slot>{{ label }}</slot>
  </button>
  
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineEmits<{ (e: 'click', event: MouseEvent): void }>()

const props = defineProps<{
  label?: string
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  block?: boolean
  disabled?: boolean | 'true' | 'false'
  type?: 'button' | 'submit' | 'reset'
}>()

const isDisabled = computed(() => props.disabled === true || props.disabled === 'true')

const baseClass =
  'rounded-lg transition-all duration-300 font-medium flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800'

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'text-xs py-1.5 px-3'
    case 'lg':
      return 'text-base py-3 px-6'
    case 'md':
    default:
      return 'text-sm py-2.5 px-4'
  }
})

const variantClass = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
    case 'danger':
      return 'bg-red-600 hover:bg-red-700 text-white'
    case 'outline':
      return 'border border-gray-300 hover:bg-gray-100 text-gray-700 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-300'
    case 'ghost':
      return 'bg-transparent hover:bg-gray-100 text-gray-700 dark:hover:bg-gray-700 dark:text-gray-300'
    case 'primary':
    default:
      return 'bg-blue-600 hover:bg-blue-700 text-white'
  }
})

const type = computed(() => props.type ?? 'button')
</script>

<style scoped>
button:active {
  transform: translateY(1px);
}
</style>
