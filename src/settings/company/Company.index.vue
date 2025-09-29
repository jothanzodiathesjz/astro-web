<template>
    <div class="w-full h-full min-h-0 flex flex-col px-5 dark:bg-gray-900">
        <ConfirmModal
            :visible="tbd ? true : false"
            :header="'Delete Department'"
            message="Are you sure you want to delete this department?"
            :icon="'fa-triangle-exclamation'"
            :disabled="deleting"
            @confirm="deleteItem()"
            @cancel="tbd = null"
        />
        <Toast
            :duration="2000"
            :type="'error'"
            :message="errors?.message ?? ''"
            :show="errors?.message ? true : false"
            @on-close="errors = null"
        />
        <!-- <div class="w-full flex flex-row py-3 mt-3">
            <span class="text-lg font-semibold dark:text-gray-200">Users</span>
        </div> -->
        <!-- <span
            class="dark:text-gray-200 font-semibold bg-white dark:bg-gray-700 py-3 px-4 mt-4 rounded"
            >Company</span
        > -->

        <div
            class="py-5 rounded-lg flex flex-col gap-3 bg-white dark:bg-gray-800 px-5 mb-3"
        >
            <div class="w-full flex flex-row">
                <div class="w-1/3">
                    <!-- <TextInput
                        :value="search"
                        :placeholder="'Search Department'"
                        :debounce="400"
                    /> -->
                </div>
                <div class="w-full flex flex-row gap-4 justify-end">
                    <ButtonComponent
                        @click="$router.push({ name: 'CompanyForm' })"
                        class="text-sm"
                        :variant="'primary'"
                        >Add Company</ButtonComponent
                    >
                </div>
            </div>
            <TableComponent :empty="false">
                <template #table-header>
                    <tr>
                        <th
                            class="table-header-custom text-start font-normal dark:text-gray-400"
                        >
                            Name
                        </th>
                        <th
                            class="table-header-custom text-start font-normal dark:text-gray-400"
                        >
                            Industry
                        </th>
                        <th
                            class="table-header-custom text-start font-normal dark:text-gray-400"
                        >
                            Address
                        </th>
                        <th class="table-header-custom"></th>
                    </tr>
                </template>
                <template #table-body>
                    <tr
                        class="table-row-custom"
                        v-for="emp in list"
                        :key="emp.name"
                    >
                        <td
                            class="table-cell-custom text-gray-700 dark:text-gray-300"
                        >
                            {{ emp.name }}
                        </td>
                        <td
                            class="table-cell-custom text-gray-700 dark:text-gray-300"
                        >
                            {{ emp.industry }}
                        </td>
                        <td
                            class="table-cell-custom text-gray-700 dark:text-gray-300"
                        >
                            {{ emp.address.street }}, {{ emp.address.city }}
                        </td>
                        <td class="table-cell-custom">
                            <div class="flex flex-row gap-2">
                                <IconButton
                                    class="border border-gray-300 dark:border-gray-600 rounded p-2"
                                    :icon-name="'eye'"
                                    :icon-color="'text-gray-400 dark:text-gray-400'"
                                    :disabled="emp.uuid ? false : true"
                                    @click="
                                        emp.uuid &&
                                            $router.push({
                                                name: 'CompanyDetail',
                                                params: { uuid: emp.uuid },
                                            })
                                    "
                                />
                                <IconButton
                                    class="border border-gray-300 dark:border-gray-600 rounded p-2"
                                    :icon-name="'pencil'"
                                    :icon-color="'text-gray-400 dark:text-gray-400'"
                                    :disabled="emp.uuid ? false : true"
                                    @click="
                                        emp.uuid &&
                                            $router.push({
                                                name: 'CompanyForm',
                                                params: { uuid: emp.uuid },
                                            })
                                    "
                                />
                                <IconButton
                                    class="border border-gray-300 dark:border-gray-600 rounded p-2"
                                    :icon-color="'text-red-400 dark:text-red-400'"
                                    :icon-name="'trash'"
                                    @click="tbd = emp"
                                />
                            </div>
                        </td>
                    </tr>
                </template>
            </TableComponent>
        </div>
    </div>
</template>
<script setup lang="ts">
// import TextInput from "@/core/components/input/Text.input.vue";
import TableComponent from "@/core/components/table/Table.component.vue";
import IconButton from "@/core/components/button/Icon.button.vue";
import ButtonComponent from "@/core/components/button/Button.component.vue";
import { container } from "@/container/di";
import { TOKENS } from "@/container/tokens";
import { onMounted, ref } from "vue";
import ConfirmModal from "@/core/components/modal/Confirm.modal.vue";
import { handleErrors, UIError } from "@/core/ui/UIError";
import Toast from "@/core/components/Toast.vue";
import type { DomainCompany } from "@/domain/models/Company";

const repository = container.get(TOKENS.CompanyRepository);
const list = ref<DomainCompany[]>([]);
const tbd = ref<DomainCompany | null>(null);
const deleting = ref(false);
const errors = ref<UIError | null>(null);
// const search = ref<string>("");

async function getList() {
    try {
        list.value = await repository.getAll();
    } catch (error) {
        console.log(error);
    }
}

async function deleteItem() {
    try {
        deleting.value = true;
        if (tbd.value) {
            await repository.delete(tbd.value.uuid);
            tbd.value = null;
            getList();
        }
    } catch (error) {
        errors.value = handleErrors(error);
        console.log(errors.value);
    } finally {
        deleting.value = false;
    }
}

onMounted(async () => {
    getList();
});
</script>

<style scoped></style>
