<template>
  <div>
    <div class="relative w-40 h-40 mx-auto">
      <!-- 프로필 이미지 -->
      <img
        :src="userData?.imageUrl || '@/assets/icon_bbidole.svg'"
        alt="Profile"
        class="w-full h-full object-cover rounded-full border-2 border-gray-200"
      />

      <!-- 별점 배지 -->
      <div
        class="absolute bottom-2 right-2 bg-white px-3 py-1 rounded-full shadow flex items-center space-x-1"
      >
        <svg
          class="w-4 h-4 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.946a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.286 3.946c.3.921-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.175 0l-3.36 2.44c-.784.57-1.838-.197-1.54-1.118l1.287-3.946a1 1 0 00-.364-1.118l-3.36-2.44c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.287-3.946z"
          />
        </svg>
        <span class="text-sm text-gray-700 font-hahmlet font-semibold">
          {{
            !userData || userData.totalRating === -1
              ? "0.0"
              : userData.totalRating
          }}</span
        >
      </div>
    </div>
    <p
      class="relative w-80 h-12 mx-auto text-center overflow-hidden font-bold font-hahmlet"
    >
      {{ userData?.nickname || "닉네임" }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  userData: {
    type: Object,
    default: () => ({
      imageUrl: "@/assets/icon_bbidole.svg",
      nickname: "사용자의 닉네임",
      totalRating: 0.0,
    }),
  },
});
</script>

<style scoped></style>
