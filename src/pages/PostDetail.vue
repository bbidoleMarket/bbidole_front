<template>
  <div
    class="w-full max-w-xl mx-auto bg-white p-4 rounded-xl shadow space-y-4 pb-[70px]"
  >
    <!-- 상태 배지 -->
    <div>
      <span
        class="inline-block px-3 py-1 text-sm font-bold text-[#19CE6B] border-2 border-[#19CE6B] rounded-full font-jua"
      >
        판매중
      </span>
      <span class="text-xl font-jua">
        판매글 게시하기 제목입니다. 판매글 게시하기 제목입니다. 판매글 게시하기
        제목입니다. 판매글 게시하기 제목입니다. 판매글 게시하기 제목입니다.
      </span>
    </div>

    <!-- 상품 이미지 -->
    <div
      class="w-full mx-auto aspect-square bg-gray-100 rounded-xl overflow-hidden"
    >
      <img
        src="@/assets/icon_bbidole.svg"
        alt="product"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- 판매자 정보 + 채팅하기 -->
    <div class="flex items-center justify-between border-t border-b py-3">
      <!-- 프로필 + 이름 + 별점 -->
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
          <img
            src="@/assets/icon_bbidole.svg"
            alt="user"
            class="w-full h-full object-cover"
          />
        </div>
        <div>
          <p class="text-sm font-hahmlet truncate w-64 lg:w-96">
            판매자의 이름입니다. 판매자의 이름입니다.판매자의 이름입니다.
            판매자의 이름입니다.판매자의 이름입니다. 판매자의 이름입니다.
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
            <span class="text-sm font-hahmlet">3.5</span>
          </div>
        </div>
      </div>

      <!-- 채팅하기 버튼 -->
      <BaseButton class="flex items-center gap-2 px-3 py-1 font-jua text-sm">
        <img src="@/assets/icon_bubble.svg" class="w-4 h-4" />
        채팅하기</BaseButton
      >
    </div>

    <div class="w-full bg-gray-50">
      <p class="pb-4 text-sm font-hahmlet">가격 : 1000원</p>
      <p class="text-sm font-noto">
        description description description description description description
        description description description description description description
        description description description description description description
        description description description description description description
        description description description description
      </p>
    </div>

    <!-- 수정하기 버튼 (하단 고정용으로 설계) -->
    <div class="w-full pt-2">
      <BaseButton class="flex items-center justify-center w-full gap-2 py-2">
        <img src="@/assets/icon_pencil.svg" alt="" class="w-4 h-4" />
        수정하기</BaseButton
      >
    </div>
  </div>
</template>

<script setup>
import BaseButton from "@/components/base/BaseButton.vue";

// TODO QueryParm으로 postId, buyerId(jwt), sellerId 전달하기
</script>

<style></style>
