import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { tokenService } from '../services/tokenService';

export function useAuth() {
    const authStore = useAuthStore();
    const router = useRouter();

    // 인증 상태 확인
    const isAuthenticated = computed(() => authStore.isAuthenticated);
    const accessToken = computed(() => authStore.accessToken);

    // 로그인 확인 및 리다이렉트
    const requireAuth = () => {
        if (!isAuthenticated.value) {
            router.push('/login');
            return false;
        }
        return true;
    };

    // 로그아웃 후 리다이렉트
    const logoutAndRedirect = () => {
        authStore.logout();
        router.push('/login');
    };

    // 토큰 자동 갱신 체크 - 중앙화된 서비스 사용
    const checkAndRefreshToken = async () => {
        try {
            await tokenService.ensureValidToken();
            return true;
        } catch (error) {
            console.error('토큰 검증/갱신 실패:', error);
            logoutAndRedirect();
            return false;
        }
    };

    // 인증 상태 변화 감지
    watch(isAuthenticated, (newValue) => {
        if (!newValue && router.currentRoute.value.meta?.requiresAuth) {
            router.push('/login');
        }
    });

    return {
        isAuthenticated,
        accessToken,
        requireAuth,
        logoutAndRedirect,
        checkAndRefreshToken
    };
} 