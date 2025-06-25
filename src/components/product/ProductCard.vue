<template>
  <div class="product-card bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
    <div class="product-image h-48 bg-gray-200 overflow-hidden">
      <img 
        :src="product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'" 
        :alt="product.title"
        class="w-full h-full object-cover"
      />
    </div>
    <div class="product-info p-4">
      <h3 class="product-title text-lg font-semibold truncate">{{ product.title }}</h3>
      <p class="product-price text-lg font-bold text-blue-600">{{ formatPrice(product.price) }}</p>
      <div class="flex justify-between items-center mt-2">
        <span class="text-sm text-gray-500">{{ formatDate(product.createdAt) }}</span>
        <span 
          :class="[
            'text-sm font-semibold px-2 py-1 rounded-full', 
            product.sold ? 'bg-gray-200 text-gray-600' : 'bg-green-100 text-green-600'
          ]"
        >
          {{ product.sold ? '판매완료' : '판매중' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatPrice, formatDate } from '../../utils/formatters.js';

defineProps({
  product: {
    type: Object,
    required: true
  }
});
</script>