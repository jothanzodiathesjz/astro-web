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
        <div class="flex flex-row items-center gap-4">
            <ButtonComponent
                @click="$router.back()"
                :variant="'outline'"
                :icon-name="'fa-angle-left'"
                >Back</ButtonComponent
            >
            <div class="w-full flex flex-row gap-3 items-center">
                <span
                    @click="$router.back()"
                    class="font-semibold text-blue-600 dark:text-gray-200 cursor-pointer"
                    >Company</span
                >
                <IconButton :icon-name="'fa-angle-right'" />
                <span class="font-semibold text-gray-800 dark:text-gray-200"
                    >Branch</span
                >
            </div>
        </div>

        <div
            class="py-5 rounded-lg flex flex-col gap-3 bg-white dark:bg-gray-800 mt-4 px-5 mb-3"
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
                        @click="$router.push({ name: 'BranchForm' })"
                        class="text-sm"
                        :variant="'primary'"
                        >Add Branch</ButtonComponent
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
                        <th
                            class="table-header-custom text-start font-normal dark:text-gray-400"
                        >
                            Main Company
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
                        <td
                            class="table-cell-custom text-gray-700 dark:text-gray-300"
                        >
                            <span
                                class=""
                                :class="
                                    emp.is_head_office
                                        ? 'font-semibold text-green-500'
                                        : ' font-semibold text-red-500'
                                "
                                >{{ emp.is_head_office ? "Yes" : "No" }}</span
                            >
                        </td>
                        <td class="table-cell-custom">
                            <div class="flex flex-row gap-2">
                                <IconButton
                                    class="border border-gray-300 dark:border-gray-600 rounded p-2"
                                    :icon-name="'pencil'"
                                    :icon-color="'text-gray-400 dark:text-gray-400'"
                                    @click="
                                        $router.push({
                                            name: 'BranchEdit',
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
import { handleErrors, type UIError } from "@/core/ui/UIError";
import Toast from "@/core/components/Toast.vue";
import type { DomainBranch } from "@/domain/models/Branch";

const repository = container.get(TOKENS.BranchRepository);
const list = ref<DomainBranch[]>([]);
const tbd = ref<DomainBranch | null>(null);
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
            await repository.delete(tbd.value);
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
