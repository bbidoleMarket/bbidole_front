<template>
  <button
    v-bind="$attrs"
    @click="onClick"
    class="font-jua text-white bg-[#43A8A5] hover:bg-[#319B9A] p-[8px] lg:p-4 rounded-[12px]"
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
