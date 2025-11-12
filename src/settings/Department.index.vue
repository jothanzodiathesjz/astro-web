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
            :message="errors?.data?.message ?? ''"
            :show="errors?.message ? true : false"
            @on-close="errors = null"
        />
        <!-- <div class="w-full flex flex-row py-3 mt-3">
            <span class="text-lg font-semibold dark:text-gray-200">Users</span>
        </div> -->
        <!-- <span
            class="dark:text-gray-200 font-semibold bg-white dark:bg-gray-700 py-3 px-4 mt-4 rounded"
            >Department</span
        > -->

        <div
            class="py-5 flex flex-col gap-3 px-5 mb-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-7"
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
                        @click="$router.push({ name: 'DepartmentForm' })"
                        class="text-sm"
                        :variant="'primary'"
                        >Add Department</ButtonComponent
                    >
                </div>
            </div>
            <TableComponent :empty="false">
                <template #table-header>
                    <tr>
                        <th
                            class="table-header-custom text-start font-normal dark:text-gray-400"
                        >
                            Code
                        </th>
                        <th
                            class="table-header-custom text-start font-normal dark:text-gray-400"
                        >
                            Name
                        </th>
                        <th class="table-header-custom"></th>
                    </tr>
                </template>
                <template #table-body>
                    <tr
                        class="table-row-custom"
                        v-for="emp in list"
                        :key="emp.code"
                    >
                        <td
                            class="table-cell-custom text-gray-700 dark:text-gray-300"
                        >
                            {{ emp.code }}
                        </td>
                        <td
                            class="table-cell-custom text-gray-700 dark:text-gray-300"
                        >
                            {{ emp.name }}
                        </td>
                        <td class="table-cell-custom">
                            <div class="flex flex-row gap-2">
                                <!-- <IconButton
                                    :icon-name="'pencil'"
                                    :icon-color="'text-gray-400 dark:text-gray-400'"
                                /> -->
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
import type { Department } from "@/domain/types/EmployeeAttributes";
import { handleErrors, type UIError } from "@/core/ui/UIError";
import Toast from "@/core/components/Toast.vue";

const repository = container.get(TOKENS.DepartmentRepository);
const list = ref<Department[]>([]);
const tbd = ref<Department | null>(null);
const deleting = ref(false);
const errors = ref<UIError | null>(null);
// const search = ref<string>("");

async function getList() {
    try {
        list.value = await repository.getDepartments();
    } catch (error) {
        console.log(error);
    }
}

async function deleteItem() {
    try {
        deleting.value = true;
        if (tbd.value) {
            await repository.delete(tbd.value.code);
            tbd.value = null;
            getList();
        }
    } catch (error) {
        errors.value = handleErrors(error);
    } finally {
        deleting.value = false;
    }
}

onMounted(async () => {
    getList();
});
</script>

<style scoped></style>
