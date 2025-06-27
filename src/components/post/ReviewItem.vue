<template>
  <div class="border-t pt-4 px-2">
    <p class="font-hahmlet font-bold text-gray-400 mb-1">
      {{ review.writerNickname || "작성자" }}
      <span class="text-yellow-400"
        >{{ "★".repeat(review.rating) + "☆".repeat(5 - review.rating) }}
      </span>
    </p>
    <p class="text-sm text-gray-900 font-noto leading-relaxed line-clamp-3">
      {{ review.content || "후기 내용이 없습니다." }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  review: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped></style>
