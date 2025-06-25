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
      <!-- 로그인/로그아웃 버튼 -->
      <BaseButton
        v-if="!isAuthenticated"
        @click="goToLogin"
        variant="brand"
        size="sm"
        class="w-12 sm:w-20"
      >
        <span class="hidden sm:inline">로그인</span>
        <span class="sm:hidden">LOGIN</span>
      </BaseButton>
      <BaseButton
        v-else
        @click="handleLogout"
        :loading="isLoggingOut"
        variant="danger"
        size="sm"
        class="w-12 sm:w-20"
      >
        <span class="hidden sm:inline">로그아웃</span>
        <span class="sm:hidden">OUT</span>
      </BaseButton>
      
      <!-- 햄버거 메뉴 -->
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
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useModalStore } from "../stores/modal";
import BaseButton from "../components/base/BaseButton.vue";

const router = useRouter();
const authStore = useAuthStore();
const modalStore = useModalStore();

const isLoggingOut = ref(false);

// 로그인 상태 확인
const isAuthenticated = computed(() => authStore.isAuthenticated);

// 로그인 페이지로 이동
const goToLogin = () => {
  router.push("/login");
};

// 로그아웃 처리
const handleLogout = async () => {
  try {
    isLoggingOut.value = true;
    
    // auth store의 logout 메서드 호출 (서버 요청 성공 시에만 로컬 정리)
    await authStore.logout();
    
    // 서버 로그아웃 성공 시에만 실행되는 코드
    modalStore.open({
      title: "로그아웃 완료",
      message: "성공적으로 로그아웃되었습니다."
    });
    
    // 홈페이지로 이동
    router.push("/");
    
  } catch (error) {
    console.error("로그아웃 실패:", error);
    
    // 에러 타입에 따른 메시지 구분
    let errorMessage = "로그아웃 중 오류가 발생했습니다.";
    
    if (error.response) {
      // 서버에서 응답을 받았지만 에러 상태코드인 경우
      if (error.response.status === 401) {
        errorMessage = "인증이 만료되었습니다. 페이지를 새로고침해주세요.";
      } else {
        errorMessage = `서버 오류가 발생했습니다. (${error.response.status})`;
      }
    } else if (error.request) {
      // 요청이 전송되었지만 응답을 받지 못한 경우 (네트워크 오류)
      errorMessage = "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.";
    }
    
    modalStore.open({
      title: "로그아웃 실패",
      message: errorMessage + " 다시 시도해주세요."
    });
  } finally {
    isLoggingOut.value = false;
  }
};
</script>
