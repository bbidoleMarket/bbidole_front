<template>
    <!-- PC 뷰 -->
    <div v-if="!responsive" class="container mx-auto w-[80%] px-4 py-6 mt-20">
        <div class="mb-6">
            <ProductSearch />
        </div>
        <ProductList />
    </div>

    <!-- 모바일 뷰 -->
    <div v-else class="w-full px-4 py-6 mt-20">
        <div class="mb-4">
            <ProductSearch />
        </div>
        <ProductList />
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useProductsStore } from "../stores/products";
import ProductSearch from "../components/product/ProductSearch.vue";
import ProductList from "../components/product/ProductList.vue";

const store = useProductsStore();

const responsive = ref(false);

onMounted(() => {
    const checkresponsive = () => {
        responsive.value = window.innerWidth <= 768;
    };

    checkresponsive();
    window.addEventListener("resize", checkresponsive);
});
</script>
