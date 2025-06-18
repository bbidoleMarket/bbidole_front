<template>
  <header
    class="fixed top-0 right-0 left-0 flex w-full h-[80px] bg-[#FFFCEF] shadow-md p-4"
  >
    <!-- 로고 겸 홈으로 버튼 -->
    <BaseButton class="bg-transparent hover:bg-transparent" @click="goHome">
      <img
        src="../assets/bbidole.svg"
        alt="삐돌이 마켓 로고"
        class="h-40 fixed top-0"
      />
    </BaseButton>
    <div class="flex w-full h-full justify-center items-center">
      <h1 class="text-3xl font-bold text-[#2E383A] ml-auto">삐돌이 마켓</h1>
      <!-- 로그인 버튼 -->
      <BaseButton
        class="ml-auto mr-4 w-20 p-4 bg-[#43A8A5] text-lg text-white font-bold flex items-center justify-center"
        @click="goLogin"
      >
        로그인
      </BaseButton>
      <!-- 햄버거 메뉴 버튼 -->
      <BaseButton class="p-4 bg-[#43A8A5]">
        <img src="../assets/hamburger.svg" alt="햄버거 메뉴" class="h-7" />
      </BaseButton>
    </div>
  </header>
</template>

<script setup>
import BaseButton from "../components/base/BaseButton.vue";
import router from "../router";

const goHome = () => {
  // 홈으로 이동하는 함수
  router.push("/");
};
const goLogin = () => {
  // 로그인 페이지로 이동하는 함수
  router.push("/login");
};
</script>
