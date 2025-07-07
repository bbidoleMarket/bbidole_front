<template>
  <div class="w-full max-w-xl mx-auto bg-white p-4 rounded-xl shadow space-y-4">
    <!-- 상태 배지 -->
    <div class="">
      <span
        v-if="postDetail?.sold"
        class="inline-block px-3 py-1 text-sm font-bold text-[#F72E1B] border-2 border-[#F72E1B] rounded-full font-jua"
      >
        판매완료
      </span>
      <span
        v-else
        class="inline-block px-3 py-1 text-sm font-bold text-[#19CE6B] border-2 border-[#19CE6B] rounded-full font-jua"
      >
        판매중
      </span>
      <span class="text-xl font-jua pl-2 text-center">
        {{ postDetail?.title || "상품 제목" }}
      </span>
    </div>

    <!-- 상품 이미지 -->
    <div
      class="w-full mx-auto aspect-square bg-gray-100 rounded-xl overflow-hidden"
    >
      <img
        :src="postDetail?.imageUrl"
        alt="product"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- 판매자 정보 + 채팅하기 -->
    <div class="flex items-center justify-between border-t border-b py-3">
      <!-- 프로필 + 이름 + 별점 -->
      <div
        @click="goSellerDetailPage"
        class="flex items-center gap-3 cursor-pointer"
      >
        <div class="w-12 h-12 rounded-full bg-gray-200">
          <img
            :src="postDetail?.writerImageUrl || defaultImg"
            alt="userProfileImage"
            class="md:w-full h-full object-cover"
          />
        </div>
        <div>
          <p class="text-sm font-hahmlet truncate md:w-64">
            {{ postDetail?.writerNickname || "판매자 닉네임" }}
          </p>
          <div class="flex items-center gap-1 text-sm text-gray-700">
            <svg
              class="w-4 h-4 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.946a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.286 3.946c.3.921-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.175 0l-3.36 2.44c-.784.57-1.838-.197-1.54-1.118l1.287-3.946a1 1 0 00-.364-1.118l-3.36-2.44c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.287-3.946z"
              />
            </svg>
            <span class="text-sm font-hahmlet">
              {{
                !postDetail || postDetail.writerTotalRating === -1
                  ? "0.0"
                  : postDetail.writerTotalRating
              }}
            </span>
          </div>
        </div>
      </div>

      <!-- 버튼 그룹 (채팅하기, 신고하기) -->
      <div class="flex gap-2">
        <!-- 채팅하기 버튼 -->
        <BaseButton
          v-if="!postDetail?.writer || false"
          class="flex items-center justify-center gap-2 px-4 py-2 font-jua text-sm rounded-md bg-[#45A8A6] text-white hover:bg-opacity-90"
          @click="startChatting"
        >
          <img src="@/assets/icon_bubble.svg" alt="채팅" class="w-4 h-4" />
          <span>채팅하기</span>
        </BaseButton>

        <!-- 신고하기 버튼 -->
        <BaseButton
          v-if="!postDetail?.writer || false"
          class="flex items-center justify-center gap-2 px-4 py-2 font-jua text-sm rounded-md border bg-red-400 hover:bg-red-600 active:bg-red-400"
          @click="reportPost"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4 text-white"
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
          <span>신고</span>
        </BaseButton>
      </div>
    </div>

    <div class="w-full pb-12">
      <p class="pb-4 text-sm font-hahmlet">
        가격 : {{ formatPrice(postDetail?.price || 0) }}
      </p>
      <p class="text-sm font-noto">
        {{ postDetail?.description || "상품 설명입니다." }}
      </p>
    </div>
    <div class="w-full flex gap-2">
      <BaseButton
        v-if="postDetail?.writer || false"
        class="flex items-center justify-center w-full gap-2 py-2"
        @click="() => goPostEditPage()"
      >
        <img src="@/assets/icon_pencil.svg" alt="" class="w-4 h-4" />
        수정하기
      </BaseButton>

      <BaseButton
        v-if="postDetail?.writer || false"
        class="flex items-center justify-center w-full gap-2 py-2 bg-red-500 hover:bg-red-600"
        @click="confirmDelete"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        삭제하기
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import BaseButton from "@/components/base/BaseButton.vue";
import router from "@/router";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { usePostApi } from "@/api/post";
import { useChatRoomApi } from "../api/post";
import defaultImg from "@/assets/icon_bbidole.svg";
import { useModalStore } from "@/stores/modal";
import { formatPrice } from "@/utils/formatters.js";

const modal = useModalStore();
const route = useRoute();
const postId = route.params.postId;
const { getPostDetail, deletePost } = usePostApi();
const { startChat } = useChatRoomApi();

const postDetail = ref(null);

const startChatting = async () => {
  try {
    const res = await startChat(postId);
    goChattingPage(res.data.data);
  } catch (error) {
    const status = error.response?.status;

    if (status === 403) {
      modal.open({
        title: "채팅방 생성 실패",
        message: "로그인 후 사용가능합니다.",
      });
      router.push("/login");
      return;
    }

    if (error.response && error.response.data) {
      modal.open({
        title: "채팅방 생성 실패",
        message: error.response.data.message,
      });
    } else {
      modal.open({
        title: "채팅방 생성 실패",
        message: "알 수 없는 오류가 발생했습니다.",
      });
    }
  }
};

const goPostEditPage = () => {
  router.push(`/post/update/${postId}`);
};

const goSellerDetailPage = () => {
  router.push(`/seller/${postDetail.value.writerId}`);
};

const goChattingPage = (res) => {
  console.log("채팅방 생성 성공", res);
  router.push({
    path: `/chat/${res.id}`,
    query: {
      id: res.id,
      productId: res.productId,
      title: res.productName,
      sellerId: res.sellerId,
      sellerName: res.sellerName,
      buyerId: res.buyerId,
      buyerName: res.buyerName,
      othersId: res.othersId,
      isBuyer: res.buyer,
      isCompleted: res.completed,
      isReviewed: res.reviewed, // 리뷰 작성 완료 여부
    },
  });
};

// 게시글 삭제 확인
const confirmDelete = () => {
  modal.open({
    title: "게시글 삭제",
    message: "정말 이 게시글을 삭제하시겠습니까?",
    confirmText: "삭제",
    cancelText: "취소",
    onConfirm: () => {
      deletePostHandler(); // 직접 함수 호출
    },
  });
};

// 게시글 삭제 처리
const deletePostHandler = async () => {
  console.log("삭제 핸들러 호출됨");
  try {
    console.log("삭제 요청 전송:", postId);
    const res = await deletePost(postId);
    console.log("삭제 응답:", res);

    if (res.data.success || res.status === 200) {
      modal.open({
        title: "삭제 완료",
        message: "게시글이 삭제되었습니다.",
        onClose: () => router.push("/"),
      });
    } else {
      throw new Error(res.data.message || "삭제 실패");
    }
  } catch (error) {
    console.error("삭제 오류:", error);
    modal.open({
      title: "삭제 실패",
      message:
        error.response?.data?.message || "게시글 삭제 중 오류가 발생했습니다.",
    });
  }
};

const reportPost = () => {
  router.push(`/report/post/${postId}`);
};

onMounted(async () => {
  try {
    const res = await getPostDetail(postId);

    postDetail.value = res.data.data;
    window.scrollTo(0, 0);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      modal.open({
        title: "게시글 없음",
        message: "요청하신 게시글을 찾을 수 없습니다.",
        onClose: () => router.push("/"),
      });
    } else {
      modal.open({
        title: "오류 발생",
        message:
          error.response?.data?.message ||
          "게시글을 불러오는 중 오류가 발생했습니다.",
      });
    }
  }
});
</script>

<style></style>
