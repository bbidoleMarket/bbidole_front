<template>
  <router-link
    to="/write"
    class="fixed z-40 transition-all duration-300"
    :class="[
      isMobile
        ? showBackToTop
          ? 'bottom-[125px] right-[10px]'
          : 'bottom-[70px] right-[10px]'
        : 'bottom-[70px] right-[10px]',
    ]"
  >
    <div
      class="bg-[rgb(67,168,165)] hover:bg-[rgb(57,148,145)] text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
      :class="[isMobile ? 'p-3' : 'px-4 py-3']"
    >
      <!-- 여기가 문제: isMobileVal 대신 isMobile 사용 -->
      <span v-if="!isMobile" class="font-medium mr-1">글쓰기</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 4v16m8-8H4"
        />
      </svg>
    </div>
  </router-link>
</template>

<script setup>
import { ref, watch } from "vue";

// Props로 받기
const props = defineProps({
  showBackToTop: {
    type: Boolean,
    default: false,
  },
  isMobile: {
    type: Boolean,
    default: false,
  },
});

// 내부 상태 변수는 제거하고 props 직접 사용
</script>
