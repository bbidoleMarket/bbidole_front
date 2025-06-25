<template>
  <!--가장 밖-->
  <div class="flex flex-col justify-center items-center min-h-screen gap-4">
    <!-- 구매 목록-->
    <div class="bg-slate-400">
      <h2 class="font-jua">구매 목록</h2>
    </div>

    <!--리스트 -->
    <div>
      <ul
        class="w-screen space-y-4 flex flex-col justify-center items-center gap-4"
      >
        <li
          v-for="purchase in purchaseList"
          :key="purchase.purchaseId"
          @click="goDetail(purchase.purchaseId)"
          class="border-gray-300 hover:bg-opacity-90 shadow w-full max-w-md md:max-w-wl lg:max-w-3xl max-auto transition-all duration-300 flex flex-row gap-4 rounded-md"
        >
          <!-- 게시글 이미지-->
          <div class="rounded-sm w-20 h-20 flex justify-center items-center">
            <img
              src="/image/갈푸.webp"
              alt="게시글 사진"
              class="object-contain"
            />
          </div>

          <div class="flex flex-col">
            <!-- 게시글 제목-->
            <div>
              <h2>{{ purchase.title }}</h2>
            </div>
            <!-- 게시글 가격-->
            <div>
              <p>{{ purchase.price }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { UseTransactionListAPi } from "@/api/userTransaction";

const { purchaseList: fetchPurchaseList } = UseTransactionListAPi();
//const purchaseList = ref([]);

//백엔드 연결 전 더미데이터 테스트
const purchaseList = ref([
  { purchaseId: 1, title: "테스트 게시글", price: 10000 },
  { purchaseId: 2, title: "샘플 게시글", price: 20000 },
]);

const userId = 3; //임시 로그인 완료되면 지워야 함 아이디 하드코딩
onMounted(async () => {
  const res = await purchaseList(userId);
  purchase.value = res.data;
});
//나중에 변경
// onMounted(async()=>{
//   const res = await purchaseList();
//   purchase.value= res.data;
// })

const goDetail = (id) => router.push(`/postdetail/${id}`);
</script>
