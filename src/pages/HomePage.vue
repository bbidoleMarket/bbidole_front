<template>
    <div class="container mx-auto px-4 py-6">
      <div class="mb-6">
        <ProductSearch />
      </div>
      <ProductList />
    </div>
</template>

<script setup>
import { useProductsStore } from '../stores/products';
import ProductSearch from '../components/product/ProductSearch.vue';
import ProductList from '../components/product/ProductList.vue';

const store = useProductsStore();
</script>