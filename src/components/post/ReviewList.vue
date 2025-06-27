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

  <!-- @scroll="handleScroll" -->
  <div
    @scroll="handleScroll"
    class="space-y-6 md:overflow-y-auto overflow-auto md:max-h-80 hidden-scroll-bar"
  >
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

const { getMyReviewListByPage, getReviewListByPage } = useReviewApi();

const reviewList = ref([]);

const handleScroll = (event) => {
  const target = event.target;
  if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
    console.log("Reached the bottom of the scroll area");
    // 여기에 추가 로딩 로직을 구현할 수 있습니다.
  }
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

const fetchReviewList = async () => {
  console.log("Fetching review list...");
  let res = null;
  if (isMyPage) {
    res = await getMyReviewListByPage();
  } else {
    res = await getReviewListByPage(userId);
  }
  if (res.data.success) {
    console.log("Review list fetched successfully:", res.data);
    reviewList.value.push(...res.data.data.content);
  } else {
    console.error("Failed to fetch review list:", res.data.message);
  }
};

onMounted(async () => {
  console.log("ReviewList mounted");
  await fetchReviewList();
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
