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
      <BaseButton class="lg:text-xl">{{
        isCompleted ? "판매 완료" : "판매 중"
      }}</BaseButton>
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
import { reactive } from "vue";
import { useRoute } from "vue-router";
import BaseButton from "../components/base/BaseButton.vue";
import ChatMessage from "../components/ChatMessage.vue";
import BaseInput from "../components/base/BaseInput.vue";
const newMessage = ref(""); // 새로운 메시지 입력을 위한 ref
const chatContainer = ref(null); // 채팅 메시지 컨테이너를 참조하기 위한 ref
const route = useRoute();
const messages = reactive([
  {
    id: "msg1",
    sender: "me",
    content: "안녕하세요! 상품에 대해 문의드려요.",
    sendAt: new Date().toISOString(),
  },
  {
    id: "msg2",
    sender: "other",
    content: "안녕하세요! 어떤 부분이 궁금하신가요?",
    sendAt: new Date().toISOString(),
  },
  {
    id: "msg3",
    sender: "me",
    content: "상품 상태와 가격을 알고 싶어요.",
    sendAt: new Date().toISOString(),
  },
  {
    id: "msg4",
    sender: "other",
    content: "상품은 새것이고 가격은 10,000원입니다.",
    sendAt: new Date().toISOString(),
  },
  {
    id: "msg5",
    sender: "me",
    content: "좋아요! 구매하고 싶어요.",
    sendAt: new Date().toISOString(),
  },
  {
    id: "msg6",
    sender: "other",
    content: "감사합니다! 거래를 진행하겠습니다.",
    sendAt: new Date().toISOString(),
  },
  {
    id: "msg7",
    sender: "me",
    content: "거래 완료 후 리뷰 남길게요!",
    sendAt: new Date().toISOString(),
  },
  {
    id: "msg8",
    sender: "other",
    content: "네, 감사합니다! 리뷰 기다릴게요.",
    sendAt: new Date().toISOString(),
  },
  {
    id: "msg9",
    sender: "me",
    content:
      "거래 완료 후 리뷰 남길게요!거래 완료 후 리뷰 남길게요!거래 완료 후 리뷰 남길게요!거래 완료 후 리뷰 남길게요!거래 완료 후 리뷰 남길게요!거래 완료 후 리뷰 남길게요!거래 완료 후 리뷰 남길게요!",
    sendAt: new Date().toISOString(),
  },
  {
    id: "msg10",
    sender: "other",
    content:
      "네, 감사합니다! 리뷰 기다릴게요.네, 감사합니다! 리뷰 기다릴게요.네, 감사합니다! 리뷰 기다릴게요.네, 감사합니다! 리뷰 기다릴게요.네, 감사합니다! 리뷰 기다릴게요.네, 감사합니다! 리뷰 기다릴게요.네, 감사합니다! 리뷰 기다릴게요.네, 감사합니다! 리뷰 기다릴게요.",
    sendAt: new Date().toISOString(),
  },
  {
    id: "msg11",
    sender: "me",
    content: "거래 완료 후 리뷰 남길게요!거래 완료 후 리뷰 남길게요!",
    sendAt: new Date().toISOString(),
  },
  {
    id: "msg12",
    sender: "other",
    content: "네, 감사합니다! 리뷰 기다릴게요!",
    sendAt: new Date().toISOString(),
  },
  {
    id: "msg13",
    sender: "me",
    content: "거래 완료 후 리뷰 남길게요!거래 완료 후 리뷰 남길게요!",
    sendAt: new Date().toISOString(),
  },
  {
    id: "msg14",
    sender: "other",
    content: "네, 감사합니다! 리뷰 기다릴게요!",
    sendAt: new Date().toISOString(),
  },
  {
    id: "msg15",
    sender: "me",
    content: "거래 완료 후 리뷰 남길게요!거래 완료 후 리뷰 남길게요!",
    sendAt: new Date().toISOString(),
  },
  {
    id: "msg16",
    sender: "other",
    content: "네, 감사합니다! 리뷰 기다릴게요!",
    sendAt: new Date().toISOString(),
  },
  {
    id: "msg17",
    sender: "me",
    content: "거래 완!",
    sendAt: new Date().toISOString(),
  },
]);
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
