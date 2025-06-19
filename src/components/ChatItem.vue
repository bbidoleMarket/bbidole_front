<template>
  <div
    class="border p-4 mb-4 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-100"
  >
    <h3>{{ chat.title }}</h3>
    <!-- 상대방 닉네임 표시 -->
    <p>{{ chat.seller == myname ? chat.buyer : chat.seller }}</p>
  </div>
</template>
<script setup>
const props = defineProps({
  chat: Object,
});
const myname = "user1"; // 현재 사용자 이름, 실제로는 로그인 정보에서 가져와야 함
</script>
