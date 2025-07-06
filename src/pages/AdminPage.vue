<template>
    <div class="min-h-screen bg-[#FCFCF2] flex">
        <!-- Sidebar -->
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
                    <button class="text-left w-full hover:text-[#47C9AF] mb-4">
                        상품 관리
                    </button>
                </router-link>
                <router-link to="/admin/report/user">
                    <button class="text-left w-full hover:text-[#47C9AF] mb-4">
                        사용자 신고
                    </button>
                </router-link>
                <router-link to="/admin/report/post">
                    <button class="text-left w-full hover:text-[#47C9AF] mb-4">
                        게시글 신고
                    </button>
                </router-link>
            </nav>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 p-12">
            <header class="flex justify-between items-center mb-10">
                <div class="text-3xl font-bold">관리자님, 환영합니다! 🎉</div>
            </header>
            <section class="grid grid-cols-4 gap-6 mb-10">
                <div
                    class="rounded-2xl shadow p-6 bg-white flex flex-col items-center"
                >
                    <div class="font-semibold text-lg mb-2">가입 회원수</div>
                    <div class="text-2xl font-extrabold text-[#47C9AF]">
                        {{ totalSub }}
                    </div>
                </div>
                <div
                    class="rounded-2xl shadow p-6 bg-white flex flex-col items-center"
                >
                    <div class="font-semibold text-lg mb-2">상품 총 개수</div>
                    <div class="text-2xl font-extrabold text-[#47C9AF]">
                        {{ totalProduct }}
                    </div>
                </div>
                <div
                    class="rounded-2xl shadow p-6 bg-white flex flex-col items-center"
                >
                    <div class="font-semibold text-lg mb-2">거래 총 건수</div>
                    <div class="text-2xl font-extrabold text-[#47C9AF]">
                        {{ totalCompleted }}
                    </div>
                </div>
                <div
                    class="rounded-2xl shadow p-6 bg-white flex flex-col items-center"
                >
                    <div class="font-semibold text-lg mb-2">미처리 신고</div>
                    <div class="font-semibold text-lg mb-2">
                        사용자 / 게시글
                    </div>
                    <div class="text-2xl font-extrabold text-[#e36262]">
                        {{ userPending }} / {{ postPending }}
                    </div>
                </div>
            </section>
            <div class="grid grid-cols-2 gap-8">
                <div class="bg-white rounded-2xl shadow p-6">
                    <div class="font-semibold text-xl mb-4">최근 가입 회원</div>
                    <ul class="space-y-2">
                        <li
                            v-for="user in recentUsers"
                            :key="user.id"
                            class="text-gray-700"
                        >
                            {{ user.id }} / {{ user.name }} /
                            {{ user.nickname }} ({{
                                formatDate(user.createdAt)
                            }})
                        </li>
                    </ul>
                </div>
                <div class="bg-white rounded-2xl shadow p-6">
                    <div class="font-semibold text-xl mb-4">최근 등록 상품</div>
                    <ul class="space-y-2">
                        <li
                            v-for="item in recentItems"
                            :key="item.id"
                            class="text-gray-700"
                        >
                            {{ item.id }} / {{ item.title }} /
                            {{ item.price.toLocaleString() }}원 ({{
                                formatDate(item.createdAt)
                            }})
                        </li>
                    </ul>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useAdminApi } from "../api/admin";
import { formatDate } from "../utils/formatters";

const totalSub = ref(0);
const totalProduct = ref(0);
const totalCompleted = ref(0);
const userPending = ref(0);
const postPending = ref(0);
const adminApi = useAdminApi();

onMounted(async () => {
    totalSub.value = await adminApi.totalSub();
    totalProduct.value = await adminApi.totalProduct();
    totalCompleted.value = await adminApi.totalCompleted();
    recentUsers.value = await adminApi.recentUser();
    recentItems.value = await adminApi.recentProduct();
    userPending.value = await adminApi.userPending();
    postPending.value = await adminApi.postPending();
});

// 더미 데이터 예시
const recentUsers = ref([]);
const recentItems = ref([]);
</script>
