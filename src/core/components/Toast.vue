<template>
    <div
        v-if="isVisible"
        class="fixed top-4 right-4 z-[100] space-y-2 max-w-sm w-full"
    >
        <div
            :class="getToastStyles()"
            role="alert"
            :aria-live="type === 'error' ? 'assertive' : 'polite'"
        >
            <div class="flex items-center">
                <div :class="`text-xl mr-3 ${getIcon().color}`">
                    <FontAwesomeIcon :icon="['fa-solid', getIcon().name]" />
                </div>
                <div class="flex-1 font-medium w-full text-sm">
                    {{ message }}
                </div>
            </div>
            <button
                @click="handleClose"
                class="ml-auto text-gray-400 hover:text-gray-900 transition-colors"
                aria-label="Close toast"
            >
                <IconButton :icon-name="'fa-xmark'" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from "vue";
import IconButton from "./button/Icon.button.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

type ToastProps = {
    message: string;
    type?: "success" | "error" | "warning" | "info";
    duration?: number;
    show?: boolean;
};

const props = withDefaults(defineProps<ToastProps>(), {
    type: "info",
    duration: 5000,
    show: false,
});

const emit = defineEmits({
    "on-close": () => true,
});

const isVisible = ref(props.show);
const isExiting = ref(false);
const timer = ref<ReturnType<typeof setTimeout>>();

const handleClose = () => {
    isExiting.value = true;
    setTimeout(() => {
        isVisible.value = false;
        emit("on-close");
    }, 300);
};

watch(
    () => props.show,
    (newVal) => {
        if (newVal) {
            isVisible.value = true;
            isExiting.value = false;
            if (props.duration) {
                timer.value = setTimeout(handleClose, props.duration);
            }
        }
    },
    { immediate: true },
);

onUnmounted(() => {
    if (timer.value) clearTimeout(timer.value);
    isExiting.value = false;
});

const getToastStyles = () => {
    const baseStyles =
        "flex items-center p-4 rounded-lg shadow-xl border-l-4 transition-all duration-300 transform";

    const typeStyles = {
        success: "bg-white border-green-500 text-gray-800",
        error: "bg-white border-red-500 text-gray-800",
        warning: "bg-white border-yellow-500 text-gray-800",
        info: "bg-white border-blue-500 text-gray-800",
    };

    const animationStyles = isExiting.value
        ? "opacity-0 translate-y-2 scale-95"
        : "opacity-100 translate-y-0 scale-100";

    return `${baseStyles} ${typeStyles[props.type]} ${animationStyles}`;
};

const getIcon = () => {
    const icons = {
        success: { name: "fa-circle-check", color: "text-green-500" },
        error: { name: "fa-circle-xmark", color: "text-red-500" },
        warning: { name: "fa-triangle-exclamation", color: "text-yellow-500" },
        info: { name: "fa-circle-info", color: "text-blue-500" },
    };

    return icons[props.type];
};
</script>
