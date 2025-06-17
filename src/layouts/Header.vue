<template>
  <header
    class="fixed top-0 right-0 left-0 flex w-full h-[80px] bg-[#FFFCEF] shadow-md p-4"
  >
    <img
      src="../assets/bbidole.svg"
      alt="삐돌이 마켓 로고"
      class="h-40 fixed top-0"
    />
    <div class="flex w-full h-full justify-center items-center">
      <h1 class="text-3xl font-bold text-[#2E383A]">삐돌이 마켓</h1>
    </div>
    <BaseButton
      class="mr-4 w-20 p-4 bg-[#43A8A5] text-white font-bold flex items-center justify-center"
    >
      로그인
    </BaseButton>
    <BaseButton class="p-4 bg-[#43A8A5] flex items-center justify-center">
      <img src="../assets/hamburger.svg" alt="햄버거 메뉴" class="h-7" />
    </BaseButton>
  </header>
</template>

<script setup>
import BaseButton from "../components/base/BaseButton.vue";
</script>
