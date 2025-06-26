<template>
  <div class="max-w-2xl mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold mb-6">상품 수정</h1>

    <!-- form에 novalidate 속성 추가 -->
    <form @submit.prevent="submitForm" class="space-y-6" novalidate>
      <!-- 제목 입력 -->
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
          제목
        </label>
        <input
          id="title"
          v-model="formData.title"
          type="text"
          placeholder="상품 제목을 입력하세요"
          class="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- 가격 입력 -->
      <div>
        <label for="price" class="block text-sm font-medium text-gray-700 mb-1"
          >가격</label
        >
        <div class="relative">
          <input
            id="price"
            v-model="formData.price"
            type="number"
            min="0"
            placeholder="가격을 입력하세요"
            class="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >원</span
          >
        </div>
      </div>

      <!-- 이미지 업로드 - required 속성 제거 -->
      <div>
        <label for="image" class="block text-sm font-medium text-gray-700 mb-1"
          >상품 이미지</label
        >
        <div class="flex items-center justify-center w-full">
          <label
            class="flex flex-col w-full h-64 border-2 border-dashed hover:bg-gray-50 hover:border-blue-500 rounded-lg cursor-pointer transition-all duration-200"
          >
            <div
              v-if="!imagePreview"
              class="flex flex-col items-center justify-center h-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-12 h-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p class="pt-1 text-sm text-gray-500">이미지를 선택하세요</p>
              <p class="text-xs text-gray-400 mt-1">권장 크기: 500x500px</p>
            </div>
            <div v-else class="h-full flex items-center justify-center">
              <img
                :src="imagePreview"
                alt="상품 이미지 미리보기"
                class="max-h-full max-w-full object-contain"
              />
            </div>
            <input
              id="image"
              type="file"
              @change="handleImageChange"
              accept="image/*"
              class="hidden"
            />
          </label>
        </div>
      </div>

      <!-- 상세 설명 -->
      <div>
        <label
          for="description"
          class="block text-sm font-medium text-gray-700 mb-1"
          >상세 설명</label
        >
        <textarea
          id="description"
          v-model="formData.description"
          rows="5"
          placeholder="상품에 대한 상세 설명을 입력하세요"
          class="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        ></textarea>
      </div>

      <!-- 제출 버튼 -->
      <div class="flex justify-end space-x-3">
        <button
          type="button"
          @click="goBack"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
        >
          취소
        </button>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="px-4 py-2 bg-[rgb(67,168,165)] text-white rounded-md hover:bg-[rgb(57,148,145)] transition-colors disabled:opacity-50"
        >
          {{ isSubmitting ? "등록 중..." : "상품 수정하기" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useModalStore } from "../stores/modal";
import { usePostApi } from "@/api/post";
import { createPost } from "../api/productapi"; // API 함수 import

const router = useRouter();
const route = useRoute();
const modal = useModalStore();
const { getPostDetail, updatePost } = usePostApi();
const isSubmitting = ref(false);
const imagePreview = ref(null);
const imageFile = ref(null);

const postId = route.params.postId; // 상품 ID를 저장할 변수

const formData = reactive({
  title: "",
  price: "",
  description: "",
});

function handleImageChange(event) {
  const file = event.target.files[0];
  if (!file) return;

  imageFile.value = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
}

async function submitForm() {
  // 모든 필수 입력 필드 유효성 검사
  if (!formData.title.trim()) {
    modal.open({
      title: "제목 필요",
      message: "상품 제목을 입력해주세요.",
    });
    return;
  }

  if (!formData.price) {
    modal.open({
      title: "가격 필요",
      message: "상품 가격을 입력해주세요.",
    });
    return;
  }

  if (!formData.description.trim()) {
    modal.open({
      title: "설명 필요",
      message: "상품에 대한 상세 설명을 입력해주세요.",
    });
    return;
  }

  isSubmitting.value = true;

  try {
    // API 함수 호출

    console.log("postId:", postId);

    const response = await updatePost(
      postId,
      formData.title,
      formData.description,
      formData.price,
      imageFile.value
    );

    if (response.success) {
      modal.open({
        title: "수정 성공",
        message: "상품이 성공적으로 수정되었습니다.",
      });

      router.push(`/post/${postId}`);
      // setTimeout(() => {
      //   router.push(`/post/${postId}`);
      // }, 1500);
    } else {
      modal.open({
        title: "수정 실패",
        message: response.message,
      });
    }
  } finally {
    isSubmitting.value = false;
  }
}

function goBack() {
  router.back();
}

onMounted(async () => {
  // 페이지가 로드될 때 상품 상세 정보 가져오기
  if (postId) {
    const res = await getPostDetail(postId);
    console.log("상품 상세 정보:", res);
    const postDetail = res.data.data;
    if (postDetail) {
      formData.title = postDetail.title;
      formData.price = postDetail.price;
      formData.description = postDetail.description;
      imagePreview.value = postDetail.imageUrl; // 기존 이미지 URL 설정
    }
  }
});
</script>

<style scoped>
/* number 타입 입력 필드의 화살표 제거 */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield; /* Firefox */
}
</style>
