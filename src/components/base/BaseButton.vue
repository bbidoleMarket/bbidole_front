<template>
  <button
    v-bind="$attrs"
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="animate-spin mr-2">⏳</span>
    <slot>{{ text || '버튼' }}</slot>
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'success', 'brand'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(["click"]);

const buttonClasses = computed(() => {
  const baseClasses = [`btn-${props.variant}`, `btn-${props.size}`];
  
  if (props.disabled || props.loading) {
    baseClasses.push('opacity-50', 'cursor-not-allowed');
  }
  
  return baseClasses;
});

const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};
</script>
