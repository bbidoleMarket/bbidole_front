<template>
    <div
        class="min-h-screen flex flex-col items-center justify-center bg-[#FFFEEE]"
    >
        <!-- 로고 및 타이틀 -->
        <div class="flex flex-col items-center mb-8 mt-8">
            <h1 class="text-4xl font-bold text-gray-800 mb-2 tracking-wide">
                삐돌이 마켓
            </h1>
            <img
                src="../assets/bbidole_login.svg"
                alt="dog"
                class="w-40 h-40 mt-4"
            />
        </div>
        <!-- 폼 -->
        <div class="w-full max-w-md flex flex-col items-center">
            <h2 class="text-4xl font-bold text-gray-700 mb-8">Sign up</h2>
            <form
                class="w-full flex flex-col gap-5"
                @submit.prevent="handleSubmit"
            >
                <!-- 이메일 -->
                <div>
                    <label
                        class="block mb-1 text-lg font-semibold text-gray-700"
                        >Email address</label
                    >
                    <input
                        type="email"
                        v-model="email"
                        :class="[
                            'w-full px-4 py-3 rounded-lg border bg-white text-base focus:outline-none',
                            email === ''
                                ? 'border-gray-300'
                                : emailValid
                                ? 'border-green-500'
                                : 'border-red-500',
                        ]"
                        placeholder="Enter your email"
                    />
                    <span
                        v-if="email"
                        :class="emailValid ? 'text-green-600' : 'text-red-600'"
                        class="text-sm"
                    >
                        {{
                            emailValid
                                ? "이메일 형식이 맞습니다."
                                : "이메일 형식이 아닙니다."
                        }}
                    </span>
                </div>
                <!-- 비밀번호 -->
                <div>
                    <label
                        class="block mb-1 text-lg font-semibold text-gray-700"
                        >Password</label
                    >
                    <input
                        type="password"
                        v-model="password"
                        maxlength="15"
                        :class="[
                            'w-full px-4 py-3 rounded-lg border bg-white text-base focus:outline-none',
                            password === ''
                                ? 'border-gray-300'
                                : passwordValid
                                ? 'border-green-500'
                                : 'border-red-500',
                        ]"
                        placeholder="8~15자, 대소문자, !,@,#,$ 포함"
                    />
                    <span
                        v-if="password"
                        :class="
                            passwordValid ? 'text-green-600' : 'text-red-600'
                        "
                        class="text-sm"
                    >
                        {{
                            passwordValid
                                ? "비밀번호 형식이 맞습니다."
                                : "비밀번호 형식이 맞지 않습니다."
                        }}
                    </span>
                </div>
                <!-- 비밀번호 확인 -->
                <div>
                    <label
                        class="block mb-1 text-lg font-semibold text-gray-700"
                        >Confirm password</label
                    >
                    <input
                        type="password"
                        v-model="confirmPassword"
                        :class="[
                            'w-full px-4 py-3 rounded-lg border bg-white text-base focus:outline-none',
                            confirmPassword === ''
                                ? 'border-gray-300'
                                : confirmPasswordValid
                                ? 'border-green-500'
                                : 'border-red-500',
                        ]"
                        placeholder="비밀번호 확인"
                    />
                    <span
                        v-if="confirmPassword"
                        :class="
                            confirmPasswordValid
                                ? 'text-green-600'
                                : 'text-red-600'
                        "
                        class="text-sm"
                    >
                        {{
                            confirmPasswordValid
                                ? "비밀번호가 일치합니다."
                                : "비밀번호가 일치하지 않습니다."
                        }}
                    </span>
                </div>
                <!-- 이름 -->
                <div>
                    <label
                        class="block mb-1 text-lg font-semibold text-gray-700"
                        >Name</label
                    >
                    <input
                        type="text"
                        v-model="name"
                        maxlength="4"
                        class="w-full px-4 py-3 rounded-lg border bg-white text-base focus:outline-none border-gray-300"
                        placeholder="이름 입력"
                    />
                </div>
                <!-- 닉네임 -->
                <div>
                    <label
                        class="block mb-1 text-lg font-semibold text-gray-700"
                        >Nickname</label
                    >
                    <input
                        type="text"
                        v-model="nickname"
                        maxlength="15"
                        class="w-full px-4 py-3 rounded-lg border bg-white text-base focus:outline-none border-gray-300"
                        placeholder="닉네임 입력"
                    />
                </div>
                <!-- 버튼 -->
                <button
                    type="submit"
                    class="mt-4 w-full py-3 bg-teal-500 text-white font-bold text-2xl rounded-xl transition-colors hover:bg-teal-600 disabled:opacity-50"
                    :disabled="!formValid"
                >
                    Sign up
                </button>
            </form>
            <p class="my-4 text-xl text-gray-700">
                Already have an account?
                <a
                    href="/login"
                    class="text-teal-500 hover:underline font-medium"
                    >Log</a
                >
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuthApi } from "../api/auth";
import { useRouter } from "vue-router";

// 상태
const email = ref("");
const name = ref("");
const password = ref("");
const confirmPassword = ref("");
const nickname = ref("");

const { signup } = useAuthApi();
const router = useRouter();

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
    () => emailValid.value && passwordValid.value && confirmPasswordValid.value
);

// 회원가입 처리
async function handleSubmit() {
    console.log("회원가입");
    if (!emailValid || !passwordValid) {
        console.log("email or password InValid");
        return;
    }
    console.log(email.value, password.value, name.value, nickname.value);
    try {
        const res = await signup(
            email.value,
            password.value,
            name.value,
            nickname.value
        );
        console.log("회원가입 성공 : " + JSON.stringify(res));
        if (res.status == 200) {
            alert("회원가입 성공");
            router.push("/login");
        }
    } catch (e) {
        console.error("signup error : " + e.message);
    }
}
</script>
