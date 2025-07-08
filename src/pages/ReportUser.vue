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
                <div class="text-2xl font-bold">신고된 사용자 관리</div>
                <!-- <input
                    v-model="search"
                    placeholder="상품명, 판매자, ID 검색"
                    class="border rounded-xl px-4 py-2 w-72 shadow"
                /> -->
            </header>

            <div class="bg-white rounded-2xl shadow p-8">
                <table class="w-full text-center">
                    <thead>
                        <tr class="border-b text-gray-600">
                            <th class="py-2">피신고인</th>
                            <th>신고자</th>
                            <th>신고내용</th>
                            <th>신고 날짜</th>
                            <th>상태</th>
                            <th>관리</th>
                            <th>처리 날짜</th>
                            <th>관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="report in ReportList"
                            :key="report.reportId"
                            class="border-b hover:bg-gray-50 transition"
                            @click = "reportDetail(report.reportId)"
                        >
                            <td class="py-2">{{ report.reportedUserName }}</td>    
                            <td>{{ report.reporterName }}</td>
                            <td>{{ report.content.length >5 ? report.content.substr(0,5)+'...': report.content }}</td>                            
                            <td>{{ formatDate(report.createdAt) }}</td>
                            <td>{{ report.reportStatus === "PENDING" ? "미처리" : "처리"}}</td>
                            <!-- <td>{{ report.price.toLocaleString() }}원</td> -->

                                  <!-- 상태에 따라 다른 라벨 보여주기 -->
                            <td v-if="report.reportStatus === 'PENDING'" class="text-gray-400">대기</td>
                            <td v-else-if="report.reportStatus === 'APPROVED'" class="text-gray-400">승인</td>
                            <td v-else-if="report.reportStatus === 'REJECTED'" class="text-gray-400">거절</td>
                            <td>{{ formatDate(report.updateAt) }}</td>
                            <td v-if="report.reportStatus === 'PENDING'">
                                <button
                                    class="text-xs px-2 py-1 rounded bg-[#47C9AF] text-white hover:bg-[#33a395] mr-2"
                                     @click.stop="approveReport(report.reportId,'APPROVED')"
                                >
                                    승인
                                </button>
                                <button
                                    class="text-xs px-2 py-1 rounded bg-red-400 text-white hover:bg-red-600"
                                     @click.stop="rejectUser(report.reportId,'REJECTED')"
                                >
                                    거절
                                </button>
                            </td>
                            <td v-else class="text-gray-400">처리됨</td>
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
import { useModalStore } from "../stores/modal";
import { useRouter } from "vue-router";
import {useReportApi} from "../api/report";
import { ArrowUpOnSquareStackIcon } from "@heroicons/vue/16/solid";

const { userReportList, updateUserReport} = useReportApi(); 

// 더미 데이터
const items = ref([]);
const adminApi = useAdminApi();
const modal = useModalStore();
const router = useRouter();

const ReportList = ref([]);

onMounted(async () => {
    const res = await userReportList();
    console.log("신고내역",res);
    ReportList.value=res.data.data;
});



async function approveReport(id, status) {
    try {
        const res= await updateUserReport(id,status)
        console.log("승인:",res);
        // 로그인 성공 모달
        modal.open({
            title: "정지 성공",
            message: "신고된 사용자를 정지 했습니다.",
        });
await userReportList();
        setTimeout(async () => {
            const res = await userReportList();
            ReportList.value=res.data.data;
        }, 1000);
    } catch (error) {
        modal.open({
            title: "정지 실패",
            message: error.message,
        });
    }
}
async function rejectUser(id, status) {
    try {
        const res= await updateUserReport(id,status)

        modal.open({
            title: "신고 거절",
            message: "신고를 거절 했습니다.",
        });

        setTimeout(async () => {
            const res = await userReportList();
            ReportList.value=res.data.data;
        }, 1000);
    } catch (error) {
        modal.open({
            title: "신고 거절 실패",
            message: error.message,
        });
    }
}
const reportDetail=(id)=>{
    console.log("reportDetail");
    console.log(id);
    router.push(`/admin/report/userdetail/${id}`)
}
const goDetail=(id)=>{
    router.push(`/chat/${id}`);
}
</script>

