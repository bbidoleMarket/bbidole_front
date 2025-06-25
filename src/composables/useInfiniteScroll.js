import { ref, onMounted } from 'vue';

export function useInfiniteScroll(fetchData, options = {}) {
  const loading = ref(false);
  const hasMore = ref(true);
  const page = ref(1);

  const loadMore = async () => {
    if (loading.value || !hasMore.value) return;

    loading.value = true;

    try {
      const data = await fetchData(page.value, options);
      if (data.length === 0) {
        hasMore.value = false;
      } else {
        page.value++;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    loadMore();
  });

  return {
    loading,
    hasMore,
    loadMore,
  };
}