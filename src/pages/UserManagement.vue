<template>
    <div class="min-h-screen bg-[#FCFCF2] flex">
        <aside class="w-64 bg-white/90 border-r p-6 shadow-sm flex flex-col">
            <div class="font-extrabold text-2xl mb-8 flex items-center gap-2">
                <span class="text-4xl">🐶</span>
                <span>삐돌이 마켓</span>
                <span class="text-xs text-gray-400 ml-1">(관리자)</span>
            </div>
            <nav class="space-y-4 font-semibold text-lg flex-1">
                <router-link to="/admin">
                    <button class="text-left w-full hover:text-[#47C9AF] mb-4">
                        대시보드
                    </button>
                </router-link>
                <router-link to="/admin/user">
                    <button class="text-left w-full hover:text-[#47C9AF] mb-4">
                        회원 관리
                    </button>
                </router-link>

                <router-link to="/admin/product">
                    <button class="text-left w-full hover:text-[#47C9AF]">
                        상품 관리
                    </button>
                </router-link>
                <button class="text-left w-full hover:text-[#47C9AF]">
                    신고/문의
                </button>
            </nav>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 p-12">
            <header class="flex justify-between items-center mb-8">
                <div class="text-2xl font-bold">회원 관리</div>
                <input
                    v-model="search"
                    placeholder="이름, 이메일, ID 검색"
                    class="border rounded-xl px-4 py-2 w-72 shadow"
                />
            </header>

            <div class="bg-white rounded-2xl shadow p-8">
                <table class="w-full text-center">
                    <thead>
                        <tr class="border-b text-gray-600">
                            <th class="py-2">ID</th>
                            <th>이름</th>
                            <th>닉네임</th>
                            <th>이메일</th>
                            <th>가입일</th>
                            <th>상태</th>
                            <th>관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="user in filteredUsers"
                            :key="user.id"
                            class="border-b hover:bg-gray-50 transition"
                        >
                            <td class="py-2">{{ user.id }}</td>
                            <td>{{ user.name }}</td>
                            <td>{{ user.nickname }}</td>
                            <td>{{ user.email }}</td>
                            <td>{{ formatDate(user.createdAt) }}</td>
                            <td>
                                <span
                                    v-if="user.isActive"
                                    class="text-green-500 font-semibold"
                                    >활성</span
                                >
                                <span v-else class="text-gray-400">정지</span>
                            </td>
                            <td>
                                <button
                                    class="text-xs px-2 py-1 rounded bg-[#47C9AF] text-white hover:bg-[#33a395] mr-2"
                                    @click="userDetail(user)"
                                >
                                    상세
                                </button>
                                <button
                                    v-if="user.isActive"
                                    class="text-xs px-2 py-1 rounded bg-red-400 text-white hover:bg-red-600"
                                    @click="controlIsActive(user)"
                                >
                                    정지
                                </button>
                                <button
                                    v-else
                                    class="text-xs px-2 py-1 rounded bg-green-400 text-white hover:bg-green-600"
                                    @click="controlIsActive(user)"
                                >
                                    활성
                                </button>
                            </td>
                        </tr>
                        <tr v-if="filteredUsers.length === 0">
                            <td colspan="6" class="py-4 text-gray-400">
                                검색 결과가 없습니다.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAdminApi } from "../api/admin";
import { formatDate } from "../utils/formatters";
import { useRouter } from "vue-router";

// 더미 데이터
const users = ref([]);
const adminApi = useAdminApi();
const router = useRouter();

onMounted(async () => {
    users.value = await adminApi.findAllUser();
    console.log(users.value);
});

const search = ref("");

const filteredUsers = computed(() =>
    users.value.filter(
        (u) =>
            u.name.includes(search.value) ||
            u.email.includes(search.value) ||
            String(u.id).includes(search.value)
    )
);

async function controlIsActive(user) {
    const res = await adminApi.controlIsActive(user.id, !user.isActive);
    if (res.status == 200) user.isActive = !user.isActive;
}

function userDetail(user) {
    router.push(`/seller/${user.id}`);
}
</script>
