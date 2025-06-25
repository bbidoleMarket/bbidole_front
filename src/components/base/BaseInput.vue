<template>
  <input
    v-bind="$attrs"
    :class="inputClasses"
    :value="modelValue"
    @input="handleInput"
    @blur="handleBlur"
    @focus="handleFocus"
  />
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'error', 'success'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
});

const emit = defineEmits(["update:modelValue", "input", "blur", "focus"]);

const inputClasses = computed(() => {
  const baseClasses = ['input-default'];
  
  // Size classes
  baseClasses.push(`input-${props.size}`);
  
  // Variant classes
  if (props.variant !== 'default') {
    baseClasses.push(`input-${props.variant}`);
  }
  
  return baseClasses;
});

const handleInput = (event) => {
  emit('update:modelValue', event.target.value);
  emit('input', event);
};

const handleBlur = (event) => {
  emit('blur', event);
};

const handleFocus = (event) => {
  emit('focus', event);
};
</script>
