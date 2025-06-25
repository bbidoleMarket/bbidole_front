//template -> script -> style
<template>
  <!-- 가장 밖-->
  <div class="flex gap-16 justify-center items-center min-h-screen">
    <div class="w-auto max-w-f flex flex-col gap-8 rounded-xl shadow p-4 m-8">
      <!-- 프로필-->
      <div
        class="flex flex-col min-h-64 min-w-64 items-center justify-center gap-4"
      >
        <div
          class="w-40 h-40 rounded-full bg-slate-400 flex justify-center items-center overflow-hidden"
        >
          <img :src="profileImage" alt="프로필" class="object-contain" />
        </div>

        <div class="text-lg">삐돌이</div>
      </div>
      <!-- 버튼 -->
      <button
        @click="triggetFileInput"
        class="w-full flex justify-center items-center bg-[#45A8A6] hover:bg-opacity-90 rounded-lg text-white px-4 py-2 relative"
      >
        <div>프로필 사진 변경</div>
        <i class="absolute right-4 fa-solid fa-pen"></i>
      </button>
      <input
        type="file"
        ref="fileInput"
        class="hidden"
        accept="image/*"
        @change="handleImageChage"
      />
    </div>
    <!-- 회원 수정 창-->
    <form @submit.prevent="onSubmit">
      <div class="flex flex-col gap-3">
        <div class="min-w-80 flex flex-col gap-0.5">
          <label class="text-sm font-hahmlet">닉네임</label>
          <input v-model="nkckname" class="w-auto border rounded p-2 mt-1" />
        </div>
        <div class="min-w-80 flex flex-col gap-0.5">
          <label class="text-sm font-hahmlet">비밀번호</label>
          <input v-model="nkckname" class="w-fll border rounded p-2 mt-1" />
        </div>
        <div class="min-w-80 flex flex-col gap-0.5">
          <label class="text-sm font-hahmlet">비밀번호 확인</label>
          <input v-model="nkckname" class="w-fll border rounded p-2 mt-1" />
        </div>

        <button
          @click="triggetFileInput"
          class="w-full flex justify-center items-center bg-[#45A8A6] hover:bg-opacity-90 rounded-lg text-white mt-8 px-4 py-2 relative"
        >
          <div>수정</div>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

//프로필 사진, 프로필 사진 변경 버튼
//닉네임
//비밀번호
//비밀번호 확인
//수정 버튼
const defaultImage = "/image/갈푸.webp";
const profileImage = ref(defaultImage);
const fileInput = ref(null);

function triggetFileInput() {
  fileInput.value.click(); //
}
function handleImageChage(e) {
  const file = e.target.files[0];
  if (file) {
    profileImage.value = URL.createObjectURL(file);
  } else {
    profileImage.value = defaultImage;
  }
}
</script>
