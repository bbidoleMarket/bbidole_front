<template>
    <div class="page-container-auth">
        <!-- 메인 로그인 영역 -->
        <div class="form-container">
            <h1 class="title-main mb-2">삐돌이 마켓</h1>
            <img
                src="../assets/bbidole_login.svg"
                alt="dog"
                class="logo-auth"
            />
            <h2 class="title-section mb-3 sm:mb-4">Log in</h2>

            <form class="form-group" @submit.prevent="handleLogin">
                <BaseInput
                    type="email"
                    v-model="email"
                    placeholder="Email address"
                    size="md"
                    required
                />
                <BaseInput
                    type="password"
                    v-model="password"
                    placeholder="Password"
                    size="md"
                    required
                />

                <!-- 에러 메시지 표시 -->
                <div v-if="errorMessage" class="form-error">
                    {{ errorMessage }}
                </div>

                <BaseButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    :disabled="isLoading"
                    :loading="isLoading"
                    class="w-full"
                >
                    {{ isLoading ? "로그인 중..." : "Log in" }}
                </BaseButton>
            </form>
            <div class="auth-link-container">
                Don't have an account?
                <router-link to="/signup" class="link-primary"
                    >Sign up</router-link
                >
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthApi } from "../api/auth";
import { useAuthStore } from "../stores/auth";
import { useModalStore } from "../stores/modal";
import BaseInput from "../components/base/BaseInput.vue";
import BaseButton from "../components/base/BaseButton.vue";

const router = useRouter();
const email = ref("");
const password = ref("");
const isLoading = ref(false);
const errorMessage = ref("");

const { login } = useAuthApi();
const authStore = useAuthStore();
const modal = useModalStore();

async function handleLogin() {
    if (isLoading.value) return;

    isLoading.value = true;
    errorMessage.value = "";

    try {
        await login(email.value, password.value);

        // 로그인 성공 모달
        modal.open({
            title: "로그인 성공",
            message: "삐돌이 마켓에 오신 것을 환영합니다!",
        });

        // 모달 닫힌 후 메인 페이지로 이동
        setTimeout(() => {
            router.push("/");
        }, 1500);
    } catch (error) {
        console.error("로그인 에러:", error);

        // 에러 메시지 설정
        let errorMsg = "";
        if (error.message) {
            errorMsg = error.message;
        } else if (error.status === 401) {
            errorMsg = "이메일 또는 비밀번호가 올바르지 않습니다.";
        } else if (error.status === 404) {
            errorMsg = "등록되지 않은 이메일입니다.";
        } else {
            errorMsg = "로그인 중 오류가 발생했습니다. 다시 시도해주세요.";
        }

        // 에러 모달 표시
        modal.open({
            title: "로그인 실패",
            message: errorMsg,
        });

        errorMessage.value = errorMsg;
    } finally {
        isLoading.value = false;
    }
}

// 이미 로그인된 사용자는 메인 페이지로 리다이렉트
if (authStore.isAuthenticated) {
    router.push("/");
}
</script>
