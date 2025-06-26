<template>
  <div class="flex items-center space-x-2">
    <div class="flex items-center">
      <input
        type="checkbox"
        id="onlySelling"
        v-model="filters.onlySelling"
        @change="updateFilters"
        class="mr-2 h-4 w-4 text-blue-600 rounded"
      />
      <label for="onlySelling" class="text-sm text-gray-700">판매중만 보기</label>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  keyword: {
    type: String,
    default: ''
  },
  onlySelling: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:filters']);

const filters = ref({
  keyword: props.keyword,
  onlySelling: props.onlySelling
});

// props 변경 시 필터 업데이트
watch(() => props.keyword, (newValue) => {
  filters.value.keyword = newValue;
});

watch(() => props.onlySelling, (newValue) => {
  filters.value.onlySelling = newValue;
});

function updateFilters() {
  emit('update:filters', filters.value);
}
</script>