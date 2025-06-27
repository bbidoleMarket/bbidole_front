<template>
  <div class="relative mb-6">
    <!-- 중앙 정렬 제목 -->
    <h2 class="text-3xl font-bold font-jua text-center">후기</h2>

    <!-- 오른쪽 상단 버튼 -->
    <BaseButton
      class="absolute right-0 top-1/2 -translate-y-1/2 text-xs sm:text-sm lg:text-lg lg:px-4 lg:py-2 md:hidden block"
    >
      더보기
    </BaseButton>
  </div>

  <div class="space-y-6 overflow-y-auto max-h-80 hidden-scroll-bar">
    <!-- 후기 카드 반복 -->
    <!-- class="flex items-center gap-4 border-t py-4 px-2 rounded-xl
        hover:bg-[#319B9A]" -->
    <ReviewItem
      v-for="review in reviewList"
      :key="review.reviewId"
      :review="review"
    />
  </div>
</template>

<script setup>
import BaseButton from "@/components/base/BaseButton.vue";
import ReviewItem from "@/components/post/ReviewItem.vue";
import { ref, onMounted } from "vue";
import { useReviewApi } from "@/api/post";

const { getMyReviewListByPage } = useReviewApi();

const userData = ref(null);
const myPostList = ref([]);
const myReviewList = ref([]);

onMounted(async () => {
  const reviewRes = await getMyReviewListByPage();
  console.log("Review List:", reviewRes.data);
  myReviewList.value.push(...reviewRes.data.data.content);

  // try {
  // } catch (error) {
  //   console.error("Error fetching MyPage data:", error);
  // }
});

defineProps({
  reviewList: {
    type: Array,
    required: true,
  },
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
