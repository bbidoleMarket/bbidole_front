<template>
  <div class="flex flex-col h-[86vh] p-6 lg:px-60 bg-[#FFFFF6] rounded-[12px]">
    <div
      class="flex items-center justify-center text-[#2E383A] bg-[#EAF9EA] rounded-tl-[12px] rounded-tr-[12px] p-4"
    >
      <h2 class="font-hahmlet text-lg lg:text-3xl font-bold">리뷰 작성</h2>
    </div>
    <div
      class="mb-4 bg-[#FFFCEF] shadow-lg p-4 rounded-br-[12px] rounded-bl-[12px]"
    >
      <label class="block mb-2 font-semibold font-hahmlet text-[#2E383A]"
        >별점</label
      >
      <div class="flex space-x-2">
        <button
          v-for="n in 5"
          :key="n"
          type="button"
          @click="rating = n"
          :class="[
            'text-2xl',
            rating >= n ? 'text-yellow-400' : 'text-gray-300',
            'focus:outline-none',
          ]"
        >
          ★
        </button>
      </div>
      <div class="mb-4"></div>
      <label
        class="block mb-2 font-semibold font-hahmlet text-[#2E383A]"
        for="review"
        >리뷰 내용</label
      >
      <textarea
        id="review"
        v-model="reviewText"
        rows="5"
        class="w-full border rounded p-2"
        placeholder="리뷰를 작성해주세요."
      ></textarea>
    </div>
    <BaseButton
      @click="submitReview"
      :disabled="!canSubmit"
      class="rounded hover:bg-[#319B9A] disabled:bg-gray-300 disabled:text-[#555] disabled:cursor-not-allowed"
    >
      등록하기
    </BaseButton>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";
import BaseButton from "../components/base/BaseButton.vue";
import { useChatApi } from "../api/chat";
import { useModalStore } from "../stores/modal";

const route = useRoute();
const router = useRouter();
const modal = useModalStore();
const { setReview } = useChatApi();

// 쿼리 파라미터에서 sellerId, buyerId 추출
const { buyerId, sellerId } = route.query;

const rating = ref(0);
const reviewText = ref("");

// 등록 버튼 활성화 조건
const canSubmit = computed(
  () => rating.value > 0 && reviewText.value.trim().length > 0
);

const submitReview = async () => {
  await setReview({
    sellerId: sellerId,
    buyerId: buyerId,
    rating: rating.value,
    content: reviewText.value,
  })
    .then(() => {
      console.log("리뷰 등록 성공");
      modal.open({
        title: "리뷰 등록 완료",
        message: "리뷰가 성공적으로 등록되었습니다.",
      });
    })
    .then(() => {
      // 리뷰 등록 후 메인 페이지로 이동
      router.push("/");
    })
    .catch((error) => {
      console.error("리뷰 등록 실패:", error);
      modal.open({
        title: "리뷰 등록 실패",
        message: "리뷰 등록에 실패했습니다. 다시 시도해주세요.",
      });
      return;
    });
};
</script>
