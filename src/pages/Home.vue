<template>
  <div class="page-container">
    <!-- 헤더 -->
    <header class="header-page">
      <div class="header-content">
        <div class="header-inner">
          <div class="flex items-center">
            <h1 class="text-lg sm:text-2xl font-bold text-gray-900">삐돌이 마켓</h1>
          </div>
          
          <div class="nav-items">
            <span class="text-xs sm:text-base text-gray-700 hidden sm:inline">안녕하세요!</span>
            <BaseButton
              variant="danger"
              size="sm"
              @click="confirmLogout"
            >
              로그아웃
            </BaseButton>
          </div>
        </div>
      </div>
    </header>

    <!-- 메인 컨텐츠 -->
    <main class="main-content">
      <div class="text-center">
        <img
          src="../assets/bbidole.svg"
          alt="삐돌이"
          class="icon-main"
        />
        <h2 class="title-page">
          삐돌이 마켓에 오신 것을 환영합니다!
        </h2>
        <p class="text-description">
          토큰 관리 시스템이 성공적으로 작동 중입니다.
        </p>
        
        <!-- 토큰 정보 (개발용) -->
        <div class="card-auth">
          <h3 class="title-card">인증 상태</h3>
          <div class="token-status">
            <p><strong>로그인 상태:</strong> {{ authStore.isAuthenticated ? '✅ 로그인됨' : '❌ 로그아웃됨' }}</p>
            <p><strong>액세스 토큰:</strong> {{ accessTokenStatus }}</p>
            <p><strong>리프레시 토큰:</strong> {{ refreshTokenStatus }}</p>
          </div>
          
          <!-- 토큰 재발급 테스트 버튼 -->
          <div class="mt-3 sm:mt-4">
            <BaseButton
              variant="primary"
              size="md"
              :disabled="!authStore.refreshToken || authStore.isRefreshTokenExpired || isRefreshing"
              :loading="isRefreshing"
              @click="testTokenRefresh"
              class="w-full"
            >
              {{ isRefreshing ? "재발급 중..." : "토큰 재발급 테스트" }}
            </BaseButton>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useAuthApi } from '../api/auth';
import { useModalStore } from '../stores/modal';
import BaseButton from '../components/base/BaseButton.vue';

const router = useRouter();
const authStore = useAuthStore();
const { logout } = useAuthApi();
const modal = useModalStore();
const isRefreshing = ref(false);

// 토큰 상태 표시용 computed
const accessTokenStatus = computed(() => {
  if (!authStore.accessToken) return '❌ 없음';
  if (authStore.isAccessTokenExpired) return '⚠️ 만료됨';
  return '✅ 유효함';
});

const refreshTokenStatus = computed(() => {
  if (!authStore.refreshToken) return '❌ 없음';
  if (authStore.isRefreshTokenExpired) return '⚠️ 만료됨';
  return '✅ 유효함';
});

// 로그아웃 확인 모달
const confirmLogout = () => {
  modal.open({
    title: "로그아웃 확인",
    message: "정말 로그아웃하시겠습니까?"
  });
  
  // 모달의 확인 버튼 클릭 시 실제 로그아웃 수행
  setTimeout(() => {
    const modalElement = document.querySelector('.bg-\\[\\#222\\]');
    if (modalElement) {
      modalElement.addEventListener('click', (e) => {
        if (e.target.textContent === '확인') {
          handleLogout();
        }
      });
    }
  }, 100);
};

// 로그아웃 처리
const handleLogout = async () => {
  try {
    await logout();
    
    modal.open({
      title: "로그아웃 완료",
      message: "안전하게 로그아웃되었습니다."
    });
    
    setTimeout(() => {
      router.push('/login');
    }, 1500);
  } catch (error) {
    console.error('로그아웃 에러:', error);
    
    modal.open({
      title: "로그아웃 오류",
      message: "로그아웃 중 오류가 발생했습니다.\n로컬 정보를 정리하고 로그인 페이지로 이동합니다."
    });
    
    // 에러가 발생해도 로컬 토큰은 정리하고 로그인 페이지로 이동
    authStore.logout();
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  }
};

// 토큰 재발급 테스트
const testTokenRefresh = async () => {
  if (isRefreshing.value) return;
  
  isRefreshing.value = true;
  
  try {
    await authStore.refreshAuthTokens();
    
    modal.open({
      title: "토큰 재발급 성공",
      message: "새로운 액세스 토큰과 리프레시 토큰이 발급되었습니다!"
    });
  } catch (error) {
    console.error('토큰 재발급 에러:', error);
    
    let errorMsg = "";
    if (error.message) {
      errorMsg = error.message;
    } else {
      errorMsg = "토큰 재발급에 실패했습니다.\n다시 로그인해주세요.";
    }
    
    modal.open({
      title: "토큰 재발급 실패",
      message: errorMsg
    });
  } finally {
    isRefreshing.value = false;
  }
};
</script> 