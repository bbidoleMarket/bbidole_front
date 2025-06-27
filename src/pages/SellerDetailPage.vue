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
        <div class="relative mb-6">
          <!-- 중앙 정렬 제목 -->
          <h2 class="text-3xl font-bold font-jua text-center">후기</h2>

          <!-- 오른쪽 상단 버튼 -->
          <BaseButton
            class="absolute right-0 top-1/2 -translate-y-1/2 text-xs sm:text-sm lg:text-lg lg:px-4 lg:py-2"
          >
            더보기
          </BaseButton>
        </div>

        <div class="space-y-6 overflow-y-auto max-h-80 hidden-scroll-bar">
          <!-- 후기 카드 반복 -->
          <!-- class="flex items-center gap-4 border-t py-4 px-2 rounded-xl
        hover:bg-[#319B9A]" -->
          <div
            v-for="(review, index) in myReviewList"
            :key="review.reviewId"
            class="border-t pt-4 px-2"
          >
            <p class="font-hahmlet font-bold text-gray-400 mb-1">
              {{ review.writerNickname || "작성자" }}
              <span class="text-yellow-400"
                >{{ "★".repeat(review.rating) + "☆".repeat(5 - review.rating) }}
              </span>
            </p>
            <p
              class="text-sm text-gray-900 font-noto leading-relaxed line-clamp-3"
            >
              {{ review.content || "후기 내용이 없습니다." }}
            </p>
          </div>
        </div>
      </div>

      <!-- 판매 중인 물품 섹션 -->
      <div>
        <PostList :postList="myPostList" :title="`판매중인 물품`" />
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseButton from "@/components/base/BaseButton.vue";
import router from "@/router";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { usePostApi, useReviewApi, useUserApi } from "../api/post";
import UserCard from "@/components/post/UserCard.vue";
import PostList from "../components/post/PostList.vue";

const route = useRoute();
const userId = route.params.sellerId;

const { getPostListByPage } = usePostApi();
const { getUserDetail } = useUserApi();
const { getReviewListByPage } = useReviewApi();

const goPostDetail = (postId) => {
  router.push(`/post/${postId}`);
};

const userData = ref(null);
const myPostList = ref([]);
const myReviewList = ref([]);

onMounted(async () => {
  console.log("MyPage mounted");
  // const route = useRoute();
  // const userId = route.params.sellerId;
  const [userRes, postRes, reviewRes] = await Promise.all([
    getUserDetail(userId),
    getPostListByPage(userId),
    getReviewListByPage(userId),
  ]);

  console.log("User Data:", userRes.data);
  console.log("Post List:", postRes.data);
  console.log("Review List:", reviewRes.data);

  userData.value = userRes.data.data;
  myPostList.value.push(...postRes.data.data.content);
  myReviewList.value.push(...reviewRes.data.data.content);
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
