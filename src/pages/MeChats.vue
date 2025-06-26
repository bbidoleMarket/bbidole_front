<template>
  <div
    class="pt-4 flex flex-col items-center justify-start bg-[#FFFFF6] h-[86vh]"
  >
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
      othersId: chat.othersId,
      isCompleted: chat.completed,
    },
  });
};

onMounted(() => {
  getChatList()
    .then((data) => {
      chats.value = data.data.data;
      console.log("채팅 목록:", chats.value);
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
