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
                    <button class="text-left w-full hover:text-[#47C9AF] mb-4">
                        상품 관리
                    </button>
                </router-link to="/admin/report">
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
            <header class="flex justify-between items-center mb-8">
                <div class="text-2xl font-bold">신고 내용</div>
                <!-- <input
                    v-model="search"
                    placeholder="상품명, 판매자, ID 검색"
                    class="border rounded-xl px-4 py-2 w-72 shadow"
                /> -->
            </header>

            <div class="bg-white rounded-2xl shadow p-8">
              <p>{{ ReportContent.content }}</p>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAdminApi } from "../api/admin";
import { formatDate } from "../utils/formatters";
import { useModalStore } from "../stores/modal";
import { useRouter } from "vue-router";
import {useReportApi} from "../api/report";
import { ArrowUpOnSquareStackIcon } from "@heroicons/vue/16/solid";
import { useRoute } from 'vue-router'
const { userReportList, userReportDetail,updateUserReport} = useReportApi(); 
const route = useRoute()
const reportId = Number(route.params.reportId);
const router = useRouter();

const ReportContent  = ref("");

onMounted(async () => {
      console.log(reportId);
    const res = await userReportDetail(reportId);
    console.log("상세",res);
    ReportContent .value=res.data.data;
});


const goDetail=(id)=>{
    router.push(`/chat/${id}`);
}
</script>

