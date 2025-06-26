<template>
  <div class="flex flex-col h-[86vh] p-6 lg:px-60 bg-[#FFFFF6]">
    <div
      class="flex items-center justify-center text-[#2E383A] bg-[#EAF9EA] rounded-tl-[12px] rounded-tr-[12px] p-4"
    >
      <h2 class="font-hahmlet text-md lg:text-3xl lg:ml-10">
        {{ title }}
      </h2>
      <BaseButton
        class="text-[#2E383A] bg-transparent hover:bg-transparent text-sm lg:text-2xl lg:mr-10 mr-2 ml-auto"
        :black="true"
        >{{ displayName }}</BaseButton
      >
      <BaseButton
        class="text-sm lg:text-xl disabled:bg-gray-300 disabled:text-[#2E383A] disabled:cursor-not-allowed"
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
        :othersId="othersId"
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
import { onMounted, onUnmounted, watch, ref, nextTick, computed } from "vue";
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
const messages = ref([]); // 채팅 메시지를 저장할 배열
const route = useRoute();
let socket = null; // 웹소켓 변수

const chatId = route.params.chatId;
const {
  title,
  productId,
  sellerId,
  sellerName,
  buyerId,
  buyerName,
  othersId, // 상대방 ID (구매자 또는 판매자)
  isCompleted,
} = route.query;

onMounted(async () => {
  // 채팅방 정보 불러오기
  console.log("채팅방 ID:", chatId);
  console.log("채팅방 제목:", title);

  console.log("상품 ID:", productId);
  console.log("판매자 ID:", sellerId, typeof sellerId);
  console.log("판매자 이름:", sellerName);
  console.log("구매자 ID:", buyerId);
  console.log("구매자 이름:", buyerName);
  console.log("채팅방 상태:", isCompleted ? "완료" : "진행 중");
  console.log("상대방 ID:", othersId, typeof othersId);

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

  // 웹소켓 연결 설정
  socket = new WebSocket(`ws://localhost:8080/ws/chat?chatId=${chatId}`);

  socket.onopen = () => {
    console.log("웹소켓 연결 성공");
  };

  socket.onmessage = (event) => {
    // 서버에서 새 메시지를 받으면 messages에 추가
    const msg = JSON.parse(event.data);
    messages.value.push(msg);
  };

  socket.onclose = () => {
    console.log("웹소켓 연결 종료");
  };

  socket.onerror = (err) => {
    console.error("웹소켓 에러:", err);
  };
});

onUnmounted(() => {
  if (socket) {
    socket.close();
    socket = null;
  }
});

const displayName =
  sellerId === othersId ? "판매자: " + sellerName : "구매자: " + buyerName;
const sendMessage = () => {
  if (!newMessage.value.trim()) return; // 빈 메시지 전송 방지
  const message = {
    chatId: chatId,
    senderId: sellerId === othersId ? buyerId : sellerId, // 현재 사용자 ID 설정
    content: newMessage.value,
    sendAt: new Date().toISOString(),
  };
  // 웹소켓을 통해 메시지 전송
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  } else {
    modal.open({
      title: "메시지 전송 실패",
      message: "웹소켓이 연결되어 있지 않습니다. 다시 시도해주세요.",
    });
    return;
  }
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
