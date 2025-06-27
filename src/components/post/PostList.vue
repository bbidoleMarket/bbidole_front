<template>
  <div>
    <div class="relative mb-6">
      <!-- 중앙 정렬 제목 -->
      <h2 class="text-3xl font-bold font-jua text-center">판매중인 게시글</h2>

      <!-- 오른쪽 상단 버튼 -->
      <BaseButton
        class="absolute right-0 top-1/2 -translate-y-1/2 text-xs sm:text-sm lg:text-lg lg:px-4 lg:py-2 md:hidden block"
      >
        더보기
      </BaseButton>
    </div>

    <div
      @scroll="handleScroll"
      class="space-y-6 md:overflow-y-auto overflow-auto md:max-h-80 hidden-scroll-bar"
    >
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
import { onMounted, ref } from "vue";
import { usePostApi } from "@/api/post";

const { getPostListByPage, getMyPostListByPage } = usePostApi();

const postList = ref([]);

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
  }
};

const fetchPostList = async () => {
  console.log("Fetching post list...");
  let res = null;
  if (isMyPage) {
    res = await getMyPostListByPage();
  } else {
    res = await getPostListByPage(userId);
  }
  if (res.data.success) {
    console.log("Post list fetched successfully:", res.data.data.content);
    postList.value.push(...res.data.data.content);
  } else {
    console.error("Failed to fetch post list:", res.data.message);
  }
};

onMounted(async () => {
  console.log("PostList mounted");
  await fetchPostList();
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
