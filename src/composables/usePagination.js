import { ref } from 'vue';

export function usePagination(totalItems, itemsPerPage) {
  const currentPage = ref(1);
  const totalPages = ref(Math.ceil(totalItems.value / itemsPerPage));

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  };

  const previousPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };

  const setPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };

  return {
    currentPage,
    totalPages,
    nextPage,
    previousPage,
    setPage,
  };
}