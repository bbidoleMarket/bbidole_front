import axios from "./axiosInstance";

export const useAuthApi = () => {
    const signup = async (email, password, name, nickname) => {
        return await axios.post("/auth/signup", {
            email,
            password,
            name,
            nickname,
        });
    };
    const login = async (email, pwd) => {
        return await axios.post("/auth/login", { email, pwd });
    };
    return { login, signup };
};
