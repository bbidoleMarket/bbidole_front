<template>
  <!--가장 밖-->
  <div class="flex flex-col justify-start items-center mb-2 gap-4">
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
      class="border h-[60vh] overflow-auto"
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
      <div v-if="isLoading" class="text-center">
        <i class="fa-solid fa-spinner"></i>
      </div>
    </div>
    <!--페이지네이션-->
    <div v-if="!isMobile" class="flex flex-col justify-center items-center">
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
import { ref, onMounted, onUnmounted, watch } from "vue";
import { UseTransactionListAPi } from "@/api/userTransaction";

const { purchaseList: fetchPurchaseList } = UseTransactionListAPi();
const purchaseList = ref([]);
const currentPage = ref(0);
const pageSize = 5;
const totalPage = ref(0);
const lastPage = ref(false);

//반응형 화면 감지
const isMobile = ref(window.innerWidth <= 393);
const handleResize = () => {
  isMobile.value = window.innerWidth <= 393;
};
onMounted(() => {
  window.addEventListener("resize", handleResize);
  //scrollContainer.value?.addEventListener("scroll", handleScroll);
});
onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

// watch(isMobile, (newVal, oldVal) => {
//   if (newVal) {
//     console.log("📱 모바일 모드 진입");
//   } else {
//     console.log("💻 데스크탑 모드 진입");
//   }
// });

//화면이 바뀌면 게시글 리스트 처음 부터 불러옴
watch(isMobile, async (mobile) => {
  console.log("isMobile: ", isMobile.value);
  currentPage.value = 0;
  purchaseList.value = [];
  lastPage.value = 0;
  await fetchPageData();
});

//무한 스크롤
const isLoading = ref(false);
const scrollContainer = ref(null);
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

const userId = 3; //임시 로그인 완료되면 지워야 함 아이디 하드코딩
onMounted(() => {
  fetchPageData();
});

const fetchPageData = async () => {
  // currentPage.value = selectedPage.value;
  isLoading.value = true;
  const res = await fetchPurchaseList(userId, currentPage.value, pageSize);
  purchaseList.value = res.data.data.content;
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

  const res = await fetchPurchaseList(userId, currentPage.value, pageSize);
  purchaseList.value = [...purchaseList.value, ...res.data.data.content];
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
