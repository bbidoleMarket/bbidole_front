<template>
  <!--가장 밖-->
  <div class="flex flex-col justify-start items-center min-h-screen gap-4">
    <!-- 구매 목록-->
    <div>
      <h2 class="font-jua mt-9 text-2xl">구매 목록</h2>
    </div>

    <!--리스트 -->
    <!--모바일 화면에서 무한 스크롤-->
    <div
      v-if="isMobile"
      ref="scrollContainer"
      @scroll="handleScroll"
      class="overflow-hidden h-[80vh] border"
    >
      <ul
        class="w-screen space-y-4 flex flex-col justify-center items-center gap-2"
      >
        <li
          v-for="purchase in purchaseList"
          :key="purchase.purchaseId"
          @click="goDetail(purchase.purchaseId)"
          class="hover:bg-gray-100 p-2 border-gray-300 shadow w-full max-w-md md:max-w-wl lg:max-w-3xl max-auto transition-all duration-300 flex flex-row gap-7 rounded-md"
        >
          <!-- 게시글 이미지-->
          <div
            class="w-20 h-20 flex justify-center items-center overflow-hidden rounded-md"
          >
            <img
              src="/image/stanley.jpg"
              alt="게시글 사진"
              class="object-contain"
            />
          </div>

          <div class="flex flex-col gap-2 mt-2">
            <!-- 게시글 제목-->
            <div>
              <h2 class="font-hahmlet">{{ purchase.title }}</h2>
            </div>
            <!-- 게시글 가격-->
            <div>
              <p class="font-hahmlet">{{ purchase.price }}원</p>
            </div>
          </div>
        </li>
      </ul>
      <!-- 무한스크롤 대기중-->
      <div v-if="isLoading">
        <i class="fa-solid fa-spinner"></i>
      </div>
    </div>
    <!--페이지네이션-->
    <div v-if="!isMobile">
      <button
        @click="prePage"
        :disableed="currentPage == 1"
        class="px-3 py-1 rounded-sm border border-grey-300 hover:bg-opacity-90 disabled:opacity-50"
      >
        <
      </button>
      <button
        v-for="page in totalPage"
        :key="page"
        @click="goTopage(page)"
        :class="[
          'p-3 py-1 rounded-border',
          currentPage == page - 1
            ? 'bg-[#45A8A6] text-white'
            : 'bg-gray-300 hover:bg-gray-200',
        ]"
      >
        {{ page }}
      </button>
      <button
        @click="nextPage"
        :disableed="currentPage == totalPage"
        class="px-3 py-1 rounded-sm border border-grey-300 hover:bg-opacity-90 disabled:opacity-50"
      >
        >
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { UseTransactionListAPi } from "@/api/userTransaction";

const { purchaseList: fetchPurchaseList } = UseTransactionListAPi();
const purchaseList = ref([]);
const currentPage = ref(0);
const pageSize = 5;
const totalPage = ref(0);

//반응형 화면 감지
const isMobile = ref(window.innerWidth <= 393);
const handleResize = () => {
  isMobile.value = window.innerWidth <= 393;
};
onMounted(() => {
  window.addEventListener("resize", handleResize);
});
onUnmounted(() => window.removeEventListener("resize", handleResize));
watch(isMobile, (newVal, oldVal) => {
  if (newVal) {
    console.log("📱 모바일 모드 진입");
  } else {
    console.log("💻 데스크탑 모드 진입");
  }
});

//무한 스크롤
const isLoading = ref(false);
const scrollContainer = ref(null);
//스크롤 이벤트 발생 시
const handleScroll = () => {
  if (isLoading.value) return;
  const el = scrollContainer.value;
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
    currentPage.value++;
    fetchPageData();
  }
};
//백엔드 연결 전 더미데이터 테스트
// const purchaseList = ref([
//   { purchaseId: 1, title: "테스트 게시글", price: 10000 },
//   { purchaseId: 2, title: "샘플 게시글", price: 20000 },
//   { purchaseId: 3, title: " 게시글", price: 40000 },
// ]);

const userId = 1; //임시 로그인 완료되면 지워야 함 아이디 하드코딩
onMounted(() => {
  fetchPageData();
});
//나중에 변경
// onMounted(async()=>{
//   const res = await purchaseList();
//   purchase.value= res.data;
// })
const fetchPageData = async () => {
  isLoading.value = true;
  const res = await fetchPurchaseList(userId, currentPage.value, pageSize);
  console.log(res);
  //게시글 목록
  purchaseList.value = res.data.data.content;
  //총 페이지 수
  totalPage.value = res.data.data.totalPages;
  isLoading.value = false;
};

const prePage = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
    fetchPageData();
  }
};
const nextPage = () => {
  if (currentPage.value < totalPage.value - 1) {
    currentPage.value++;
    console.log("currentPage : " + currentPage.value);
    console.log("TPage : " + totalPage.value);
    fetchPageData();
  }
};
const goTopage = (page) => {
  currentPage.value = page - 1;
  fetchPageData();
};
const goDetail = (id) => router.push(`/postdetail/${id}`);
</script>
