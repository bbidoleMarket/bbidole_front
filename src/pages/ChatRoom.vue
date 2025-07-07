<template>
    <div class="flex flex-col h-[86vh] p-6 xl:px-60 bg-[#FFFFF6]">
        <div
            class="flex items-center justify-center text-[#2E383A] bg-[#EAF9EA] rounded-tl-[12px] rounded-tr-[12px] p-4"
        >
            <BaseButton
                class="!font-hahmlet text-md lg:text-3xl lg:ml-10 bg-transparent hover:bg-transparent"
                :black="true"
                @click="goPost(productId)"
            >
                {{ title }}
            </BaseButton>
            <BaseButton
                class="text-[#2E383A] bg-transparent hover:bg-transparent text-sm lg:text-2xl lg:mr-4 mr-2 ml-auto"
                :black="true"
                @click="goSeller(sellerId === othersId ? sellerId : buyerId)"
                >{{ displayName }}</BaseButton
            >
            <BaseButton
                class="flex items-center justify-center text-sm lg:text-xl bg-red-400 hover:bg-red-600 active:bg-red-400 mr-4"
                @click="clickReport"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4 h-4 text-white mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                </svg>
                신고</BaseButton
            >
            <BaseButton
                v-if="isBuyer"
                :disabled="isReviewed"
                class="mr-2 text-sm lg:text-xl disabled:bg-gray-300 disabled:text-[#2E383A] disabled:cursor-not-allowed"
                @click="goReview"
                >리뷰 작성하기
            </BaseButton>

            <BaseButton
                class="text-sm lg:text-xl disabled:bg-gray-300 disabled:text-[#2E383A] disabled:cursor-not-allowed"
                @click="clickSold"
                :disabled="isCompleted || othersId === sellerId"
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
                :disabled="isRestricted"
                :placeholder="
                    isRestricted
                        ? '이 사용자는 현재 활동이 중단되었습니다.'
                        : '채팅을 입력하세요.'
                "
                :class="[
                    'rounded-tl-none rounded-tr-none rounded-br-none',
                    isRestricted
                        ? 'bg-gray-300 placeholder-custom'
                        : 'bg-white hover:bg-gray-100 placeholder-gray',
                ]"
            />
            <BaseButton
                class="w-[80px] rounded-tl-none rounded-tr-none rounded-bl-none disabled:bg-gray-300 disabled:text-[#2E383A] disabled:cursor-not-allowed"
                :disabled="isRestricted"
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
import { useUserApi } from "../api/post";

const modal = useModalStore();
const { getChatMessages, setSold } = useChatApi();
const { getUserDetail } = useUserApi();
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
} = route.query;
const isCompleted = ref(route.query.isCompleted === "true");
const isBuyer = ref(route.query.isBuyer === "true"); // 현재 사용자가 구매자인지 여부
const isReviewed = ref(route.query.isReviewed === "true"); // 리뷰 작성 완료 여부
const isRestricted = ref(false);

onMounted(async () => {
    // 채팅방 정보 불러오기
    console.log("채팅방 ID:", chatId);
    console.log("채팅방 제목:", title);

    console.log("상품 ID:", productId);
    console.log("판매자 ID:", sellerId, typeof sellerId);
    console.log("판매자 이름:", sellerName);
    console.log("구매자 ID:", buyerId);
    console.log("구매자 이름:", buyerName);
    console.log(
        "채팅방 상태:",
        isCompleted,
        isCompleted === "true" ? "완료" : "진행 중"
    );
    console.log("상대방 ID:", othersId, typeof othersId);
    console.log("구매를 한 사람인지: ", isBuyer);
    console.log("review button", isCompleted && isBuyer);

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
                message:
                    "채팅 메시지를 가져오는 데 실패했습니다. 다시 시도해주세요.",
            });
            console.error("채팅 메시지 가져오기 실패:", error);
        });

    if (!isBuyer.value) {
        getUserDetail(sellerId)
            .then((data) => {
                console.log("판매자 정보:", data);
                isRestricted.value = !data.data.data.isActive; // 판매자 제한 여부
            })
            .catch((error) => {
                console.error("판매자 정보 가져오기 실패:", error);
            });
    } else {
        getUserDetail(buyerId)
            .then((data) => {
                console.log("구매자 정보:", data);
                isRestricted.value = !data.data.data.isActive; // 구매자 제한 여부
            })
            .catch((error) => {
                console.error("구매자 정보 가져오기 실패:", error);
            });
    }

    // 웹소켓 연결 설정
    socket = new WebSocket(`ws://35.209.18.197:8080/ws/chat?chatId=${chatId}`);
    // socket = new WebSocket(`ws://localhost:8080/ws/chat?chatId=${chatId}`);

    socket.onopen = () => {
        console.log("웹소켓 연결 성공");
    };

    socket.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        const type = parsedData.type || "message";
        if (type === "sold") {
            isCompleted.value = true; // 판매 완료 상태로 변경
            if (othersId === sellerId) {
                isBuyer.value = true; // 현재 사용자가 구매자임을 설정
            }
        } else if (type === "message") {
            // 메시지 타입인 경우
            messages.value.push(parsedData); // 서버에서 받은 메시지를 messages에 추가
        }
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

const clickSold = async () => {
    // 판매 완료 상태로 변경
    await setSold(chatId)
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
                    error.response.data.message ||
                    "채팅방을 판매 완료 상태로 변경하는 데 실패했습니다. 다시 시도해주세요.",
            });
            console.error("판매 완료 실패:", error);
        });
};

const goReview = () => {
    // 리뷰 작성 페이지로 이동
    router.push({
        path: "/review/write",
        query: {
            sellerId: sellerId,
            buyerId: buyerId,
            chatId: chatId,
        },
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

const clickReport = () => {
    // 채팅방 신고 페이지로 이동
    router.push(`/report/chat_room/${chatId}`);
};

const goSeller = (sellerId) => {
    router.push(`/seller/${sellerId}`);
};

const goPost = (productId) => {
    router.push(`/post/${productId}`);
};
</script>

<style scoped>
.placeholder-custom::placeholder {
    color: #f72e1b;
}

.placeholder-gray::placeholder {
    color: #9ca3af;
}
</style>
