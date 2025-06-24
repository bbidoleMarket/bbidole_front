<template>
  <div class="min-h-screen bg-[#FFFEF0]">
    <!-- 헤더 -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-gray-900">삐돌이 마켓</h1>
          </div>
          
          <div class="flex items-center space-x-4">
            <span class="text-gray-700">안녕하세요!</span>
            <button
              @click="handleLogout"
              class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- 메인 컨텐츠 -->
    <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <img
          src="../assets/bbidole.svg"
          alt="삐돌이"
          class="mx-auto w-32 h-32 mb-6"
        />
        <h2 class="text-3xl font-bold text-gray-900 mb-4">
          삐돌이 마켓에 오신 것을 환영합니다!
        </h2>
        <p class="text-lg text-gray-600 mb-8">
          토큰 관리 시스템이 성공적으로 작동 중입니다.
        </p>
        
        <!-- 토큰 정보 (개발용) -->
        <div class="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
          <h3 class="text-lg font-semibold mb-4">인증 상태</h3>
          <div class="space-y-2 text-left">
            <p><strong>로그인 상태:</strong> {{ authStore.isAuthenticated ? '✅ 로그인됨' : '❌ 로그아웃됨' }}</p>
            <p><strong>액세스 토큰:</strong> {{ accessTokenStatus }}</p>
            <p><strong>리프레시 토큰:</strong> {{ refreshTokenStatus }}</p>
          </div>
          
          <!-- 토큰 재발급 테스트 버튼 -->
          <div class="mt-4">
            <button
              @click="testTokenRefresh"
              :disabled="!authStore.refreshToken || authStore.isRefreshTokenExpired"
              class="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              토큰 재발급 테스트
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useAuthApi } from '../api/auth';

const router = useRouter();
const authStore = useAuthStore();
const { logout } = useAuthApi();

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

// 로그아웃 처리
const handleLogout = async () => {
  try {
    await logout();
    router.push('/login');
  } catch (error) {
    console.error('로그아웃 에러:', error);
    // 에러가 발생해도 로컬 토큰은 정리하고 로그인 페이지로 이동
    authStore.logout();
    router.push('/login');
  }
};

// 토큰 재발급 테스트
const testTokenRefresh = async () => {
  try {
    await authStore.refreshAuthTokens();
    alert('토큰 재발급 성공!');
  } catch (error) {
    console.error('토큰 재발급 에러:', error);
    alert('토큰 재발급 실패: ' + error.message);
  }
};
</script> 