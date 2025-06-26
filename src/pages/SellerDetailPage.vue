<template>
  <div class="">
    <div class="max-w-2xl mx-auto overflow-y-auto space-y-6">
      <p class="relative mx-auto py-2 text-center text-3xl font-bold font-jua">
        상세 정보
      </p>
      <div class="relative w-40 h-40 mx-auto">
        <!-- 프로필 이미지 -->
        <img
          :src="userData?.imageUrl || '@/assets/icon_bbidole.svg'"
          alt="Profile"
          class="w-full h-full object-cover rounded-full border-2 border-gray-200"
        />

        <!-- 별점 배지 -->
        <div
          class="absolute bottom-2 right-2 bg-white px-3 py-1 rounded-full shadow flex items-center space-x-1"
        >
          <svg
            class="w-4 h-4 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.946a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.286 3.946c.3.921-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.175 0l-3.36 2.44c-.784.57-1.838-.197-1.54-1.118l1.287-3.946a1 1 0 00-.364-1.118l-3.36-2.44c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.287-3.946z"
            />
          </svg>
          <span class="text-sm text-gray-700 font-hahmlet font-semibold">{{
            userData?.totalRating || "0.0"
          }}</span>
        </div>
      </div>
      <p
        class="relative w-80 h-12 mx-auto text-center overflow-hidden font-bold font-hahmlet"
      >
        {{ userData?.nickname || "닉네임" }}
      </p>
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
        <!-- <h2 class="text-3xl font-bold font-jua text-center mb-6">
        판매중인 물품
      </h2> -->
        <div class="relative mb-6">
          <!-- 중앙 정렬 제목 -->
          <h2 class="text-3xl font-bold font-jua text-center">판매중인 물품</h2>

          <!-- 오른쪽 상단 버튼 -->
          <BaseButton
            class="absolute right-0 top-1/2 -translate-y-1/2 text-xs sm:text-sm lg:text-lg font-jua text-white bg-[#43A8A5] hover:bg-[#319B9A] px-3 py-1 lg:px-4 lg:py-2 rounded-[12px]"
          >
            더보기
          </BaseButton>
        </div>

        <div class="space-y-6 overflow-y-auto max-h-80 hidden-scroll-bar">
          <!-- 물품 카드 반복 -->
          <div
            v-for="post in myPostList"
            :key="post.postId"
            class="flex items-center gap-4 border-t py-4 px-2 rounded-xl hover:bg-[#319B9A] cursor-pointer overflow-x-clip"
            @click="
              () => {
                goPostDetail(post.postId);
              }
            "
          >
            <div
              class="w-16 h-16 rounded-full bg-gray-200 overflow-hidden shrink-0"
            >
              <img
                :src="post.imageUrl || '@/assets/icon_bbidole.svg'"
                alt="product"
                class="object-cover w-full h-full"
              />
            </div>
            <div class="">
              <p class="font-hahmlet font-bold text-gray-900 truncate">
                {{ post.title || "물품 제목" }}
              </p>
              <p class="font-hahmlet text-gray-700">
                가격 : {{ post.price || 0 }}원
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseButton from "@/components/base/BaseButton.vue";
import router from "@/router";
import { ref, onMounted } from "vue";
import axios from "@/api/axiosInstance";
import { useRoute } from "vue-router";
import { usePostApi, useReviewApi, useUserApi } from "../api/post";
import defaultImage from "@/assets/icon_bbidole.svg";

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
