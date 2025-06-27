<template>
  <div class="">
    <div class="max-w-2xl mx-auto overflow-y-auto space-y-6">
      <p class="relative mx-auto py-2 text-center text-3xl font-bold font-jua">
        상세 정보
      </p>
      <UserCard :isMyPage="true" />
    </div>
    <!-- 전체 컨테이너 -->
    <div
      class="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-20"
    >
      <!-- 후기 섹션 -->
      <div>
        <ReviewList :isMyPage="true" />
      </div>

      <!-- 판매 중인 물품 섹션 -->
      <PostList :isMyPage="true" />
    </div>
  </div>
</template>

<script setup>
import UserCard from "@/components/post/UserCard.vue";
import PostList from "@/components/post/PostList.vue";
import ReviewList from "@/components/post/ReviewList.vue";
import { ref, onMounted } from "vue";

onMounted(async () => {
  console.log("MyPage mounted");
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
