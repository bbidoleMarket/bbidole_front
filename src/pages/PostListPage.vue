<template>
  <div class="relative mb-6 w-[80%] mx-auto">
    <!-- 중앙 정렬 제목 -->
    <h2 class="text-3xl font-bold font-jua text-center mt-10 mb-5">
      판매중인 개시글
    </h2>

    <div class="space-y-6 overflow-y-auto" @scroll="handleScroll">
      <!-- 후기 카드 반복 -->
      <div v-for="post in postList" :key="post.postId">
        <PostItem :post="post"></PostItem>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { usePostApi } from "@/api/post";
import { useRoute } from "vue-router";
import PostItem from "@/components/post/PostItem.vue";

const { getMyPostListByPage, getPostListByPage } = usePostApi();
const route = useRoute();
const userId = route.params.userId || "0"; // userId가 없을 경우 기본값 설정

const postList = ref([]);
const curPage = ref(0);
const curSize = ref(20); // 페이지당 아이템 수
const isLast = ref(false); // 마지막 페이지 여부
const totalPages = ref(0); // 전체 페이지 수
const totalElements = ref(0); // 전체 아이템 수

const handleScroll = () => {
  // 예시: 바닥 감지
  if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 1) {
    console.log("페이지 맨 아래!");
    // 무한 스크롤 fetch 등 로직 작성
    if (!isLast.value) {
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
  if (!userId || userId === "0") {
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

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  fetchPostList(0);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped></style>
