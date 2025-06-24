<template>
    <div
        class="min-h-screen flex flex-col items-center justify-center bg-[#FFFEF0]"
    >
        <!-- 메인 로그인 영역 -->
        <div class="flex flex-col items-center w-full max-w-md mt-6">
            <h1 class="text-4xl font-bold mb-2 text-gray-800 tracking-wide">
                삐돌이 마켓
            </h1>
            <img
                src="../assets/bbidole_login.svg"
                alt="dog"
                class="w-52 my-4 drop-shadow-md"
            />
            <h2 class="text-3xl font-bold mb-4 text-gray-800">Log in</h2>

            <form
                class="w-full flex flex-col items-center"
                @submit.prevent="handleLogin"
            >
                <input
                    type="email"
                    v-model="email"
                    placeholder="Email address"
                    class="w-full mb-3 px-4 py-3 border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                    required
                />
                <input
                    type="password"
                    v-model="password"
                    placeholder="Password"
                    class="w-full mb-3 px-4 py-3 border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                    required
                />

                <!-- 에러 메시지 표시 -->
                <div
                    v-if="errorMessage"
                    class="w-full mb-3 text-red-600 text-sm text-center"
                >
                    {{ errorMessage }}
                </div>

                <button
                    type="submit"
                    :disabled="isLoading"
                    class="w-full py-3 bg-teal-500 text-white rounded-xl text-xl font-bold hover:bg-teal-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {{ isLoading ? "로그인 중..." : "Log in" }}
                </button>
            </form>
            <div class="mt-5 text-lg">
                Don't have an account?
                <router-link
                    to="/signup"
                    class="text-teal-600 font-semibold hover:underline"
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

const router = useRouter();
const email = ref("");
const password = ref("");
const isLoading = ref(false);
const errorMessage = ref("");

const { login } = useAuthApi();
const authStore = useAuthStore();

async function handleLogin() {
    if (isLoading.value) return;

    isLoading.value = true;
    errorMessage.value = "";

    try {
        await login(email.value, password.value);

        // 로그인 성공 시 메인 페이지로 이동
        await router.push("/");
    } catch (error) {
        console.error("로그인 에러:", error);

        // 에러 메시지 설정
        if (error.message) {
            errorMessage.value = error.message;
        } else if (error.status === 401) {
            errorMessage.value = "이메일 또는 비밀번호가 올바르지 않습니다.";
        } else if (error.status === 404) {
            errorMessage.value = "등록되지 않은 이메일입니다.";
        } else {
            errorMessage.value =
                "로그인 중 오류가 발생했습니다. 다시 시도해주세요.";
        }
    } finally {
        isLoading.value = false;
    }
}

// 이미 로그인된 사용자는 메인 페이지로 리다이렉트
if (authStore.isAuthenticated) {
    router.push("/");
}
</script>
