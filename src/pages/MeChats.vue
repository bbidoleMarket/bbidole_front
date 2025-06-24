<template>
  <div class="p-4 w-[70%] justify-center mx-auto">
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
import { onMounted, ref } from "vue";
import { useChatApi } from "../api/chat";
import { useModalStore } from "../stores/modal";
import router from "../router";

const { getChatList } = useChatApi();
const modal = useModalStore();
const chats = ref([]);

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
  getChatList()
    .then((data) => {
      console.log("채팅 목록:", data);
      chats.value = data; // 채팅 목록을 실제 데이터로 업데이트
    })
    .catch((error) => {
      modal.open({
        title: "채팅 목록 가져오기 실패",
        message: "채팅 목록을 가져오는 데 실패했습니다. 다시 시도해주세요.",
      });
      console.error("채팅 목록 가져오기 실패:", error);
    });
});
</script>
