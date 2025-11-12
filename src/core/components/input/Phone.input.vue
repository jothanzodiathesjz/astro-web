<template>
    <div class="flex flex-col w-full" ref="root">
        <InputContainer
            :focused="focused"
            :label="label"
            :error="[...country_code_error, ...phone_error]"
            :optional="optional"
        >
            <div class="flex flex-row w-full">
                <input
                    class="w-16 flex-shrink-0 text-xs px-2 border-r py-3 text-center relative z-10 outline-none font-bold"
                    :class="[
                        focused
                            ? 'border-blue-300 bg-blue-50 text-blue-600 dark:bg-blue-700 dark:text-blue-400'
                            : 'border-gray-300 dark:border-gray-700',
                    ]"
                    maxlength="4"
                    type="text"
                    :value="refined_country_code"
                    @focus="handleFocus"
                    @input="handleCountryCodeInput($event as InputEvent)"
                />
                <input
                    class="w-full text-sm px-2 py-3 relative z-0 outline-none"
                    type="text"
                    :value="phone.number"
                    :placeholder="placeholder"
                    @focus="[(focused = true), closeCountryCodeOptions()]"
                    @blur="focused = false"
                    @input="handleInput($event as InputEvent)"
                />
            </div>
        </InputContainer>

        <DropdownElement
            class="mt-2"
            v-if="showingCountryCodeOptions"
            :options="
                countryCodes.map((c, index) => countryToDropdownLabel(c, index))
            "
            :search="phone.country_code"
            dont_filter="false"
            @select="
                (v) => [
                    $emit('input', { ...phone, country_code: v.value.code }),
                    closeCountryCodeOptions(),
                ]
            "
        />
    </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref } from "vue";
import DropdownElement from "../Dropdown.element.vue";
import type { DropdownLabel } from "../models/DropdownLabel";
import InputContainer from "./Input.container.vue";
import { useCountryCodesCollection } from "@/core/utils/country-codes";

interface CountryCode {
    country: string;
    code: string;
    flag: string;
}
const $emit = defineEmits<{
    (e: "input", value: { country_code: string; number: string }): void;
}>();
const $props = withDefaults(
    defineProps<{
        label: string;
        phone?: {
            country_code: string;
            number: string;
        };
        error?: {
            phone: string | string[];
            country_code: string | string[];
        };
        optional?: boolean | "true" | "false";
        placeholder?: string;
    }>(),
    {
        phone(props) {
            return {
                country_code: "",
                number: "",
                ...props,
            };
        },
    },
);

const root = ref<HTMLDivElement | null>(null);
const focused = ref<boolean>(false);
const showingCountryCodeOptions = ref<boolean>(false);
const countryCodes = useCountryCodesCollection();

const refined_country_code = computed(() => {
    if ($props.phone.number.match(/^\+/)) return $props.phone.country_code;
    return `+${$props.phone.country_code}`;
});

function handleFocus() {
    focused.value = true;
    showingCountryCodeOptions.value = true;
    document.addEventListener("click", listenForOutsideClicks);
}

function listenForOutsideClicks(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (root.value!.contains(target)) return;

    focused.value = false;
    showingCountryCodeOptions.value = false;
    document.removeEventListener("click", listenForOutsideClicks);
}

function closeCountryCodeOptions() {
    showingCountryCodeOptions.value = false;
    document.removeEventListener("click", listenForOutsideClicks);
}

onUnmounted(() => {
    document.removeEventListener("click", listenForOutsideClicks);
});

const phone_error = computed(() => {
    if (!$props.error) return [];
    if (typeof $props.error.phone === "string") return [$props.error.phone];
    return $props.error.phone ?? {};
});

const country_code_error = computed(() => {
    if (!$props.error) return [];
    if (typeof $props.error.country_code === "string")
        return [$props.error.country_code];
    return $props.error.country_code;
});

function countryToDropdownLabel(
    c: CountryCode,
    index: number,
): DropdownLabel<CountryCode> {
    return {
        id: String(index),
        label: `${c.flag} ${c.country} (+${c.code})`,
        value: c,
    };
}

const number_regex = /^[0-9]*$/;

function handleInput(e: InputEvent) {
    const inputEl = e.target as HTMLInputElement;
    const value = inputEl.value;

    // only allow numbers can't start with 0 at the beginning
    if (!number_regex.test(value) || value[0] === "0") {
        inputEl.value = $props.phone.number;
        return;
    }

    $emit("input", { ...$props.phone, number: value });
}

function handleCountryCodeInput(e: InputEvent) {
    const inputEl = e.target as HTMLInputElement;
    const value = inputEl.value.replace("+", "");

    // only allow numbers can't start with 0 at the beginning
    if (!number_regex.test(value) || value[1] === "0") {
        inputEl.value = $props.phone.country_code;
        return;
    }

    $emit("input", { ...$props.phone, country_code: value });
}
</script>

<style scoped></style>
