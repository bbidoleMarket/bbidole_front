<template>
  <div
    v-if="modal.isOpen"
    class="fixed inset-0 z-50 bg-[#222] bg-opacity-50 flex items-center justify-center"
  >
    <div
      class="font-noto bg-[#77D1CC] rounded-[12px] shadow-md w-[60%] max-w-sm text-center"
    >
      <h2
        class="m-0 text-lg bg-[#FFFCEF] rounded-[12px] text-[#2E383A] font-bold p-4"
      >
        {{ modal.title }}
      </h2>
      <p class="mt-6 text-[#2E383A] p-4">{{ modal.message }}</p>
      <div class="flex justify-center items-center mt-10">
        <BaseButton
          class="flex items-center justify-center h-10 shadow-md mb-4"
          @click="modal.close"
        >
          확인
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useModalStore } from "../../stores/modal";
import BaseButton from "./BaseButton.vue";
const modal = useModalStore();
</script>
