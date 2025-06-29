<template>
  <!--가장 밖-->
  <div class="flex flex-col justify-start items-center min-h-screen gap-4">
    <!--탑센티널-->
    <div ref="topScreen" class="h-px"></div>
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
      class="relative border h-[60vh] overflow-auto"
    >
      <div>
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
      <!-- 센티널: 항상 DOM에 남아 있어야 관찰 가능 -->
      <div ref="scrollObserver" class="w-full h-px"></div>
      <button
        v-show="(showGoTop, isMobile)"
        @click="scrollToTop"
        class="fixed bottom-48 right-4 p-3 bg-[#45A8A6] text-white rounded-full shadow-lg hover:opacity-90"
      >
        ∧
      </button>
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
          :disabled="currentPage == totalPage - 1"
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
const scrollObserver = ref(null);
const lastPage = ref(false);
let observer = null;
const showGoTop = ref(true);
let topObserver = null;
const topScreen = ref(null);

//화면 사이즈 지정
const isMobile = ref(window.innerWidth <= 393);
const handleResize = () => {
  isMobile.value = window.innerWidth <= 393;
};
//마운트
onMounted(async () => {
  await fetchPageData();
  initIntersectionObserver();
  initTopObserver();
  window.addEventListener("resize", handleResize);
});
//언마운트
onUnmounted(() => {
  if (observer) observer.disconnect();
  topObserver.disconnect();
  window.removeEventListener("resize", handleResize), observer?.disconnect();
});
//스크롤 이벤트
const initIntersectionObserver = () => {
  console.log("observer 실행1");
  if (observer) observer.disconnect();
  console.log("observer 실행2");
  if (!scrollObserver.value) return;
  console.log("▶ scrollObserver:", scrollObserver.value);
  console.log("▶ scrollContainer:", scrollContainer.value);
  if (scrollContainer.value) {
    console.log(
      "contains(target)?",
      scrollContainer.value.contains(scrollObserver.value)
    );
  }

  observer = new IntersectionObserver(
    async ([entry]) => {
      console.log("▶ IO callback entries:", entry);
      if (entry.isIntersecting) {
        if (lastPage.value) {
          // 마지막 페이지라면 더 이상 관찰 중지
          observer.disconnect();
          return;
        }
        //콜백 동작 확인
        console.log("observer 실행4");
        observer.unobserve(entry.target);
        await fetchMoreData();
        observer.observe(entry.target);
      }
    },
    {
      root: scrollContainer.value,
      rootMargin: "0px 0px 100px 0px", // (선택) 미리 트리거하고 싶다면 '0px 0px 200px 0px' 처럼
      threshold: 0.3,
    }
  );
  observer.observe(scrollObserver.value);
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
  console.log(res);
  console.log(currentPage.value);
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
  try {
    currentPage.value++;
    const fetcher = getFetcher();
    const res = await fetcher(userId, currentPage.value, pageSize);
    salesList.value = [...salesList.value, ...res.data.data.content];
    totalPage.value = res.data.data.totalPage;
    lastPage.value = res.data.data.last; //마지막 페이지 여부
  } catch (e) {
    console.log("fetchMoreData에러:", e);
  } finally {
    isLoading.value = false;
    console.log("isLoading 해제 됨");
  }
  currentPage.value++;
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

watch(
  isMobile,
  async (mobile) => {
    console.log("isMobile: ", isMobile.value);
    console.log("lastPage: ", lastPage.value);
    // 1) 페이징 상태 초기화
    currentPage.value = 0;
    salesList.value = [];
    lastPage.value = false;

    // 2) 모바일용 데이터 로드
    await fetchPageData();
    if (mobile) {
      // 3) 데이터가 화면에 렌더링된 뒤 옵저버 등록
      initIntersectionObserver();
    } else if (observer) {
      observer.disconnect();
    }
  },
  { flush: "post" }
);

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
//마지막페이지
watch((lastPage) => {
  if (lastPage && observer) observer.disconnect();
});

//상세페이지 이동
const goDetail = (id) => router.push(`/postdetail/${id}`);

//위로가기
const scrollToTop = () => {
  scrollContainer.value.scrollTo({ top: 0, behavior: "smooth" });
};
//위로가기 버튼 이벤트
function initTopObserver() {
  topObserver = new IntersectionObserver(
    ([entry]) => {
      console.log(
        "🔺 TopObserver entry.isIntersecting =",
        entry.isIntersecting
      );
      // entry.isIntersecting === false 면 최상단이 화면 밖 → 버튼 노출
      showGoTop.value = !entry.isIntersecting;
      console.log("🟥 showGoTop =", showGoTop.value);
    },
    {
      root: scrollContainer.value,
      threshold: 0.01,
    }
  );
  topObserver.observe(topScreen.value);
}
</script>
