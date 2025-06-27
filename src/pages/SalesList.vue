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

    <div v-show="isMobile">
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
      <!--관찰 대상 엘리먼트 -->
      <div ref="sentinel" v-show="isMobile" class="h-1"></div>
      <!-- 로딩 / 끝 안내 -->
      <div v-if="isLoading" class="text-center mt-4">로딩중..</div>

      <div v-if="allLoaded" class="text-center mt-4">
        더이상 불러올 항목이 없습니다.
      </div>
      <!--무한스크롤 로딩중-->
      <!-- <div v-if="isLoading.value" class="text-center">
        <i class="fa-solid fa-spinner"></i>
      </div> -->
    </div>
    <!--페이지네이션-->
    <div v-show="!isMobile" class="flex flex-col justify-center items-center">
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
          @click="goTopage(currentPage - 1)"
          :disabled="currentPage == 0 || isLoading"
          class="px-3 py-1 rounded-sm border border-grey-300 hover:bg-opacity-90 disabled:opacity-50"
        >
          <
        </button>
        <button
          v-for="page in totalPage"
          :key="page"
          @click="goTopage(page - 1)"
          :class="[
            'p-3 py-1 rounded-border',
            currentPage + 1 === page
              ? 'bg-[#45A8A6] text-white'
              : 'bg-gray-300 hover:bg-gray-200',
          ]"
        >
          {{ page }}
        </button>
        <button
          @click="goTopage(currentPage + 1)"
          :disabled="currentPage >= totalPage - 1 || isLoading"
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
const allLoaded = ref(false);
const sentinel = ref(null);
const isLoading = ref(false);
//const scrollContainer = ref(null);

//화면 사이즈 지정
const isMobile = ref(window.innerWidth <= 393);
const handleResize = () => {
  isMobile.value = window.innerWidth <= 393;
};
//화면 사이즈 확인
onMounted(() => {
  console.log("sentinel:", sentinel.value);
  window.addEventListener("resize", handleResize);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize), observer?.disconnect();
});
//onUnmounted(() => window.removeEventListener("resize", handleResize));

//카테고리 기준으로 올바른 함수반환
function getFetcher() {
  return {
    all: salesListLatest,
    onsales: salesListOnSales,
    completed: salesListCompletedSales,
  }[selectedCategory.value];
}

//0-based pageIndex 로 데이터를 교체
const fetchPageData = async (pageIndex = 0) => {
  isLoading.value = true;
  const fetcher = getFetcher();
  const res = await fetcher(userId, pageIndex, pageSize);

  // //게시글 목록
  // salesList.value = res.data.data.content;
  // //총 페이지 수
  // totalPage.value = res.data.data.totalPages;
  // isLoading.value = false;
  salesList.value = res.data.data.content;
  totalPage.value = res.data.data.totalPages;
  currentPage.value = pageIndex;
  allLoaded.value = pageIndex >= totalPage.value - 1;
  isLoading.value = false;
};

//다음페이지 이어붙이는 무한스크롤 전용 함수
const fetchMoreData = async () => {
  console.log("무한~~");
  if (isLoading.value || allLoaded.value) return;

  const next = currentPage.value + 1;
  if (next >= totalPage.value) {
    allLoaded.value = true;
    return;
  }

  isLoading.value = true;
  const fetcher = getFetcher();
  const res = await fetcher(userId, next, pageSize);
  salesList.value.push(...res.data.data.content);
  currentPage.value = next;
  allLoaded.value = currentPage.value >= totalPage.value - 1;
  isLoading.value = false;
};

const goTopage = (pageIndex) => {
  if (pageIndex < 0 || pageIndex >= totalPage.value || isLoading.value) return;
  fetchPageData(pageIndex);
};

//IntersectionObserver 셋업/해제
let observer = null;
function setupObserver() {
  if (!("IntersectionObserver" in window) || !sentinel.value) return;
  observer?.disconnect();
  observer = new IntersectionObserver(
    (entries) => {
      console.log("🔍 sentinel 관찰 콜백", entries);
      if (entries[0].isIntersecting) {
        console.log("↪️ sentinel 진입! fetchMoreData 호출");
        fetchMoreData();
      }
    },
    { root: null, rootMargin: "0px", threshold: 0.5 }
  );
  observer.observe(sentinel.value);
}
//나중에 변경
// onMounted(async()=>{
//   const res = await salesListLatest();
//   salesList.value= res.data;
// })

const userId = 1; //임시 로그인 완료되면 지워야 함 아이디 하드코딩
onMounted(async () => {
  //초기 데이터 로드
  await fetchPageData(0);
  // 모바일 화면에서만 IntersectionObserver 활성화
  if (isMobile.value) {
    setupObserver();
  }
});

//카테고리 변경시 첫페이지 로드 옵저버 토글
watch(selectedCategory, async () => {
  // 1) currentPage, salesList 초기화
  await fetchPageData(0);
  if (isMobile.value) setupObserver();
  else observer?.disconnect();
});

watch(isMobile, (mobile) => {
  if (mobile) {
    setupObserver();
    console.log("📱 모바일 모드 진입");
  } else {
    observer?.disconnect();
    // await fetchPageData(currentPage.value);
    console.log("💻 데스크탑 모드 진입");
  }
});

// const prePage = () => {
//   if (currentPage.value > 0) {
//     currentPage.value--;
//     fetchPageData();
//   }
// };
// const nextPage = () => {
//   if (currentPage.value < totalPage.value - 1) {
//     currentPage.value++;
//     console.log("currentPage : " + currentPage.value);
//     console.log("TPage : " + totalPage.value);
//     fetchPageData();
//   }
// };
// const goTopage = (pageIndex) => {
//   if (pageIndex < 0 || pageIndex >= totalPage.value || isLoading.value) return;
//   fetchPageData(pageIndex);
// };
//상세페이지 이동
const goDetail = (id) => router.push(`/postdetail/${id}`);
</script>
