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
        <div class="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
          <img
            :src="postDetail?.writerImageUrl || defaultImg"
            alt="userProfileImage"
            class="w-full h-full object-cover"
          />
        </div>
        <div>
          <p class="text-sm font-hahmlet truncate w-64 lg:w-96">
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

      <!-- 채팅하기 버튼 -->
      <BaseButton
        class="flex items-center gap-2 px-3 py-1 font-jua text-sm"
        @click="startChatting"
      >
        <img src="@/assets/icon_bubble.svg" class="w-4 h-4" />
        채팅하기</BaseButton
      >
    </div>

    <div class="w-full pb-12">
      <p class="pb-4 text-sm font-hahmlet">
        가격 : {{ formatPrice(postDetail.price) }}
      </p>
      <p class="text-sm font-noto">
        {{ postDetail?.description || "상품 설명입니다." }}
      </p>
    </div>

    <!-- 수정하기 버튼 (하단 고정용으로 설계) -->
    <div class="w-full">
      <BaseButton
        class="flex items-center justify-center w-full gap-2 py-2"
        @click="() => goPostEditPage()"
      >
        <img src="@/assets/icon_pencil.svg" alt="" class="w-4 h-4" />
        수정하기
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
const { getPostDetail } = usePostApi();
const { startChat } = useChatRoomApi();

const postDetail = ref(null);

const startChatting = async () => {
  try {
    const res = await startChat(postId);
    goChattingPage(res.data.data);
  } catch (error) {
    const status = error.response?.status;
    console.log("채팅방 생성 실패1");
    if (error.response && error.response.data) {
      console.log("채팅방 생성 실패2", error.response.data.message);
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
      isCompleted: res.completed,
    },
  });
};

onMounted(async () => {
  const res = await getPostDetail(postId);
  console.log("postDetail", res.data.data);
  postDetail.value = res.data.data;
  window.scrollTo(0, 0); // 페이지 상단으로 스크롤 이동
});
</script>

<style></style>
