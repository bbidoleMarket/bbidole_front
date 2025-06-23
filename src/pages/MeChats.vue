<template>
  <div class="p-4">
    <ChatItem
      v-for="chat in chats"
      :key="chat.id"
      :chat="chat"
      @click="onChatClick(chat)"
    />
  </div>
</template>

<script setup>
import ChatItem from "../components/ChatItem.vue";
import { onMounted } from "vue";
import router from "../router";

const chats = [
  {
    id: "uuid",
    productId: "product1ID",
    productName: "product1",
    sellerId: "seller1ID",
    sellerName: "user1",
    buyerId: "buyer1ID",
    buyerName: "user2",
    isCompleted: false,
  },
  {
    id: "uuid",
    productId: "product2ID",
    productName: "product2",
    sellerId: "seller2ID",
    sellerName: "user2",
    buyerId: "buyer2ID",
    buyerName: "user1",
    isCompleted: false,
  },
];

const onChatClick = (chat) => {
  console.log("채팅방 클릭:", chat);
  // 채팅방 입장 - 페이지 이동(웹소켓 연결)
  router.push({
    path: `/chat/${chat.id}`,
    query: {
      title: chat.productName,
      productId: chat.productId,
      sellerId: chat.sellerId,
      sellerName: chat.sellerName,
      buyerId: chat.buyerId,
      buyerName: chat.buyerName,
      isCompleted: chat.isCompleted,
    },
  });
};

onMounted(() => {
  // 컴포넌트가 마운트될 때 초기화 로직
  console.log("MeChats 컴포넌트가 마운트되었습니다.");
  // 채팅방 목록 가져오는 API 호출
});
</script>
