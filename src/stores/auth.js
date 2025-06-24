import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
    setTokens,
    getTokens,
    clearTokens,
    isTokenExpired,
} from "../utils/tokenManager";
import { tokenService } from "../services/tokenService";

export const useAuthStore = defineStore("auth", () => {
    // 초기 토큰 로드
    const {
        accessToken: initialAccessToken,
        refreshToken: initialRefreshToken,
    } = getTokens();

    // 상태
    const accessToken = ref(initialAccessToken);
    const refreshToken = ref(initialRefreshToken);

    // 계산된 속성
    const isAuthenticated = computed(() => {
        return !!accessToken.value && !isTokenExpired(accessToken.value);
    });

    const isAccessTokenExpired = computed(() =>
        isTokenExpired(accessToken.value)
    );
    const isRefreshTokenExpired = computed(() =>
        isTokenExpired(refreshToken.value)
    );

    // 액션
    const setAuthTokens = (access, refresh) => {
        accessToken.value = access;
        refreshToken.value = refresh;
        setTokens(access, refresh);
    };

    const login = (tokens) => {
        setAuthTokens(tokens.accessToken, tokens.refreshToken);
    };

    const logout = () => {
        accessToken.value = null;
        refreshToken.value = null;
        clearTokens();
    };

    const updateAccessToken = (newAccessToken) => {
        accessToken.value = newAccessToken;
        localStorage.setItem("accessToken", newAccessToken);
    };

    // 토큰 새로고침 - 중앙화된 서비스 사용
    const refreshAuthTokens = async () => {
        try {
            const tokens = await tokenService.refreshToken();
            setAuthTokens(tokens.accessToken, tokens.refreshToken);
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
