<template>
  <div class="w-full max-w-xl mx-auto bg-white p-4 rounded-xl shadow space-y-4">
    <div class="text-xl font-jua text-center">신고페이지</div>
    <h1>신고자 : {{ reporter }}</h1>
    <div v-if="viewType === ReportStatus.CHAT_ROOM">
      <h1>채팅방 신고</h1>
    </div>
    <div v-else-if="viewType === ReportStatus.POST">
      <h1>게시글 신고</h1>
    </div>
    <div v-else>
      <h1>기타 신고</h1>
    </div>
    <div class="text-md">
      <textarea
        v-model="content"
        rows="5"
        placeholder="신고 내용을 입력하세요"
        class="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      ></textarea>
      <div class="flex justify-end mt-4">
        <BaseButton class="text-md mr-2" @click="backPage">취소</BaseButton>
        <BaseButton
          class="text-md bg-red-400 hover:bg-red-600 active:bg-red-400 disabled:bg-gray-300 disabled:text-[#2E383A]"
          :disabled="!content.trim()"
          @click="submitReport"
          >신고하기</BaseButton
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseButton from "@/components/base/BaseButton.vue";
import { useModalStore } from "../stores/modal";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { ReportStatus } from "@/utils/status";
import { useReportApi } from "@/api/report";
import { useUserApi } from "@/api/post";

const route = useRoute();
const router = useRouter();
const modal = useModalStore();
const { report } = useReportApi();
const { getMyDetail } = useUserApi();

const reporter = ref(null);
const viewType = ref(null);
const content = ref("");

const backPage = () => {
  // 이전 페이지로 돌아가는 로직
  router.back();
};

const deletePostHandler = () => {
  if (viewType.value === ReportStatus.POST) {
    // 게시글 삭제 로직
    report(route.params.postId, ReportStatus.POST, content.value)
      .then(() => {
        modal.open({
          title: "게시글 신고 완료",
          message: "게시글이 신고되었습니다.",
        });
        router.push("/"); // 홈으로 이동
      })
      .catch((error) => {
        console.error("게시글 신고 실패:", error);
        modal.open({
          title: "오류",
          message: "게시글 신고에 실패했습니다. 다시 시도해주세요.",
        });
      });
  } else if (viewType.value === ReportStatus.CHAT_ROOM) {
    // 채팅방 삭제 로직
    report(route.params.chatRoomId, ReportStatus.CHAT_ROOM, content.value)
      .then(() => {
        modal.open({
          title: "채팅방 신고 완료",
          message: "채팅방이 신고되었습니다.",
        });
        router.push("/"); // 홈으로 이동
      })
      .catch((error) => {
        console.error("채팅방 신고 실패:", error);
        modal.open({
          title: "오류",
          message: "채팅방 신고에 실패했습니다. 다시 시도해주세요.",
        });
      });
  }
};

const submitReport = () => {
  if (viewType.value === ReportStatus.POST) {
    // 게시글 신고 로직

    modal.open({
      title: "게시글 신고",
      message: "해당 게시글을 신고하시겠습니까?",
      confirmText: "신고",
      cancelText: "취소",
      onConfirm: () => {
        deletePostHandler(); // 직접 함수 호출
      },
    });
  } else if (viewType.value === ReportStatus.CHAT_ROOM) {
    // 채팅방 신고 로직
    modal.open({
      title: "채팅방 신고",
      message: "해당 채팅방을 신고하시겠습니까?",
      confirmText: "신고",
      cancelText: "취소",
      onConfirm: () => {
        deletePostHandler(); // 직접 함수 호출
      },
    });
  } else {
    // 기타 신고 로직
    modal.open({
      title: "기타 신고",
      message: "신고가 접수되었습니다. 감사합니다.",
    });
  }
};

onMounted(async () => {
  // viewType을 라우트 메타에서 가져옵니다.
  const res = await getMyDetail();
  if (res.data.success) {
    console.log("내 정보 가져오기 성공:", res.data.data);
    reporter.value = res.data.data.nickname;
  } else {
    console.error("내 정보 가져오기 실패:", res.data.message);
  }

  if (route.meta.viewType) {
    viewType.value = route.meta.viewType;
  }
});
</script>

<style scoped></style>
