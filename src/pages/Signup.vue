<template>
    <div class="page-container-signup">
        <!-- 로고 및 타이틀 -->
        <div class="flex-col-center mb-4 sm:mb-8 mt-4 sm:mt-8">
            <h1 class="title-main mb-2">
                삐돌이 마켓
            </h1>
            <img
                src="../assets/bbidole_login.svg"
                alt="dog"
                class="logo-signup"
            />
        </div>
        <!-- 폼 -->
        <div class="form-container">
            <h2 class="title-section mb-4 sm:mb-8">Sign up</h2>
            <form
                class="form-group"
                @submit.prevent="handleSubmit"
            >
                <!-- 이메일 -->
                <div class="form-field">
                    <label class="label-form">Email address</label>
                    <BaseInput
                        type="email"
                        v-model="email"
                        :variant="email === '' ? 'default' : emailValid ? 'success' : 'error'"
                        size="md"
                        placeholder="Enter your email"
                    />
                    <span
                        v-if="email"
                        :class="emailValid ? 'validation-success' : 'validation-error'"
                        class="text-validation"
                    >
                        {{
                            emailValid
                                ? "이메일 형식이 맞습니다."
                                : "이메일 형식이 아닙니다."
                        }}
                    </span>
                </div>
                <!-- 비밀번호 -->
                <div class="form-field">
                    <label class="label-form">Password</label>
                    <BaseInput
                        type="password"
                        v-model="password"
                        maxlength="15"
                        :variant="password === '' ? 'default' : passwordValid ? 'success' : 'error'"
                        size="md"
                        placeholder="8~15자, 대소문자, !,@,#,$ 포함"
                    />
                    <span
                        v-if="password"
                        :class="passwordValid ? 'validation-success' : 'validation-error'"
                        class="text-validation"
                    >
                        {{
                            passwordValid
                                ? "비밀번호 형식이 맞습니다."
                                : "비밀번호 형식이 맞지 않습니다."
                        }}
                    </span>
                </div>
                <!-- 비밀번호 확인 -->
                <div class="form-field">
                    <label class="label-form">Confirm password</label>
                    <BaseInput
                        type="password"
                        v-model="confirmPassword"
                        :variant="confirmPassword === '' ? 'default' : confirmPasswordValid ? 'success' : 'error'"
                        size="md"
                        placeholder="비밀번호 확인"
                    />
                    <span
                        v-if="confirmPassword"
                        :class="confirmPasswordValid ? 'validation-success' : 'validation-error'"
                        class="text-validation"
                    >
                        {{
                            confirmPasswordValid
                                ? "비밀번호가 일치합니다."
                                : "비밀번호가 일치하지 않습니다."
                        }}
                    </span>
                </div>
                <!-- 이름 -->
                <div class="form-field">
                    <label class="label-form">Name</label>
                    <BaseInput
                        type="text"
                        v-model="name"
                        maxlength="4"
                        size="md"
                        placeholder="이름 입력"
                    />
                </div>
                <!-- 닉네임 -->
                <div class="form-field">
                    <label class="label-form">Nickname</label>
                    <BaseInput
                        type="text"
                        v-model="nickname"
                        maxlength="15"
                        size="md"
                        placeholder="닉네임 입력"
                    />
                </div>
                <!-- 버튼 -->
                <BaseButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    :disabled="!formValid || isLoading"
                    :loading="isLoading"
                    class="mt-2 sm:mt-4 w-full"
                >
                    {{ isLoading ? "가입 중..." : "Sign up" }}
                </BaseButton>
            </form>
            <p class="signup-link-container">
                Already have an account?
                <router-link
                    to="/login"
                    class="link-brand"
                    >Log in</router-link
                >
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuthApi } from "../api/auth";
import { useRouter } from "vue-router";
import { useModalStore } from "../stores/modal";
import BaseInput from "../components/base/BaseInput.vue";
import BaseButton from "../components/base/BaseButton.vue";

// 상태
const email = ref("");
const name = ref("");
const password = ref("");
const confirmPassword = ref("");
const nickname = ref("");
const isLoading = ref(false);

const { signup } = useAuthApi();
const router = useRouter();
const modal = useModalStore();

// 유효성
const emailValid = computed(() =>
    /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email.value)
);
const passwordValid = computed(() =>
    /^(?=.*[A-Z])(?=.*[!@#$])[A-Za-z\d!@#$]{8,15}$/.test(password.value)
);
const confirmPasswordValid = computed(
    () =>
        confirmPassword.value !== "" && password.value === confirmPassword.value
);
const formValid = computed(
    () => emailValid.value && passwordValid.value && confirmPasswordValid.value && name.value.trim() && nickname.value.trim()
);

async function handleSubmit() {
    if (!formValid.value || isLoading.value) return;

    isLoading.value = true;

    try {
        await signup({
            email: email.value,
            password: password.value,
            name: name.value,
            nickname: nickname.value,
        });

        // 회원가입 성공 모달
        modal.open({
            title: "회원가입 성공",
            message: "삐돌이 마켓에 가입해주셔서 감사합니다!\n로그인 페이지로 이동합니다."
        });

        // 모달 닫힌 후 로그인 페이지로 이동
        setTimeout(() => {
            router.push("/login");
        }, 2000);

    } catch (error) {
        console.error("회원가입 에러:", error);
        
        // 에러 메시지 설정
        let errorMsg = "";
        if (error.message) {
            errorMsg = error.message;
        } else if (error.status === 409) {
            errorMsg = "이미 사용 중인 이메일입니다.";
        } else if (error.status === 400) {
            errorMsg = "입력 정보를 다시 확인해주세요.";
        } else {
            errorMsg = "회원가입 중 오류가 발생했습니다. 다시 시도해주세요.";
        }

        // 에러 모달 표시
        modal.open({
            title: "회원가입 실패",
            message: errorMsg
        });
    } finally {
        isLoading.value = false;
    }
}
</script>
