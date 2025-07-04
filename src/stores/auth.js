import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
    setTokens,
    getTokens,
    clearTokens,
    isTokenExpired,
} from "../utils/tokenManager";
import { tokenService } from "../services/tokenService";
import axios from "../api/axiosInstance";

export const useAuthStore = defineStore("auth", () => {
    // 초기 토큰 로드
    const {
        accessToken: initialAccessToken,
        refreshToken: initialRefreshToken,
    } = getTokens();

    // 상태
    const accessToken = ref(initialAccessToken);
    const refreshToken = ref(initialRefreshToken);
    const isAdmin = ref(localStorage.getItem('isAdmin') === 'true');

    // 계산된 속성
    const isAuthenticated = computed(() => {
        // 액세스 토큰이 유효한 경우
        if (accessToken.value && !isTokenExpired(accessToken.value)) {
            return true;
        }

        // 액세스 토큰이 없거나 만료되었지만, 리프레시 토큰이 유효한 경우도 인증된 상태로 간주
        if (refreshToken.value && !isTokenExpired(refreshToken.value)) {
            return true;
        }

        return false;
    });

    const isAccessTokenExpired = computed(() =>
        isTokenExpired(accessToken.value)
    );
    const isRefreshTokenExpired = computed(() =>
        isTokenExpired(refreshToken.value)
    );

    // 액션
    const setAuthTokens = (access, refresh, adminStatus = false) => {
        accessToken.value = access;
        refreshToken.value = refresh;
        isAdmin.value = adminStatus;
        setTokens(access, refresh);
        localStorage.setItem('isAdmin', adminStatus.toString());
    };

    const login = (tokens) => {
        setAuthTokens(tokens.accessToken, tokens.refreshToken, tokens.isAdmin);
    };

    const logout = async () => {
        const currentRefreshToken = refreshToken.value;

        try {
            // 서버에 로그아웃 요청 (액세스 토큰은 인터셉터에서 자동 추가, 리프레시 토큰은 수동 추가)
            const headers = {};
            if (currentRefreshToken) {
                headers["Refresh-Token"] = currentRefreshToken;
            }

            console.log(
                "로그아웃 요청 - Access Token:",
                accessToken.value ? "있음" : "없음"
            );
            console.log(
                "로그아웃 요청 - Refresh Token:",
                currentRefreshToken ? "있음" : "없음"
            );

            await axios.post("/api/auth/logout", {}, { headers });
            console.log("로그아웃 API 호출 성공");
        } catch (error) {
            console.error("로그아웃 API 호출 실패:", error);
            // API 실패해도 로컬 로그아웃은 진행
        } finally {
            // 로컬 상태 정리
            accessToken.value = null;
            refreshToken.value = null;
            isAdmin.value = false;
            clearTokens();
            localStorage.removeItem('isAdmin');
            console.log("로컬 토큰 정리 완료");
        }
    };

    const updateAccessToken = (newAccessToken) => {
        accessToken.value = newAccessToken;
        localStorage.setItem("accessToken", newAccessToken);
    };

    // 토큰 새로고침 - 중앙화된 서비스 사용
    const refreshAuthTokens = async () => {
        try {
            const tokens = await tokenService.refreshToken();
            setAuthTokens(tokens.accessToken, tokens.refreshToken, isAdmin.value);
            return tokens;
        } catch (error) {
            logout();
            throw error;
        }
    };

    // 초기화 시 토큰 유효성 검사
    const validateAuth = () => {
        if (accessToken.value && isTokenExpired(accessToken.value)) {
            if (refreshToken.value && isTokenExpired(refreshToken.value)) {
                logout();
            }
        }
    };

    // 스토어 초기화 시 검증 실행
    validateAuth();

    return {
        // 상태
        accessToken,
        refreshToken,
        isAdmin,

        // 계산된 속성
        isAuthenticated,
        isAccessTokenExpired,
        isRefreshTokenExpired,

        // 액션
        setAuthTokens,
        login,
        logout,
        updateAccessToken,
        refreshAuthTokens,
        validateAuth,
    };
});
