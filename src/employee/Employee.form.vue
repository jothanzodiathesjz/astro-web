<template>
  <div class="w-full h-full flex flex-col px-14 bg-gray-50 dark:bg-gray-900">
    <div class="w-full flex flex-row py-3 mt-3 gap-4">
      <IconButton
        @click="$router.back()"
        :icon-name="'arrow-left'"
        :size="'lg'"
      />
      <span class="text-2xl font-semibold dark:text-gray-200"
        >Form Employee</span
      >
    </div>
    <div
      class="w-full bg-white dark:bg-gray-800 flex flex-row mt-5 rounded-2xl px-8 py-3"
    >
      <div class="w-1/4 p-5 flex flex-col gap-4">
        <div class="flex flex-row gap-2 items-center">
          <span
            class="border bg-gray-300 border-gray-400 dark:border-gray-700 w-6 flex justify-center items-center h-6 shrink-0 rounded-full"
            >1</span
          >
          <span
            class="dark:text-gray-300"
            :class="steps === 1 ? 'font-semibold' : ''"
            >Personal</span
          >
        </div>
        <div class="flex flex-row gap-2 items-center">
          <span
            class="border bg-gray-300 text-sm border-gray-400 dark:border-gray-700 w-6 flex justify-center items-center h-6 shrink-0 rounded-full"
            >2</span
          >
          <span
            class="dark:text-gray-300"
            :class="steps === 2 ? 'font-semibold' : ''"
            >Employment</span
          >
        </div>
      </div>
      <div class="w-full p-5 flex flex-col gap-3">
        <div v-if="steps === 1" class="w-full flex flex-col gap-4">
          <span class="font-semibold dark:text-gray-200">Personal Data</span>
          <div class="flex flex-row gap-5 items-end">
            <TextInput label="Name" :value="''" :placeholder="'Fisrtname'" />
            <TextInput :value="''" :placeholder="'Lastname'" />
          </div>
          <TextInput
            label="Email"
            :value="''"
            :placeholder="'email@gmail.com'"
          />
          <TextInput
            label="Phone Number"
            :value="''"
            :placeholder="'08214785236'"
          />
          <div class="flex flex-row gap-5 items-end">
            <TextInput
              label="Phone number"
              :value="''"
              :placeholder="'Phone number'"
            />
            <TextInput
              label="Place of birth"
              :value="''"
              :placeholder="'Birthdate'"
            />
          </div>
          <div class="grid grid-cols-2 gap-5 items-end">
            <div class="flex flex-col">
              <span class="text-sm dark:text-gray-400">Gender</span>
              <div class="flex flex-row gap-16 shrink-0 py-2">
                <div class="flex flex-row gap-3">
                  <button
                    class="border flex items-center justify-center rounded-full w-6 h-6 border-gray-300 shrink-0 relative"
                  >
                    <FontAwesomeIcon
                      icon="fa-solid fa-check"
                      class="text-sm text-green-500"
                    />
                  </button>
                  <span class="dark:text-gray-400 text-sm">Male</span>
                </div>
                <div class="flex flex-row gap-2 shrink-0">
                  <button
                    class="border flex items-center justify-center rounded-full w-6 h-6 border-gray-300 shrink-0 relative"
                  >
                    <FontAwesomeIcon
                      icon="fa-solid fa-check"
                      class="text-sm text-green-500"
                    />
                  </button>
                  <span class="dark:text-gray-400 text-sm">Female</span>
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <span class="text-sm dark:text-gray-400">Status</span>
              <TextDropdownInput
                label="Status"
                :options="statusToDropdown()"
                placeholder="Status"
                :selected="selectedStatus"
                :dontfilter="true"
                @update="(value) => (selectedStatus = value)"
                @clear="() => (selectedStatus = null)"
              />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-5 items-end">
            <div class="flex flex-col gap-2">
              <span class="text-sm dark:text-gray-400">Golongan Darah</span>
              <TextDropdownInput
                label="Golongan Darah"
                :options="statusToDropdown()"
                placeholder="Pilih Golongan Darah"
                :selected="selectedStatus"
                :dontfilter="true"
                @update="(value) => (selectedStatus = value)"
                @clear="() => (selectedStatus = null)"
              />
            </div>
            <div class="flex flex-col gap-2">
              <span class="text-sm dark:text-gray-400">Agama</span>
              <TextDropdownInput
                label="Agama"
                :options="statusToDropdown()"
                placeholder="Pilih Agama"
                :selected="selectedStatus"
                :dontfilter="true"
                @update="(value) => (selectedStatus = value)"
                @clear="() => (selectedStatus = null)"
              />
            </div>
          </div>
        </div>
        <div v-if="steps === 2" class="w-full flex flex-col gap-4">
          <span class="font-semibold dark:text-gray-200">Employment Data</span>
          <div class="flex flex-row gap-5 items-end">
            <TextInput label="Employee Id" :value="''" :placeholder="'ID'" />
            <TextInput label="Bacode" :value="''" :placeholder="'Bacode'" />
          </div>
          <div class="flex flex-row gap-5 items-end">
            <TextInput
              label="Group Structure"
              :value="''"
              :placeholder="'Select Group'"
            />
            <TextInput
              label="Employment status"
              :value="''"
              :placeholder="'Select Employment status'"
            />
          </div>
        </div>
        <div class="w-full flex flex-row justify-end mt-4 gap-4">
          <ButtonComponent
            v-if="steps === 2"
            @click="steps = 1"
            :variant="'secondary'"
            >Back</ButtonComponent
          >
          <ButtonComponent @click="steps = 2" :variant="'primary'"
            >Next</ButtonComponent
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TextInput from "@/components/input/Text.input.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import IconButton from "@/components/button/Icon.button.vue";
import TextDropdownInput from "@/components/input/TextDropdown.input.vue";
import type { DropdownLabel } from "@/components/models/DropdownLabel";
import { ref } from "vue";
import ButtonComponent from "@/components/button/Button.component.vue";

const data = ["Lajang", "Menikah", "Duda", "Janda"];

const statusToDropdown = () => {
  return data.map((item) => {
    return {
      label: item,
      value: item,
      id: item,
    };
  }) as DropdownLabel[];
};

const selectedStatus = ref<DropdownLabel | null>({
  label: "Lajang",
  value: "Lajang",
  id: "Lajang",
});

const steps = ref(1);
</script>

<style scoped></style>
