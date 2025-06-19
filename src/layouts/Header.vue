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
          class="absolute top-4 right-4"
          @click="isHamburger = false"
          aria-label="Close sidebar"
        >
          ✕
        </button>
        <!-- 메뉴 예시 -->
        <nav>
          <ul class="text-[#2E383A] text-lg mt-8">
            <router-link
              to="/me"
              class="font-jua block hover:bg-[#319B9A] p-2 m-4 rounded-[12px]"
              >내 정보 보기</router-link
            >
            <router-link
              to="/me/edit"
              class="font-jua block hover:bg-[#319B9A] p-2 m-4 rounded-[12px]"
              >내 정보 수정</router-link
            >
            <router-link
              to="/me/posts"
              class="font-jua block hover:bg-[#319B9A] p-2 m-4 rounded-[12px]"
              >내가 쓴(←>달달한) 글</router-link
            >
            <router-link
              to="/me/buy"
              class="font-jua block hover:bg-[#319B9A] p-2 m-4 rounded-[12px]"
              >내가 산(←>염기) 물품</router-link
            >
            <router-link
              to="/me/chats"
              class="font-jua block hover:bg-[#319B9A] p-2 m-4 rounded-[12px]"
              >채팅방 목록</router-link
            >
          </ul>
        </nav>
      </aside>
    </div>
  </transition>
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
      <h1 class="font-jua text-4xl font-bold text-[#2E383A] ml-auto">
        삐돌이 마켓
      </h1>
      <!-- 로그인 버튼 -->
      <BaseButton
        class="ml-auto mr-4 p-4 bg-[#43A8A5] text-lg text-white font-bold flex items-center justify-center"
        @click="goLogin"
      >
        로그인
      </BaseButton>
      <!-- 햄버거 메뉴 버튼 -->
      <BaseButton class="p-4 bg-[#43A8A5]" @click="isHamburger = !isHamburger">
        <img src="../assets/hamburger.svg" alt="햄버거 메뉴" class="h-7" />
      </BaseButton>
    </div>
  </header>
</template>

<script setup>
import BaseButton from "../components/base/BaseButton.vue";
import router from "../router";
import { ref } from "vue";

const isHamburger = ref(false); // 햄버거 메뉴 상태

const goHome = () => {
  // 홈으로 이동하는 함수
  router.push("/");
};
const goLogin = () => {
  // 로그인 페이지로 이동하는 함수
  router.push("/login");
};
</script>
