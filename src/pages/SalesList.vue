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
      @scroll="handleScroll"
      class="border h-[60vh] overflow-auto"
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
    </div>
    <!--페이지네이션-->
    <div v-if="!isMobile" class="flex flex-col justify-center items-center">
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
          :disabled="currentPage == 0"
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
import { ref, onMounted, watch, onUnmounted, onBeforeUnmount } from "vue";
import { UseTransactionListAPi } from "@/api/userTransaction";
import { useRouter } from "vue-router";

const router = useRouter();
const currentPage = ref(0); //0-base
const pageSize = 5;
const totalPage = ref(0);
const { salesListLatest, salesListOnSales, salesListCompletedSales } =
  UseTransactionListAPi();
const selectedCategory = ref("all");
const salesList = ref([]);
const isLoading = ref(false);
const scrollContainer = ref(null);
const lastPage = ref(false);

//화면 사이즈 지정
const isMobile = ref(window.innerWidth <= 393);
const handleResize = () => {
  isMobile.value = window.innerWidth <= 393;
};
//화면 사이즈 확인
onMounted(() => {
  //console.log("sentinel:", sentinel.value);
  window.addEventListener("resize", handleResize);
});
onUnmounted(() => {
  window.removeEventListener("resize", handleResize), observer?.disconnect();
});

//스크롤 이벤트 발생 시
const handleScroll = () => {
  console.log("dkssud");
  if (isLoading.value) {
    console.log("isloading is true");
    return;
  }

  const el = scrollContainer.value;
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
    //console.log("scroll !!! 걸림 ");
    fetchMoreData();
  }
};

//카테고리 기준으로 올바른 함수반환
function getFetcher() {
  return {
    all: salesListLatest,
    onsales: salesListOnSales,
    completed: salesListCompletedSales,
  }[selectedCategory.value];
}

const fetchPageData = async () => {
  // currentPage.value = selectedPage.value;
  isLoading.value = true;
  const fetcher = getFetcher();
  const res = await fetcher(userId, currentPage.value, pageSize);
  salesList.value = res.data.data.content;
  totalPage.value = res.data.data.totalPages;
  isLoading.value = false;
  console.log("currentPage: ", currentPage.value);
};

const fetchMoreData = async () => {
  //로딩중이거나 마지막 페이지라면 return
  if (isLoading.value || lastPage.value) {
    console.log(
      "isLoading.value ,lastPage.value ",
      isLoading.value,
      " ",
      lastPage.value
    );
    return;
  }
  isLoading.value = true;
  currentPage.value++;
  const fetcher = getFetcher();
  const res = await fetcher(userId, currentPage.value, pageSize);
  salesList.value = [...salesList.value, ...res.data.data.content];
  lastPage.value = res.data.data.last; //마지막 페이지 여부
  isLoading.value = false;
  console.log("서버에서 데이터 받아옴", res);
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
    fetchPageData();
  }
};
const goTopage = (page) => {
  currentPage.value = page - 1;
  fetchPageData();
};

const userId = 1; //임시 로그인 완료되면 지워야 함 아이디 하드코딩
onMounted(() => {
  //초기 데이터 로드
  fetchPageData();
});

//카테고리 변경시 첫페이지 로드 옵저버 토글
watch(selectedCategory, async () => {
  // 1) currentPage, salesList 초기화
  currentPage.value = 0;
  salesList.value = [];
  lastPage.value = 0;
  await fetchPageData();
  //if (isMobile.value) setupObserver();
  //else observer?.disconnect();
});

watch(isMobile, async (mobile) => {
  console.log("isMobile: ", isMobile.value);
  currentPage.value = 0;
  salesList.value = [];
  lastPage.value = 0;
  await fetchPageData();
});

//상세페이지 이동
const goDetail = (id) => router.push(`/postdetail/${id}`);
</script>
