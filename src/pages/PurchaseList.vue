<template>
  <!--가장 밖-->
  <div class="flex flex-col justify-start items-center min-h-screen gap-4">
    <!-- 구매 목록-->
    <div>
      <h2 class="font-jua mt-9 text-2xl">구매 목록</h2>
    </div>

    <!--리스트 -->
    <div>
      <ul
        class="w-screen space-y-4 flex flex-col justify-center items-center gap-2"
      >
        <li
          v-for="purchase in purchaseList"
          :key="purchase.purchaseId"
          @click="goDetail(purchase.postId)"
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
    </div>
    <!--페이지네이션-->
    <div>
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
import { ref, onMounted } from "vue";
import { UseTransactionListAPi } from "@/api/userTransaction";
import { useRouter } from "vue-router";

const router = useRouter();

const { purchaseList: fetchPurchaseList } = UseTransactionListAPi();
const purchaseList = ref([]);
const currentPage = ref(0);
const pageSize = 5;
const totalPage = ref(0);

// onMounted(() => {
//   fetchPageData();
// });
//나중에 변경
onMounted(async () => {
  const res = await fetchPageData();
  console.log(res);
  //purchase.value = res.data;
  //await fetchPageData();
});
const fetchPageData = async () => {
  const res = await fetchPurchaseList(currentPage.value, pageSize);
  console.log(res);
  //게시글 목록
  purchaseList.value = res.data.data.content;
  //총 페이지 수
  totalPage.value = res.data.data.totalPages;
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
const goDetail = (id) => router.push(`/post/${id}`);
</script>
