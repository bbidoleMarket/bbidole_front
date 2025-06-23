<template>
  <input
    v-bind="$attrs"
    :class="[
      'border rounded-[12px] p-2 w-full',
      $attrs.class,
      'placeholder:text-gray-500',
    ]"
    :value="modelValue"
    @input="
      $emit('update:modelValue', $event.target.value);
      $emit('input', $event);
    "
    :placeholder="$attrs.placeholder || '기본 입력'"
    :type="$attrs.type || 'text'"
  />
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["update:modelValue", "input"]);
</script>
