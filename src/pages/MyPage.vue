<template>
  <div class="">
    <div class="max-w-2xl mx-auto overflow-y-auto space-y-6">
      <p class="relative mx-auto py-2 text-center text-3xl font-bold font-jua">
        상세 정보
      </p>
      <UserCard :userData="userData" />
    </div>
    <!-- 전체 컨테이너 -->
    <div
      class="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-20"
    >
      <!-- 후기 섹션 -->
      <div>
        <ReviewList :reviewList="myReviewList" />
      </div>

      <!-- 판매 중인 물품 섹션 -->
      <PostList :postList="myPostList" :title="`판매중인 물품`" />
    </div>
  </div>
</template>

<script setup>
import BaseButton from "@/components/base/BaseButton.vue";
import router from "@/router";
import { ref, onMounted } from "vue";
import { usePostApi, useReviewApi, useUserApi } from "../api/post";
import UserCard from "@/components/post/UserCard.vue";
import PostList from "@/components/post/PostList.vue";
import ReviewList from "@/components/post/ReviewList.vue";

const { getMyPostListByPage } = usePostApi();
const { getMyDetail } = useUserApi();
const { getMyReviewListByPage } = useReviewApi();

const goPostDetail = (postId) => {
  router.push(`/post/${postId}`);
};

const userData = ref(null);
const myPostList = ref([]);
const myReviewList = ref([]);

onMounted(async () => {
  console.log("MyPage mounted");
  const [userRes, postRes, reviewRes] = await Promise.all([
    getMyDetail(),
    getMyPostListByPage(),
    getMyReviewListByPage(),
  ]);

  console.log("User Data:", userRes.data);
  console.log("Post List:", postRes.data);
  console.log("Review List:", reviewRes.data);

  userData.value = userRes.data.data;
  myPostList.value.push(...postRes.data.data.content);
  myReviewList.value.push(...reviewRes.data.data.content);

  // try {
  // } catch (error) {
  //   console.error("Error fetching MyPage data:", error);
  // }
});
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
