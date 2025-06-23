import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getPostList, searchPosts } from '../api/postapi';

export const useProductsStore = defineStore('products', () => {
  const products = ref([]);
  const totalItems = ref(0);
  const loading = ref(false);
  const error = ref(null);
  const currentPage = ref(0);
  const itemsPerPage = ref(20);
  const keyword = ref('');
  const onlySelling = ref(true);
  const sortOption = ref('latest');

  const hasMoreItems = computed(() => {
    return products.value.length < totalItems.value;
  });

  async function fetchProducts(resetPage = false) {
    loading.value = true;
    error.value = null;
    
    try {
      console.log('API 요청 정보:', { 
        페이지: currentPage.value,
        키워드: keyword.value,
        판매중필터: onlySelling.value,
        정렬: sortOption.value // 로그에 정렬 옵션 추가
      });
      
      const response = await getPostList({
        keyword: keyword.value,
        onlySelling: onlySelling.value,
        page: currentPage.value,
        size: itemsPerPage.value,
        sort: sortOption.value // 정렬 옵션 전달
      });
      
      if (response.success && response.data) {
        products.value = response.data.content || [];
        totalItems.value = response.data.totalElements || 0;
        
        if (!resetPage) {
          currentPage.value += 1;
        }
      } else {
        throw new Error(response.message || '데이터를 불러오는데 실패했습니다');
      }
    } catch (err) {
      console.error('데이터 가져오기 오류:', err);
      error.value = err.message || '상품을 불러오는데 실패했습니다';
    } finally {
      loading.value = false;
    }
  }

    function setSortOption(option) {
    sortOption.value = option;
    
    fetchProducts(true);
  }

  async function searchProducts(searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
      return [];
    }

    try {
      const response = await searchPosts({
        keyword: searchTerm,
        onlySelling: onlySelling.value,
        page: 0,
        size: 10
      });

      if (response.success && response.data) {
        return response.data.content || [];
      }
      return [];
    } catch (err) {
      error.value = err.message || '검색에 실패했습니다';
      return [];
    }
  }


  function setFilter(filters) {
    if ('keyword' in filters) keyword.value = filters.keyword;
    if ('onlySelling' in filters) onlySelling.value = filters.onlySelling;

    // 새 필터로 재검색
    fetchProducts(true);
  }

  function resetFilters(keepSellingState = false) {
    keyword.value = '';
    if (!keepSellingState) {
      onlySelling.value = true;
    }
    fetchProducts(true);
  }

  return {
    products,
    totalItems,
    loading,
    error,
    currentPage,
    hasMoreItems,
    keyword,
    onlySelling,
    sortOption,
    fetchProducts,
    searchProducts,
    setFilter,
    resetFilters,
    setSortOption
  };
});