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

            <form class="w-full flex flex-col items-center">
                <input
                    type="email"
                    v-model="email"
                    placeholder="Email address"
                    class="w-full mb-3 px-4 py-3 border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
                <input
                    type="password"
                    v-model="password"
                    placeholder="Password"
                    class="w-full mb-5 px-4 py-3 border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
                <button
                    type="submit"
                    @click.prevent="handleLogin"
                    class="w-full py-3 bg-teal-500 text-white rounded-xl text-xl font-bold hover:bg-teal-600 transition"
                >
                    Log in
                </button>
            </form>
            <div class="mt-5 text-lg">
                Don't have an account?
                <!-- <a
                    href="./Signup.vue"
                    class="text-teal-600 font-semibold hover:underline"
                    >Sign up</a
                > -->
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
import { useAuthApi } from "../api/auth";

const email = ref("");
const password = ref("");
const { login } = useAuthApi();

async function handleLogin() {
    alert("로그인 시도: " + email.value + "/" + password.value);
    try {
        const res = await login(email.value, pwd.value);
        console.log(res);
    } catch (e) {
        console.error("login error : " + e.message);
    }
}
</script>
