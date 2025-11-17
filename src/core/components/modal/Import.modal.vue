<template>
    <Modal
        :model-value="visible"
        :close-self="false"
        :content-class="panelContentClass"
        :position="modalPosition"
        @close-self="handleCancel"
    >
        <div class="flex flex-col min-w-[460px]">
            <header
                class="flex items-start justify-between gap-4 border-b border-gray-200 dark:border-gray-700 p-5"
            >
                <div class="space-y-1">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                        {{ titleText }}
                    </h3>
                    <p
                        v-if="descriptionText"
                        class="text-sm text-gray-500 dark:text-gray-300"
                    >
                        {{ descriptionText }}
                    </p>
                </div>
                <IconButton
                    icon-name="close"
                    icon-color="text-gray-400 dark:text-gray-500"
                    size="lg"
                    title="Tutup"
                    @click="handleCancel"
                />
            </header>

            <section class="flex flex-col gap-4 p-5">
                <label
                    class="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition-all duration-200 cursor-pointer"
                    :class="dropZoneDynamicClass"
                    @dragover.prevent="onDragOver"
                    @dragleave.prevent="onDragLeave"
                    @drop.prevent="onDrop"
                >
                    <input
                        ref="fileInputRef"
                        type="file"
                        class="sr-only"
                        :accept="acceptAttribute"
                        @change="handleFileChange"
                    />
                    <FontAwesomeIcon
                        :icon="['fa-solid', 'file-arrow-up']"
                        class="text-3xl"
                    />
                    <div class="space-y-1">
                        <p class="font-medium">Seret & lepas file di sini</p>
                        <p class="text-sm">
                            atau
                            <button
                                type="button"
                                class="font-semibold text-blue-600 hover:underline focus:underline"
                                @click.stop.prevent="openFileDialog"
                            >
                                pilih file
                            </button>
                            dari perangkat kamu
                        </p>
                        <p
                            v-if="allowedExtensionsLabel"
                            class="text-xs text-gray-500 dark:text-gray-300"
                        >
                            Format diperbolehkan: {{ allowedExtensionsLabel }}
                        </p>
                    </div>
                </label>

                <div
                    v-if="selectedFileName"
                    class="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/40 px-4 py-2 text-sm text-gray-800 dark:text-gray-100"
                >
                    <span class="truncate max-w-[70%]">{{ selectedFileName }}</span>
                    <button
                        type="button"
                        class="text-xs font-medium text-red-600 hover:text-red-700"
                        @click="clearSelection"
                    >
                        Hapus
                    </button>
                </div>

                <p v-if="errorMessage" class="text-sm text-red-600 dark:text-red-400">
                    {{ errorMessage }}
                </p>

                <div
                    class="mt-2 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700 pt-4"
                >
                    <ButtonComponent variant="secondary" @click="handleCancel">
                        {{ cancelText }}
                    </ButtonComponent>
                    <ButtonComponent
                        variant="primary"
                        :disabled="isConfirmDisabled"
                        :loading="isLoading"
                        @click="handleConfirm"
                    >
                        {{ confirmText }}
                    </ButtonComponent>
                </div>
            </section>
        </div>
    </Modal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Modal from "./Modal.vue";
import IconButton from "../button/Icon.button.vue";
import ButtonComponent from "../button/Button.component.vue";

const props = defineProps<{
    modelValue: boolean;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    allowedExtensions?: string[];
    accept?: string;
    loading?: boolean;
    position?: "top" | "center" | "bottom";
    contentClass?: string;
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "import", payload: { file: File; files: File[] }): void;
    (e: "cancel"): void;
    (e: "invalid-file", payload: { file: File; reason: "extension" }): void;
}>();

const fileInputRef = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const errorMessage = ref("");
const isDragOver = ref(false);

const normalizedExtensions = computed(() => {
    if (!props.allowedExtensions?.length) return null;
    const cleaned = props.allowedExtensions
        .map((ext) => ext.trim().toLowerCase())
        .filter(Boolean)
        .map((ext) => (ext.startsWith(".") ? ext : `.${ext}`));
    return cleaned.length ? cleaned : null;
});

const extensionSet = computed(() => {
    const list = normalizedExtensions.value;
    return list ? new Set(list) : null;
});

const acceptAttribute = computed(() => {
    if (props.accept) return props.accept;
    const list = normalizedExtensions.value;
    return list ? list.join(",") : undefined;
});

const allowedExtensionsLabel = computed(() => {
    const list = normalizedExtensions.value;
    if (!list?.length) return "";
    return list.map((ext) => ext.replace(".", "").toUpperCase()).join(", ");
});

const visible = computed(() => props.modelValue);
const panelContentClass = computed(
    () => props.contentClass ?? "w-full max-w-xl",
);
const modalPosition = computed(() => props.position ?? "center");

const titleText = computed(() => props.title ?? "Import File");
const descriptionText = computed(
    () =>
        props.description ??
        "Pilih file yang ingin diunggah lalu jalankan proses import.",
);
const confirmText = computed(() => props.confirmText ?? "Import");
const cancelText = computed(() => props.cancelText ?? "Batal");
const isLoading = computed(() => !!props.loading);
const isConfirmDisabled = computed(
    () => !selectedFile.value || isLoading.value,
);

const dropZoneDynamicClass = computed(() => ({
    "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-100":
        isDragOver.value,
    "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-200":
        !isDragOver.value,
    "ring-1 ring-blue-500/60": !!selectedFile.value && !isDragOver.value,
}));

const selectedFileName = computed(() => selectedFile.value?.name ?? "");

watch(
    () => props.modelValue,
    (value) => {
        if (!value) {
            resetInteractionState();
        }
    },
);

function openFileDialog() {
    fileInputRef.value?.click();
}

function resetInteractionState() {
    clearSelection();
    isDragOver.value = false;
}

function clearSelection() {
    selectedFile.value = null;
    errorMessage.value = "";
    if (fileInputRef.value) {
        fileInputRef.value.value = "";
    }
}

function handleCancel() {
    emit("cancel");
    emit("update:modelValue", false);
    resetInteractionState();
}

function handleConfirm() {
    if (!selectedFile.value) return;
    emit("import", { file: selectedFile.value, files: [selectedFile.value] });
}

function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (!files || files.length === 0) {
        clearSelection();
        return;
    }
    processFile(files[0]);
}

function onDragOver() {
    isDragOver.value = true;
}

function onDragLeave() {
    isDragOver.value = false;
}

function onDrop(event: DragEvent) {
    isDragOver.value = false;
    const files = event.dataTransfer?.files;
    if (!files || files.length === 0) return;
    processFile(files[0]);
}

function processFile(file: File) {
    if (!isExtensionAllowed(file)) {
        errorMessage.value = buildExtensionErrorMessage();
        emit("invalid-file", { file, reason: "extension" });
        if (fileInputRef.value) {
            fileInputRef.value.value = "";
        }
        return;
    }
    selectedFile.value = file;
    errorMessage.value = "";
}

function isExtensionAllowed(file: File) {
    const set = extensionSet.value;
    if (!set) return true;
    const dotIndex = file.name.lastIndexOf(".");
    if (dotIndex === -1) return false;
    const ext = file.name.slice(dotIndex).toLowerCase();
    return set.has(ext);
}

function buildExtensionErrorMessage() {
    if (!allowedExtensionsLabel.value) return "Format file tidak didukung.";
    return `Format file harus ${allowedExtensionsLabel.value}.`;
}

defineExpose({
    clearSelection,
});
</script>

<style scoped></style>
