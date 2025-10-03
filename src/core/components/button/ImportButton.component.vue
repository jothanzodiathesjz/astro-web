<!-- ImportFileButton.vue -->
<template>
    <div class="relative inline-flex">
        <input
            ref="inputRef"
            type="file"
            class="sr-only"
            :accept="inputAccept"
            :multiple="allowsMultiple"
            @change="onFileChange"
        />

        <ButtonComponent
            ref="buttonRef"
            :disabled="isDisabled"
            :variant="variant ?? 'outline'"
            :icon-name="iconToUse"
            :loading="isLoading"
            :title="buttonTitle"
            @click="handleClick"
            class="max-w-[22rem]"
        >
            <span class="inline-block truncate align-middle">{{
                displayFileName
            }}</span>
        </ButtonComponent>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import ButtonComponent from "./Button.component.vue";

/** ====== TYPES ====== */
type ImportEvent = { files: FileList; rawFiles: File[]; event: Event };
type InvalidImportEvent = { files: File[]; event: Event };
type IconType = "fa-solid" | "fa-regular" | "fa-brands";

/** ====== PROPS & EMITS ====== */
const props = defineProps<{
    label?: string; // (opsional) tidak dipakai langsung di tombol; bisa kamu mapping ke aria-label sendiri
    accept?: string; // mis: ".csv,.xlsx"
    multiple?: boolean;
    disabled?: boolean;
    loading?: boolean;
    icon?: string; // default "file-import"
    iconType?: IconType; // jika ButtonComponent butuh type ikon
    variant?:
        | "primary"
        | "secondary"
        | "danger"
        | "outline"
        | "ghost"
        | "white";
    autoReset?: boolean; // default true
    allowedExtensions?: string[]; // mis: ["csv", ".xlsx"]  -> akan dinormalisasi jadi [".csv",".xlsx"]
}>();

const emit = defineEmits<{
    (e: "import", payload: ImportEvent): void;
    (e: "clear"): void;
    (e: "invalid", payload: InvalidImportEvent): void;
}>();

/** ====== REFS ====== */
const inputRef = ref<HTMLInputElement | null>(null);
const buttonRef = ref<HTMLButtonElement | null>(null);

/** ====== STATE & COMPUTEDS ====== */
const isLoading = computed(() => !!props.loading);
const isDisabled = computed(() => props.disabled || isLoading.value);
const iconToUse = computed(() => props.icon ?? "file-import");
const autoReset = computed(() => props.autoReset !== false);
const allowsMultiple = computed(() => !!props.multiple);

/** Normalisasi daftar ekstensi */
const normalizedExtensions = computed(() => {
    if (!props.allowedExtensions || props.allowedExtensions.length === 0)
        return null;
    const cleaned = props.allowedExtensions
        .map((ext) => ext.trim().toLowerCase())
        .filter(Boolean)
        .map((ext) => (ext.startsWith(".") ? ext : `.${ext}`));
    return cleaned.length > 0 ? cleaned : null;
});

const extensionSet = computed(() => {
    const list = normalizedExtensions.value;
    return list ? new Set(list) : null;
});

/** Aturan accept untuk input file */
const inputAccept = computed(() => {
    if (props.accept) return props.accept;
    const extList = normalizedExtensions.value;
    return extList ? extList.join(",") : undefined;
});

/** File yang terpilih (disimpan agar nama tetap muncul meskipun input auto-reset) */
const selectedFiles = ref<File[]>([]);

/** Nama yang ditampilkan di tombol (ringkas) */
const displayFileName = computed(() => {
    if (selectedFiles.value.length === 0) return "Import";
    if (allowsMultiple.value) {
        if (selectedFiles.value.length === 1)
            return selectedFiles.value[0].name;
        const firstTwo = selectedFiles.value
            .slice(0, 2)
            .map((f) => f.name)
            .join(", ");
        return selectedFiles.value.length > 2
            ? `${firstTwo} (+${selectedFiles.value.length - 2})`
            : firstTwo;
    }
    return selectedFiles.value[0].name;
});

/** Title (tooltip) untuk hover: tampilkan semua nama lengkap */
const buttonTitle = computed(() =>
    selectedFiles.value.length
        ? selectedFiles.value.map((f) => f.name).join(", ")
        : (props.label ?? "Pilih file"),
);

/** ====== HANDLERS ====== */
const handleClick = () => {
    if (isDisabled.value) return;
    inputRef.value?.click();
};

/** Build FileList baru dari array File (untuk emit yang konsisten) */
const buildFileList = (files: File[]): FileList | null => {
    if (typeof DataTransfer === "undefined") return null;
    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));
    return dataTransfer.files;
};

const clearSelection = () => {
    selectedFiles.value = [];
    emit("clear");
};

const handleInvalidFiles = (invalidFiles: File[], event: Event) => {
    if (invalidFiles.length === 0) return;
    emit("invalid", { files: invalidFiles, event });
};

const onFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const files = target.files;

    if (!files) {
        clearSelection();
        return;
    }

    const filesArray = Array.from(files);
    const filterSet = extensionSet.value;

    // Tidak ada filter ekstensi -> terima semua
    if (!filterSet) {
        selectedFiles.value = filesArray;
        emit("import", { files, rawFiles: filesArray, event });
        if (autoReset.value) target.value = ""; // reset input, nama tetap di state
        return;
    }

    // Filter berdasar ekstensi
    const valid: File[] = [];
    const invalid: File[] = [];

    filesArray.forEach((file) => {
        const lastDotIndex = file.name.lastIndexOf(".");
        const extension =
            lastDotIndex === -1
                ? ""
                : file.name.slice(lastDotIndex).toLowerCase();
        (filterSet.has(extension) ? valid : invalid).push(file);
    });

    if (valid.length === 0) {
        clearSelection();
        handleInvalidFiles(invalid, event);
        if (autoReset.value) target.value = "";
        return;
    }

    selectedFiles.value = valid;

    const filteredFileList =
        buildFileList(valid) ?? (valid as unknown as FileList);
    emit("import", { files: filteredFileList, rawFiles: valid, event });
    handleInvalidFiles(invalid, event);

    if (autoReset.value) {
        target.value = "";
    }
};

/** Expose agar parent bisa akses/clear manual */
defineExpose({ inputRef, buttonRef, clearSelection });
</script>

<style scoped>
button:active {
    transform: translateY(1px);
}
</style>
