<template>
  <header class="header-main">
    <!-- 로고 -->
    <img
      src="../assets/bbidole.svg"
      alt="삐돌이 마켓 로고"
      class="logo-header"
    />
    
    <!-- 타이틀 -->
    <div class="flex-center w-full h-full">
      <h1 class="text-lg sm:text-3xl font-bold text-[#2E383A]">삐돌이 마켓</h1>
    </div>
    
    <!-- 버튼들 -->
    <div class="header-buttons">
      <BaseButton
        variant="brand"
        size="sm"
        class="w-12 sm:w-20"
      >
        <span class="hidden sm:inline">로그인</span>
        <span class="sm:hidden">LOGIN</span>
      </BaseButton>
      <BaseButton 
        variant="brand" 
        size="sm"
        class="aspect-square"
      >
        <img src="../assets/hamburger.svg" alt="햄버거 메뉴" class="icon-menu" />
      </BaseButton>
    </div>
  </header>
</template>

<script setup>
import BaseButton from "../components/base/BaseButton.vue";
</script>
