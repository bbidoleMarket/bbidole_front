<template>
  <div>
    <div class="relative mb-6">
      <!-- 중앙 정렬 제목 -->
      <h2 class="text-3xl font-bold font-jua text-center">판매중인 게시글</h2>

      <!-- 오른쪽 상단 버튼 -->
      <BaseButton
        class="absolute right-0 top-1/2 -translate-y-1/2 text-xs sm:text-sm lg:text-lg lg:px-4 lg:py-2 md:hidden block"
        @click="goPostListPage"
      >
        더보기
      </BaseButton>
    </div>

    <div
      @scroll="handleScroll"
      class="space-y-6 md:overflow-y-auto overflow-auto md:max-h-80 hidden-scroll-bar"
    >
      <!-- 물품 카드 반복 -->
      <div v-for="(post, index) in postList" :key="post.postId">
        <PostItem v-if="!isMobile || index < 3" :post="post"></PostItem>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseButton from "@/components/base/BaseButton.vue";
import PostItem from "@/components/post/PostItem.vue";
import { onMounted, ref, onUnmounted } from "vue";
import { usePostApi } from "@/api/post";
import { useRouter } from "vue-router";

const { getPostListByPage, getMyPostListByPage } = usePostApi();
const router = useRouter();

const postList = ref([]);
const curPage = ref(0);
const curSize = ref(20); // 페이지당 아이템 수
const isLast = ref(false); // 마지막 페이지 여부
const totalPages = ref(0); // 전체 페이지 수
const totalElements = ref(0); // 전체 아이템 수

const goPostListPage = () => {
  console.log("Navigating to post list page");
  router.push(`/post-list/${userId}`);
};

const { isMyPage, userId } = defineProps({
  isMyPage: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: String,
    default: "0",
  },
});

const handleScroll = (event) => {
  const { scrollHeight, scrollTop, clientHeight } = event.target;
  // console.log(`scrollHeight: ${scrollHeight}, scrollTop: ${scrollTop}, clientHeight: ${clientHeight}`);
  if (scrollTop + clientHeight >= scrollHeight) {
    console.log("Reached the bottom of the scroll area");
    // 여기에 추가 로딩 로직을 구현할 수 있습니다.
    if (!isLast.value && !isMobile.value) {
      console.log("Loading more posts...");
      fetchPostList(curPage.value + 1);
    } else {
      console.log("No more posts to load.");
    }
  }
};

const fetchPostList = async (page) => {
  console.log("Fetching post list...");
  let res = null;
  if (isMyPage) {
    res = await getMyPostListByPage(page);
  } else {
    res = await getPostListByPage(userId, page);
  }
  const data = res.data.data;
  if (res.data.success) {
    console.log("Post list fetched successfully:", data);
    postList.value.push(...data.content);
    curPage.value = data.pageNumber;
    curSize.value = data.pageSize;
    isLast.value = data.last;
    totalPages.value = data.totalPages;
    totalElements.value = data.totalElements;
  } else {
    console.error("Failed to fetch post list:", res.data.message);
  }
};

onMounted(async () => {
  console.log("PostList mounted");
  window.addEventListener("resize", checkMobile);
  await fetchPostList();
});

onUnmounted(() => {
  console.log("PostList unmounted");
  window.removeEventListener("resize", checkMobile);
});

const isMobile = ref(window.innerWidth < 768);

function checkMobile() {
  const wasMobile = isMobile.value;
  isMobile.value = window.innerWidth < 768;
}
</script>

<style scoped>
.background {
  background-color: #fffff6;
}
.hidden-scroll-bar {
  -ms-overflow-style: none; /* IE/Edge */
  scrollbar-width: none; /* Firefox */
}
.hidden-scroll-bar::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}
</style>
