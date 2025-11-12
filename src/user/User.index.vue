<template>
    <div class="w-full h-full min-h-0 flex flex-col px-5 dark:bg-gray-900">
        <ConfirmModal
            :visible="tbd ? true : false"
            :header="'Delete User'"
            message="Are you sure you want to delete this user?"
            :icon="'fa-triangle-exclamation'"
            @confirm=""
            @cancel="tbd = null"
        />
        <!-- <div class="w-full flex flex-row py-3 mt-3">
            <span class="text-lg font-semibold dark:text-gray-200">Users</span>
        </div> -->
        <!-- <span
            class="dark:text-gray-200 font-semibold bg-white dark:bg-gray-700 py-3 px-4 mt-4 rounded"
            >List of users</span
        > -->

        <div
            class="py-5 flex flex-col gap-3 mt-4 px-5 mb-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-7"
        >
            <div class="w-full flex flex-row">
                <div class="w-1/3">
                    <TextInput
                        :value="search"
                        :placeholder="'Search user'"
                        :debounce="400"
                        @input="(v) => [(search = v), getAllUsers()]"
                    />
                </div>
                <div class="w-full flex flex-row gap-4 justify-end">
                    <ButtonComponent
                        class="text-sm"
                        :variant="'outline'"
                        :icon-name="'fa-file-import'"
                        >Import</ButtonComponent
                    >
                    <ButtonComponent
                        class="text-sm"
                        :variant="'outline'"
                        :icon-name="'fa-file-export'"
                        >Export</ButtonComponent
                    >
                    <ButtonComponent
                        @click="$router.push({ name: 'UserForm' })"
                        class="text-sm"
                        :variant="'primary'"
                        >Add User</ButtonComponent
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
                            Email
                        </th>
                        <th
                            class="table-header-custom text-start font-normal dark:text-gray-400"
                        >
                            Username
                        </th>
                        <th
                            class="table-header-custom text-start font-normal dark:text-gray-400"
                        >
                            Role
                        </th>
                        <th class="table-header-custom"></th>
                    </tr>
                </template>
                <template #table-body>
                    <tr
                        class="table-row-custom"
                        v-for="emp in userList"
                        :key="emp.uuid"
                    >
                        <td
                            class="table-cell-custom text-gray-700 dark:text-gray-300"
                        >
                            <div
                                class="flex flex-row gap-3 w-52 items-center shrink-0"
                            >
                                <div
                                    class="rounded-full w-10 h-10 shrink-0 bg-gray-200 dark:bg-gray-700 flex flex-row items-center justify-center"
                                >
                                    {{ emp.name.charAt(0) }}
                                </div>
                                <span class="font-semibold text-blue-500">{{
                                    emp.name
                                }}</span>
                            </div>
                        </td>
                        <td
                            class="table-cell-custom text-gray-700 dark:text-gray-300"
                        >
                            {{ emp.email }}
                        </td>
                        <td
                            class="table-cell-custom text-gray-700 dark:text-gray-300"
                        >
                            {{ emp.username }}
                        </td>
                        <td
                            class="table-cell-custom text-gray-700 dark:text-gray-300"
                        >
                            {{ emp.role.name }}
                        </td>
                        <td class="table-cell-custom">
                            <div class="flex flex-row gap-2">
                                <IconButton
                                    class="border border-gray-300 dark:border-gray-600 rounded p-2"
                                    @click="
                                        $router.push({
                                            name: 'UserDetail',
                                            params: { uuid: emp.uuid },
                                        })
                                    "
                                    :icon-name="'pencil'"
                                    :icon-color="'text-gray-400 dark:text-gray-400'"
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
import TextInput from "@/core/components/input/Text.input.vue";
import TableComponent from "@/core/components/table/Table.component.vue";
import IconButton from "@/core/components/button/Icon.button.vue";
import ButtonComponent from "@/core/components/button/Button.component.vue";
import { container } from "@/container/di";
import { TOKENS } from "@/container/tokens";
import { onMounted, ref } from "vue";
import { DomainUser } from "@/domain/models/User";
import ConfirmModal from "@/core/components/modal/Confirm.modal.vue";

const repository = container.get(TOKENS.UserRepository);
const userList = ref<DomainUser[]>([]);
const tbd = ref<DomainUser | null>(null);
const search = ref<string>("");

async function getAllUsers() {
    try {
        userList.value = await repository.getAll({
            search: search.value,
        });
    } catch (error) {
        console.log(error);
    }
}

onMounted(async () => {
    getAllUsers();
});
</script>

<style scoped></style>
