<template>
  <div class="relative">
    <select
      v-model="selectedOption"
      @change="handleChange"
      class="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm leading-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="latest">최신순</option>
      <option value="priceAsc">가격 낮은순</option>
      <option value="priceDesc">가격 높은순</option>
    </select>
    <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
      <svg class="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useProductsStore } from '../../stores/products.js';

const emit = defineEmits(['sort-changed']);
const store = useProductsStore();
const selectedOption = ref('latest');

function handleChange() {
  // 스토어의 정렬 옵션 업데이트 및 데이터 다시 로드
  store.setSortOption(selectedOption.value);
  emit('sort-changed', selectedOption.value);
}

// 컴포넌트 마운트 시 스토어의 현재 정렬 옵션으로 초기화
onMounted(() => {
  selectedOption.value = store.sortOption || 'latest';
});
</script>