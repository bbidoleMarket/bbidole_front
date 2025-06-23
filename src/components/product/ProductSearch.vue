<template>
  <div class="relative">
    <input
      type="text"
      v-model="searchQuery"
      @input="handleInput"
      @focus="showSuggestions = true"
      @blur="handleBlur"
      placeholder="상품 검색..."
      class="w-full py-2 px-4 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button
      @click="search"
      class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </button>

    <!-- 검색 제안 -->
    <div
      v-if="showSuggestions && suggestions.length > 0"
      class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg"
    >
      <ul>
        <li
          v-for="suggestion in suggestions"
          :key="suggestion.id"
          @mousedown="selectSuggestion(suggestion)"
          class="px-4 py-2 hover:bg-gray-100 cursor-pointer truncate"
        >
          {{ suggestion.title }}
        </li>
      </ul>
    </div>

    <!-- 로딩 표시 -->
    <div
      v-if="isSearching"
      class="absolute right-10 top-1/2 -translate-y-1/2"
    >
      <div class="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useProductsStore } from '../../stores/products.js';
import debounce from 'debounce';

const router = useRouter();
const store = useProductsStore();

const searchQuery = ref('');
const suggestions = ref([]);
const showSuggestions = ref(false);
const isSearching = ref(false);

// 실시간 검색을 위한 debounce 함수
const debouncedSearch = debounce(async (query) => {
  if (query.trim()) {
    isSearching.value = true;
    suggestions.value = await store.searchProducts(query);
    
    // 실시간 검색 결과 표시를 위해 스토어의 필터 업데이트
    store.setFilter({ 
      keyword: query,
      onlySelling: store.onlySelling 
    });
    
    isSearching.value = false;
  } else {
    suggestions.value = [];
    // 검색어가 비어있을 때 키워드만 초기화하고 onlySelling 상태는 유지
    store.setFilter({
      keyword: '',
      onlySelling: store.onlySelling
    });
  }
}, 300);

// 입력 변경 시 처리
function handleInput() {
  debouncedSearch(searchQuery.value);
}

// 검색 버튼 클릭 또는 엔터 키 처리
function search() {
  if (searchQuery.value.trim()) {
    router.push({
      name: 'search-results',
      query: { keyword: searchQuery.value }
    });
    showSuggestions.value = false;
  }
}

// 검색 제안 선택
function selectSuggestion(suggestion) {
  searchQuery.value = suggestion.title;
  // 검색 결과로 이동 (onlySelling 상태 유지)
  store.setFilter({ 
    keyword: suggestion.title,
    onlySelling: store.onlySelling 
  });
  showSuggestions.value = false;
}


// 포커스 잃을 때 제안 숨기기
function handleBlur() {
  setTimeout(() => {
    showSuggestions.value = false;
  }, 150);
}

// 라우터 변경 시 검색어 업데이트
watch(() => router.currentRoute.value.query.keyword, (newKeyword) => {
  if (newKeyword) {
    searchQuery.value = newKeyword;
    // 라우터 변경 시에도 스토어 필터 업데이트 (onlySelling 상태 유지)
    store.setFilter({ 
      keyword: newKeyword,
      onlySelling: store.onlySelling 
    });
  } else {
    searchQuery.value = '';
    store.resetFilters();
  }
}, { immediate: true });
</script>