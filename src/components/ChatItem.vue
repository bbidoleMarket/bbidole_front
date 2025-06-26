<template>
  <div
    class="border w-[90%] lg:w-[70%] p-4 mb-4 bg-[#B0DEDE] rounded-[12px] font-noto shadow cursor-pointer hover:bg-[#319B9A]"
  >
    <div class="flex text-[#2E383A]">
      <!-- 채팅방 제목 표시 -->
      <h2 class="ml-2 text-2xl">{{ chat.productName }}</h2>
      <!-- 상대방 닉네임 표시 -->
      <p class="ml-auto font-bold text-lg lg:text-xl">
        {{ chat.buyerId == chat.othersId ? chat.buyerName : chat.sellerName }}
      </p>
    </div>
    <div class="text-[#2E383A] m-2 ml-6">
      <!-- 마지막 메시지 표시 -->
      <p class="text-base">마지막 메시지 내용</p>
      <!-- 마지막 메시지 시간 표시 -->
      <p class="text-xs">마지막 메시지 시간</p>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  chat: Object,
});
console.log(props.chat.buyerId, props.chat.othersId);
</script>
