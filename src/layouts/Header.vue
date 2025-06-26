<template>
  <!-- 사이드바 (오픈 시만 보임) -->
  <transition name="fade">
    <div v-if="isHamburger" class="fixed inset-0 z-40 flex justify-end mt-20">
      <!-- 오버레이 -->
      <div
        class="fixed inset-0 bg-black bg-opacity-40"
        @click="isHamburger = false"
      ></div>
      <!-- 사이드바 본체 -->
      <aside
        class="relative w-64 bg-[#A1D3D2] h-full shadow-lg z-50 p-6 right-0 rounded-tl-[12px]"
      >
        <button
          class="absolute top-4 right-4 text-[#2E383A] hover:text-[#319B9A] transition-colors duration-200"
          @click="isHamburger = false"
          aria-label="Close sidebar"
        >
          ✕
        </button>
        <!-- 메뉴 -->
        <nav>
          <ul class="font-jua text-[#2E383A] text-lg mt-8">
            <li>
              <router-link
                to="/me"
                class="block hover:bg-[#319B9A] hover:text-white p-2 m-4 rounded-[12px] transition-colors duration-200"
                @click="isHamburger = false"
              >
                내 정보 보기
              </router-link>
            </li>
            <li>
              <router-link
                to="/me/edit"
                class="block hover:bg-[#319B9A] hover:text-white p-2 m-4 rounded-[12px] transition-colors duration-200"
                @click="isHamburger = false"
              >
                내 정보 수정
              </router-link>
            </li>
            <li>
              <router-link
                to="/me/posts"
                class="block hover:bg-[#319B9A] hover:text-white p-2 m-4 rounded-[12px] transition-colors duration-200"
                @click="isHamburger = false"
              >
                내가 쓴 글
              </router-link>
            </li>
            <li>
              <router-link
                to="/me/buy"
                class="block hover:bg-[#319B9A] hover:text-white p-2 m-4 rounded-[12px] transition-colors duration-200"
                @click="isHamburger = false"
              >
                내가 산 물품
              </router-link>
            </li>
            <li>
              <router-link
                to="/me/chats"
                class="block hover:bg-[#319B9A] hover:text-white p-2 m-4 rounded-[12px] transition-colors duration-200"
                @click="isHamburger = false"
              >
                채팅방 목록
              </router-link>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  </transition>

  <header class="header-main">
    <!-- 로고 겸 홈으로 버튼 -->
    <!-- <BaseButton
            class="m-0 p-0 !bg-transparent hover:bg-transparent !border-none !shadow-none"
            @click="goHome"
        >
            <img
                src="../assets/bbidole_login.svg"
                alt="삐돌이 마켓 로고"
                class="logo-header"
            />
        </BaseButton> -->

    <BaseButton
      class="m-0 p-0 !bg-transparent hover:bg-transparent !border-none !shadow-none w-36 h-12 sm:w-44 sm:h-16 -mt-3"
      @click="goHome"
    >
      <img
        src="../assets/bbidole_login.svg"
        alt="삐돌이 마켓 로고"
        class="logo-header"
      />
    </BaseButton>

    <!-- 타이틀 -->
    <div class="flex-center w-full h-full">
      <h1
        class="text-lg font-jua text-xl sm:text-3xl lg:text-4xl text-[#2E383A]"
      >
        삐돌이 마켓
      </h1>
    </div>

    <!-- 버튼들 -->
    <div class="header-buttons">
      <!-- 로그인/로그아웃 버튼 -->
      <BaseButton
        v-if="!isAuthenticated"
        @click="goToLogin"
        variant="brand"
        size="sm"
        class="w-16 sm:w-20 mr-2 sm:h-[44px] text-lg"
      >
        <span class="hidden sm:inline">로그인</span>
        <span class="sm:hidden">LOGIN</span>
      </BaseButton>
      <BaseButton
        v-else
        @click="handleLogout"
        :loading="isLoggingOut"
        variant="brand"
        size="sm"
        class="w-16 sm:w-24 mr-2 sm:h-[44px]"
      >
        <span class="hidden sm:inline text-lg">로그아웃</span>
        <span class="sm:hidden">OUT</span>
      </BaseButton>

      <!-- 햄버거 메뉴 -->
      <BaseButton
        variant="brand"
        size="sm"
        class="aspect-square w-[40px] flex justify-center items-center"
        @click="isHamburger = !isHamburger"
      >
        <img
          src="../assets/hamburger.svg"
          alt="햄버거 메뉴"
          class="icon-menu"
        />
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
const isHamburger = ref(false); // 햄버거 메뉴 상태

// 로그인 상태 확인
const isAuthenticated = computed(() => authStore.isAuthenticated);

// 홈 페이지로 이동
const goHome = () => {
  window.location.href = "/";
  isHamburger.value = false;
};

// 로그인 페이지로 이동
const goToLogin = () => {
  router.push("/login");
  isHamburger.value = false;
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
      message: "성공적으로 로그아웃되었습니다.",
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
      errorMessage =
        "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.";
    }

    modalStore.open({
      title: "로그아웃 실패",
      message: errorMessage + " 다시 시도해주세요.",
    });
  } finally {
    isLoggingOut.value = false;
  }
};
</script>

<style scoped>
/* 사이드바 페이드 트랜지션 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
