<template>
  <div class="flex items-center justify-center space-x-1">
    <button
      @click="goToPage(currentPage - 1)"
      :disabled="currentPage === 0"
      class="px-3 py-1 rounded-md border"
      :class="currentPage === 0 ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300 hover:bg-gray-100'"
    >
      이전
    </button>
    
    <button
      v-for="page in displayedPages"
      :key="page"
      @click="goToPage(page)"
      class="px-3 py-1 rounded-md border"
      :class="page === currentPage ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300 hover:bg-gray-100'"
    >
      {{ page + 1 }}
    </button>
    
    <button
      @click="goToPage(currentPage + 1)"
      :disabled="currentPage === totalPages - 1"
      class="px-3 py-1 rounded-md border"
      :class="currentPage === totalPages - 1 ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300 hover:bg-gray-100'"
    >
      다음
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  totalPages: {
    type: Number,
    required: true
  },
  currentPage: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['page-changed']);

// 페이지 번호 계산 (최대 5개만 표시)
const displayedPages = computed(() => {
  const pages = [];
  const totalPages = props.totalPages;
  const current = props.currentPage;
  
  let start = Math.max(0, current - 2);
  let end = Math.min(totalPages - 1, start + 4);
  
  // 마지막 페이지에 가까워지면 시작점 조정
  if (end - start < 4) {
    start = Math.max(0, end - 4);
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
});

// 페이지 이동
function goToPage(page) {
  if (page >= 0 && page < props.totalPages) {
    emit('page-changed', page);
  }
}
</script>