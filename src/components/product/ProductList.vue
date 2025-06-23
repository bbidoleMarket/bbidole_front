<template>
  <div>
    <div class="mb-4 flex justify-between items-center">
      <h2 class="text-xl font-bold">상품 목록</h2>
      <div class="flex items-center gap-2">
        <ProductFilter :keyword="store.keyword" :onlySelling="store.onlySelling" @update:filters="updateFilters" />
        <ProductSort @sort-changed="sortProducts" />
      </div>
    </div>

    <div v-if="store.loading && !store.products.length" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <div v-else-if="store.error" class="bg-red-100 p-4 rounded-lg text-red-700">
      {{ store.error }}
    </div>

    <div v-else-if="!store.products.length" class="py-8 text-center text-gray-500">
      검색 결과가 없습니다.
    </div>

    <div v-else>
      <!-- Desktop Grid View -->
  <div class="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    <ProductCard v-for="product in store.products" :key="product.id" :product="product" />
  </div>

      <!-- Mobile List View -->
  <div class="md:hidden space-y-4">
    <ProductCard v-for="product in store.products" :key="product.id" :product="product" />
  </div>

      <!-- 더 이상 상품이 없을 때 메시지 -->
      <div v-if="!store.loading && !store.hasMoreItems && store.products.length > 0"
        class="text-center py-4 text-gray-500">
        모든 상품을 불러왔습니다.
      </div>

      <!-- Desktop Pagination -->
      <div v-if="!isMobile && store.totalItems > 0" class="mt-6 flex justify-center">
        <BasePagination :total-pages="Math.ceil(store.totalItems / 20)" :current-page="currentPage"
          @page-changed="changePage" />
      </div>

      <!-- Back to Top Button (Mobile) -->
      <button v-if="isMobile && showBackToTop" @click="scrollToTop"
        class="fixed bottom-[70px] right-8 bg-blue-600 text-white rounded-full p-3 shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useProductsStore } from '../../stores/products.js';
import ProductCard from './ProductCard.vue';
import ProductFilter from './ProductFilter.vue';
import ProductSort from './ProductSort.vue';
import BasePagination from '../base/BasePagination.vue';

const store = useProductsStore();
const currentPage = ref(0);
const sortOption = ref('latest');
const isMobile = ref(window.innerWidth < 768);
const showBackToTop = ref(false);

// Computed property for sorted products
const displayProducts = computed(() => {
  let sortedProducts = [...store.products];

  if (sortOption.value === 'priceAsc') {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption.value === 'priceDesc') {
    sortedProducts.sort((a, b) => b.price - a.price);
  }
  // 'latest' is the default sort from the API

  return sortedProducts;
});

// 키워드나 필터 변경 시 자동으로 데이터 리로드
watch(
  () => [store.keyword, store.onlySelling],
  () => {
    // 필터 변경 시 첫 페이지로 리셋
    currentPage.value = 0; // 페이지 상태 리셋 추가
    store.currentPage = 0; // store의 페이지 상태도 리셋
    store.fetchProducts(true);
  },
  { deep: true }
);

// 화면 크기 변경 감지
watch(isMobile, (newValue, oldValue) => {
  if (newValue !== oldValue) { // 실제로 변경된 경우에만 실행
    if (newValue) { // 모바일로 변경됨
      setupInfiniteScroll();
    } else { // 데스크톱으로 변경됨
      // 무한 스크롤 해제
      if (observer.value) {
        observer.value.disconnect();
        
        // 로딩 트리거 요소 제거
        if (loadMoreTrigger.value && loadMoreTrigger.value.parentNode) {
          loadMoreTrigger.value.parentNode.removeChild(loadMoreTrigger.value);
        }
      }
      
      // 중요: 데스크톱 모드로 전환 시 데이터 초기화 및 첫 페이지 로드
      currentPage.value = 0;
      store.currentPage = 0;
      store.products = []; // 데이터 초기화
      store.fetchProducts(true); // 첫 페이지만 다시 로드
    }
  }
});

// Load products on component mount
onMounted(() => {
  store.fetchProducts(true);
  window.addEventListener('resize', checkMobile);
  window.addEventListener('scroll', checkScroll);

  // For mobile: setup intersection observer for infinite scroll
  if (isMobile.value) {
    setupInfiniteScroll();
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
  window.removeEventListener('scroll', checkScroll);

  // Clean up intersection observer if it exists
  if (observer.value) {
    observer.value.disconnect();
  }
});

function checkMobile() {
  const wasMobile = isMobile.value;
  isMobile.value = window.innerWidth < 768;
  
}

function checkScroll() {
  showBackToTop.value = window.scrollY > 500;

  // For mobile: implement infinite scroll
  if (isMobile.value && !store.loading && store.hasMoreItems) {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollHeight - scrollTop <= clientHeight + 200) {
      store.fetchProducts();
    }
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

function changePage(page) {
  currentPage.value = page;
  store.currentPage = page;
  store.fetchProducts(true);
  window.scrollTo(0, 0);
}

function updateFilters(filters) {
  // 필터가 변경되면 페이지를 항상 첫 페이지로 리셋
  currentPage.value = 0;
  store.currentPage = 0;
  store.setFilter(filters);
}

function sortProducts(option) {
  sortOption.value = option;
}

// Intersection Observer for infinite scroll
const observer = ref(null);
const loadMoreTrigger = ref(null);

function setupInfiniteScroll() {
  // 이미 observer가 존재하면 제거
  if (observer.value) {
    observer.value.disconnect();
  }
  
  // 이미 트리거 요소가 존재하면 제거
  if (loadMoreTrigger.value && loadMoreTrigger.value.parentNode) {
    loadMoreTrigger.value.parentNode.removeChild(loadMoreTrigger.value);
  }
  
  observer.value = new IntersectionObserver(entries => {
    const entry = entries[0];
    if (entry.isIntersecting && !store.loading && store.hasMoreItems) {
      store.fetchProducts();
    }
  }, { threshold: 0.1 });
  
  // 새 트리거 요소 생성 및 관찰
  const trigger = document.createElement('div');
  trigger.id = 'infinite-scroll-trigger';
  trigger.style.height = '20px';
  document.querySelector('#app').appendChild(trigger);
  loadMoreTrigger.value = trigger;
  observer.value.observe(trigger);
}
</script>