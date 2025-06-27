<template>
  <div
    class="flex items-center gap-4 border-t py-4 px-2 rounded-xl hover:bg-[#319B9A] cursor-pointer overflow-x-clip"
    @click="
      () => {
        goPostDetail(post.postId);
      }
    "
  >
    <div class="w-16 h-16 rounded-full bg-gray-200 overflow-hidden shrink-0">
      <img
        :src="post.imageUrl || defaultImg"
        alt="product"
        class="object-cover w-full h-full"
      />
    </div>
    <div class="">
      <p class="font-hahmlet font-bold text-gray-900 truncate">
        {{ post.title || "물품 제목" }}
      </p>
      <p class="font-hahmlet text-gray-700">
        가격 : {{ formatPrice(post.price || 0) }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import defaultImg from "@/assets/icon_bbidole.svg";
import { formatPrice } from "@/utils/formatters.js";

const router = useRouter();

defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const goPostDetail = (postId) => {
  router.push(`/post/${postId}`);
};
</script>

<style scoped></style>
