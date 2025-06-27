<template>
    <!-- 가장 밖-->
    <div
        class="flex gap-8 sm:gap-16 justify-center items-center flex-col sm:flex-row min-h-screen"
    >
        <div class="w-auto max-w-f flex flex-col rounded-xl shadow p-4 m-8">
            <!-- 프로필-->
            <div
                class="flex flex-col min-h-64 min-w-64 items-center justify-center gap-4"
            >
                <div
                    class="w-40 h-40 rounded-full bg-slate-400 flex justify-center items-center overflow-hidden"
                >
                    <img
                        :src="profileImage || defaultImage"
                        alt="프로필"
                        class="object-contain"
                    />
                </div>

                <div class="text-lg font-jua">{{ name }}</div>
            </div>
            <!-- 버튼 -->
            <button
                @click="triggetFileInput"
                class="w-full flex justify-center items-center font-jua bg-[#45A8A6] hover:bg-opacity-90 rounded-lg text-white px-4 py-2 relative"
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
                    <input
                        v-model="nickName"
                        class="w-auto border border-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-[#45A8A6] rounded p-2 mt-1"
                    />
                </div>
                <div class="min-w-80 flex flex-col gap-0.5">
                    <label class="text-sm font-hahmlet">비밀번호</label>
                    <input
                        v-model="password"
                        class="w-auto border border-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-[#45A8A6] rounded p-2 mt-1"
                    />
                </div>
                <div class="min-w-80 flex flex-col gap-0.5">
                    <label class="text-sm font-hahmlet">비밀번호 확인</label>
                    <input
                        v-model="passwordConfirm"
                        class="w-auto border border-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-[#45A8A6] rounded p-2 mt-1"
                    />
                </div>

                <button
                    @click="profileUpdate"
                    class="w-full flex justify-center items-center font-jua bg-[#45A8A6] hover:bg-opacity-90 rounded-lg text-white mt-8 px-4 py-2 relative"
                >
                    <div>수정</div>
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
//프로필 사진, 프로필 사진 변경 버튼
//닉네임
//비밀번호
//비밀번호 확인
//수정 버튼
import { ref, onMounted } from "vue";
import { useMyPageApi } from "@/api/mypage";
import { useModalStore } from "../stores/modal";

const modal = useModalStore();
const { useInfoUpdate, profileImageUpdate, profileInfo } = useMyPageApi();
const defaultImage = "/image/poodle.webp";
const profileImage = ref(defaultImage);
const fileInput = ref(null);
const name = ref("");
const nickName = ref("");
const password = ref("");
const passwordConfirm = ref("");

//이름 출력
onMounted(async () => {
    const res = await profileInfo();
    console.log("응답 확인", res);
    name.value = res.data.data.name;
    profileImage.value = res.data.data.profileImage;
});

//파일 선택
function triggetFileInput() {
    fileInput.value.click(); //
}
//프로필 이미지 변경
function handleImageChage(e) {
    const file = e.target.files[0];
    if (file) {
        //profileImage.value = URL.createObjectURL(file);

        profileImagUpdate(file); //추가 함 파일 선택 시 파일 전송
    } else {
        profileImage.value = defaultImage;
    }
}

//프로필 이미지 업로드
// 프로필 이미지 업로드 함수
const profileImagUpdate = async (file) => {
    if (!file) return;
    try {
        const res = await profileImageUpdate(file, "wpsl@example.com");
        console.log("res:", res);
        if (res.status == 200) {
            modal.open({
                title: "수정 완료!",
                message: "프로필 사진이 수정되었습니다.",
            });
            profileImage.value = URL.createObjectURL(file);
        }
    } catch (e) {
        console.log("e:", e);
        modal.open({
            title: "수정 실패",
            message: e.message || "입력값을 확인해주세요.",
        });
    }
};

//회원 정보 수정
const profileUpdate = async () => {
    try {
        const res = await useInfoUpdate(
            nickName.value,
            password.value,
            passwordConfirm.value,
            "wpsl@example.com" //삭제 예정
        );
        //모달 창
        if (res.status == 200) {
            modal.open({
                title: "수정 완료!",
                message: "회원 정보가 수정되었습니다.",
            });
            //input 초기화
            nickName.value = "";
            password.value = "";
            passwordConfirm.value = "";
        }
    } catch (error) {
        modal.open({
            title: "수정 실패",
            message: error?.response?.data?.message || "입력값을 확인해주세요.",
        });
    }
};
</script>
