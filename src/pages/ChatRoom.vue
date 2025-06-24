<template>
  <div class="flex flex-col h-[80vh] lg:h-[83vh] m-4 lg:mx-60">
    <div
      class="flex items-center justify-center text-[#2E383A] bg-[#EAF9EA] rounded-tl-[12px] rounded-tr-[12px] p-4"
    >
      <h2 class="font-hahmlet text-lg lg:text-3xl lg:ml-10">
        {{ title }}
      </h2>
      <BaseButton
        class="text-black bg-transparent hover:bg-transparent lg:text-2xl lg:mr-10 mr-2 ml-auto"
        >{{ sellerName }}</BaseButton
      >
      <BaseButton
        class="lg:text-xl disabled:bg-gray-300 disabled:text-[#2E383A] disabled:cursor-not-allowed"
        @click="clickSold"
        :disabled="isCompleted"
        >{{ isCompleted ? "판매 완료" : "판매 중" }}</BaseButton
      >
    </div>
    <div
      class="flex flex-1 flex-col bg-[#FFFCEF] shadow-lg overflow-y-auto"
      ref="chatContainer"
    >
      <ChatMessage
        v-for="message in messages"
        :key="message.id"
        :message="message"
      ></ChatMessage>
    </div>
    <form
      @submit.prevent="sendMessage"
      class="flex rounded-bl-[12px] rounded-br-[12px] shadow-lg"
    >
      <BaseInput
        v-model="newMessage"
        placeholder="채팅을 입력하세요."
        class="rounded-tl-none rounded-tr-none rounded-br-none"
      />
      <BaseButton
        class="w-[80px] rounded-tl-none rounded-tr-none rounded-bl-none"
        type="submit"
        >전송</BaseButton
      >
    </form>
  </div>
</template>

<script setup>
import router from "../router";
import { onMounted, watch, ref, nextTick } from "vue";
import { useRoute } from "vue-router";
import BaseButton from "../components/base/BaseButton.vue";
import ChatMessage from "../components/ChatMessage.vue";
import BaseInput from "../components/base/BaseInput.vue";
import { useChatApi } from "../api/chat";
import { useModalStore } from "../stores/modal";

const modal = useModalStore();
const { getChatMessages, setSold } = useChatApi();
const newMessage = ref(""); // 새로운 메시지 입력을 위한 ref
const chatContainer = ref(null); // 채팅 메시지 컨테이너를 참조하기 위한 ref
const route = useRoute();

const chatId = route.params.chatId;
const {
  title,
  productId,
  sellerId,
  sellerName,
  buyerId,
  buyerName,
  isCompleted,
} = route.query;

onMounted(async () => {
  // 채팅방 정보 불러오기
  console.log("채팅방 ID:", chatId);
  console.log("채팅방 제목:", title);

  console.log("상품 ID:", productId);
  console.log("판매자 ID:", sellerId);
  console.log("판매자 이름:", sellerName);
  console.log("구매자 ID:", buyerId);
  console.log("구매자 이름:", buyerName);
  console.log("채팅방 상태:", isCompleted ? "완료" : "진행 중");

  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
  // 채팅 메시지 불러오기
  getChatMessages(chatId)
    .then((data) => {
      console.log("채팅 메시지:", data);
      messages.value = data.data.data; // 채팅 메시지 데이터를 messages에 할당
    })
    .catch((error) => {
      modal.open({
        title: "채팅 메시지 가져오기 실패",
        message: "채팅 메시지를 가져오는 데 실패했습니다. 다시 시도해주세요.",
      });
      console.error("채팅 메시지 가져오기 실패:", error);
    });
});

const sendMessage = () => {
  // 메시지 전송 로직
  // 실제로는 웹소켓을 통해 메시지를 전송하고, 서버에서 응답을 받아야 함
  // 예시로 콘솔에 출력
  messages.push({
    id: `msg${newMessage.length + 1}`,
    sender: "me",
    content: newMessage.value,
    sendAt: new Date().toISOString(),
  });
  newMessage.value = ""; // 메시지 입력 필드 초기화
};

const clickSold = () => {
  // 판매 완료 상태로 변경
  setSold(chatId)
    .then(() => {
      modal.open({
        title: "판매 완료",
        message: "채팅방이 판매 완료 상태로 변경되었습니다.",
      });
    })
    .catch((error) => {
      modal.open({
        title: "판매 완료 실패",
        message:
          "채팅방을 판매 완료 상태로 변경하는 데 실패했습니다. 다시 시도해주세요.",
      });
      console.error("판매 완료 실패:", error);
    });
};

watch(
  messages,
  async () => {
    await nextTick();
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  },
  { deep: true }
);
</script>
