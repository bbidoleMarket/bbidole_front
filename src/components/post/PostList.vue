<template>
  <div>
    <!-- <h2 class="text-3xl font-bold font-jua text-center mb-6">
        판매중인 물품
      </h2> -->
    <div class="relative mb-6">
      <!-- 중앙 정렬 제목 -->
      <h2 class="text-3xl font-bold font-jua text-center">{{ title }}</h2>

      <!-- 오른쪽 상단 버튼 -->
      <BaseButton
        class="absolute right-0 top-1/2 -translate-y-1/2 text-xs sm:text-sm lg:text-lg lg:px-4 lg:py-2 md:hidden block"
      >
        더보기
      </BaseButton>
    </div>

    <div class="space-y-6 overflow-y-auto max-h-80 hidden-scroll-bar">
      <!-- 물품 카드 반복 -->
      <PostItem
        v-for="post in postList"
        :key="post.postId"
        :post="post"
      ></PostItem>
    </div>
  </div>
</template>

<script setup>
import BaseButton from "@/components/base/BaseButton.vue";
import PostItem from "@/components/post/PostItem.vue";

defineProps({
  title: {
    type: String,
    default: "리스트",
  },
  postList: {
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
