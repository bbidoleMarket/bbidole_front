// 토큰 관리 유틸리티

// 토큰 저장
export const setTokens = (accessToken, refreshToken) => {
    if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
    } else {
        localStorage.removeItem("accessToken");
    }

    if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
    } else {
        localStorage.removeItem("refreshToken");
    }
};

// 토큰 가져오기
export const getTokens = () => {
    return {
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken"),
    };
};

// 토큰 제거
export const clearTokens = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("isAdmin");
};

// 토큰 만료 확인
export const isTokenExpired = (token) => {
    if (!token) return true;

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp < currentTime;
    } catch (error) {
        console.error("토큰 디코딩 에러:", error);
        return true;
    }
};

// 토큰에서 사용자 정보 추출
export const getUserFromToken = (token) => {
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return {
            email: payload.sub,
            exp: payload.exp,
            iat: payload.iat,
            type: payload.type,
        };
    } catch (error) {
        console.error("토큰에서 사용자 정보 추출 에러:", error);
        return null;
    }
};

// 토큰 유효성 검사
export const validateTokens = () => {
    const { accessToken, refreshToken } = getTokens();

    return {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        isAccessTokenExpired: isTokenExpired(accessToken),
        isRefreshTokenExpired: isTokenExpired(refreshToken),
        isAuthenticated: !!accessToken && !isTokenExpired(accessToken),
    };
};

// 자동 로그아웃 체크
export const checkAutoLogout = () => {
    const { isRefreshTokenExpired } = validateTokens();

    if (isRefreshTokenExpired) {
        clearTokens();
        // 현재 페이지가 로그인 페이지가 아니면 로그인 페이지로 이동
        if (window.location.pathname !== "/login") {
            window.location.href = "/login";
        }
        return true;
    }

    return false;
};
