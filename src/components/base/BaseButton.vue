<template>
  <button
    v-bind="$attrs"
    @click="onClick"
    class="text-white bg-[#43A8A5] hover:bg-[#319B9A] font-bold p-4 rounded-[12px]"
  >
    <slot>기본 버튼</slot>
  </button>
</template>

<script setup>
const emit = defineEmits(["click"]);
const onClick = (event) => {
  emit("click", event);
};
</script>
