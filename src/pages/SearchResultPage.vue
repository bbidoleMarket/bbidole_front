<template>
  <BaseLayout>
    <div class="container mx-auto px-4 py-6">
      <div class="mb-6">
        <ProductSearch />
      </div>
      <div v-if="keyword" class="mb-4">
        <h1 class="text-xl font-bold">
          "{{ keyword }}" 검색 결과
        </h1>
      </div>
      <ProductList />
    </div>
  </BaseLayout>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProductsStore } from '../stores/products';
import BaseLayout from '../layouts/BaseLayout.vue';
import ProductSearch from '../components/product/ProductSearch.vue';
import ProductList from '../components/product/ProductList.vue';

const route = useRoute();
const store = useProductsStore();

const keyword = computed(() => route.query.keyword || '');

onMounted(() => {
  if (keyword.value) {
    store.setFilter({ keyword: keyword.value });
  }
});
</script>