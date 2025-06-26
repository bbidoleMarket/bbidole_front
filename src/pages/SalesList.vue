<template>
  <!--가장 밖-->
  <div class="flex flex-col justify-start items-center min-h-screen gap-4">
    <!-- 판매 목록-->
    <div>
      <h2 class="font-jua mt-9 text-2xl">판매 목록</h2>
    </div>
    <!-- 카테고리-->
    <div class="mb-6 h-full relative w-full max-w-md md:max-w-wl lg:max-w-3xl">
      <div class="absolute right-3">
        <select
          v-model="selectedCategory"
          name="카테고리"
          class="rounded-sm border-gray-300 shadow w-full p-0.5"
        >
          <option value="all">최신순</option>
          <option value="onsales">판매 중</option>
          <option value="completed">판매 완료</option>
        </select>
      </div>
    </div>

    <!--리스트 -->
    <!--모바일 화면에서 무한 스크롤-->
    <div
      v-if="isMobile"
      ref="scrollContainer"
      @scroll.passive="handleScroll"
      class="overflow-y-scroll h-[50vh] border"
    >
      <ul
        class="w-screen space-y-4 flex flex-col justify-center items-center gap-2"
      >
        <li
          v-for="sales in salesList"
          :key="sales.salesId"
          @click="goDetail(sales.salesId)"
          class="hover:bg-gray-100 p-2 border-gray-300 shadow w-full max-w-md md:max-w-wl lg:max-w-3xl max-auto transition-all duration-200 flex flex-row gap-7 rounded-md"
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
              <h2 class="font-hahmlet">{{ sales.title }}</h2>
            </div>
            <!-- 게시글 가격-->
            <div>
              <p class="font-hahmlet">{{ sales.price }}원</p>
            </div>
          </div>
        </li>
      </ul>
      <!--무한스크롤 로딩중-->
      <div v-if="isLoading.value" class="text-center">
        <i class="fa-solid fa-spinner"></i>
      </div>
    </div>
    <!--페이지네이션-->
    <div v-else class="flex flex-col justify-center items-center">
      <ul
        class="w-screen space-y-4 flex flex-col justify-center items-center gap-2"
      >
        <li
          v-for="sales in salesList"
          :key="sales.salesId"
          @click="goDetail(sales.salesId)"
          class="hover:bg-gray-100 p-2 border-gray-300 shadow w-full max-w-md md:max-w-wl lg:max-w-3xl max-auto transition-all duration-200 flex flex-row gap-7 rounded-md"
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
              <h2 class="font-hahmlet">{{ sales.title }}</h2>
            </div>
            <!-- 게시글 가격-->
            <div>
              <p class="font-hahmlet">{{ sales.price }}원</p>
            </div>
          </div>
        </li>
      </ul>
      <!--페이지네이션 버튼-->
      <div class="mt-3">
        <button
          @click="prePage"
          :disabled="currentPage.value == 1"
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
          :disabled="currentPage == totalPage"
          class="px-3 py-1 rounded-sm border border-grey-300 hover:bg-opacity-90 disabled:opacity-50"
        >
          >
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from "vue";
import { UseTransactionListAPi } from "@/api/userTransaction";

const currentPage = ref(0);
const pageSize = 5;
const totalPage = ref(0);
const { salesListLatest, salesListOnSales, salesListCompletedSales } =
  UseTransactionListAPi();
//const salesList = ref([]);
const selectedCategory = ref("all");
const salesList = ref([]);

//화면 사이즈 지정
const isMobile = ref(window.innerWidth <= 393);
watch(isMobile, async (mobile) => {
  currentPage.value = 0;
  salesList.value = [];
  await fetchPageData();
});

const handleResize = () => {
  isMobile.value = window.innerWidth <= 393;
};
//화면 사이즈 확인
onMounted(() => window.addEventListener("resize", handleResize));
onUnmounted(() => window.removeEventListener("resize", handleResize));

//무한 스크롤
const isLoading = ref(false);
const scrollContainer = ref(null);
const handleScroll = () => {
  console.log("dkssud");
  // if (isLoading.value) return;
  // const el = scrollContainer.value;
  // if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
  //   fetchMoreData();
  const scrollY = window.scrollY || window.pageYOffset;
  const vh = window.innerHeight;
  const fullH = document.documentElement.scrollHeight;
  if (scrollY + vh >= fullH - 10) {
    fetchMoreData();
  }
  // if (isLoading.value) return;
  // const el = scrollContainer.value;
  // // if (!el) return;
  // // if (el.scrollTop > 0) {
  // //   console.log("스크롤 내림! scrollTop:", el.scrollTop);
  // // } else {
  // //   console.log("스크롤 맨 위");
  // // }
  // console.log("handleScroll 확인 ");
  // if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
  //   if (currentPage.value < totalPage.value - 1) {
  //     console.log("currentPage : " + currentPage.value);
  //     currentPage.value++;
  //     fetchPageData();
  //   }
  // }
};

const userId = 1; //임시 로그인 완료되면 지워야 함 아이디 하드코딩
onMounted(() => {
  //await fetchPageData();
  fetchPageData();
});
//나중에 변경
// onMounted(async()=>{
//   const res = await salesListLatest();
//   salesList.value= res.data;
// })

//카테고리
watch(selectedCategory, async () => {
  await fetchPageData();
});

const fetchPageData = async () => {
  isLoading.value = true;
  const fetcher = {
    all: salesListLatest,
    onsales: salesListOnSales,
    completed: salesListCompletedSales,
  }[selectedCategory.value];

  if (!fetcher) return;
  const res = await fetcher(userId, currentPage.value, pageSize);
  // //게시글 목록
  // salesList.value = res.data.data.content;
  // //총 페이지 수
  // totalPage.value = res.data.data.totalPages;
  // isLoading.value = false;
  salesList.value = res.data.data.content;
  totalPage.value = res.data.data.totalPages;
  isLoading.value = false;
};

const fetchMoreData = async () => {
  if (isLoading.value || currentPage.value >= totalPage.value - 1) return;

  currentPage.value++;
  isLoading.value = true;
  const fetcher = {
    all: salesListLatest,
    onsales: salesListOnSales,
    completed: salesListCompletedSales,
  }[selectedCategory.value];

  if (!fetcher) return;
  const res = await fetcher(userId, currentPage.value, pageSize);
  salesList.value = [...salesList.value, ...res.data.data.content];
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
