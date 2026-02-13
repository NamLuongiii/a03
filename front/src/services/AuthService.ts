import type {ApiResponse, User} from "../types";
import api from "./api";

export const AuthService = {
    login: async (email: string, password: string) => {
        // Implement login logic here
        const res = await api.post<
            ApiResponse<string>
        >("/auth/login", {email, password});
        return res.data;
    },
    registers: async (name: string, email: string, password: string) => {
        const res = await api.post<ApiResponse<User>>("/auth/signup", {name, email, password});
        return res.data;
    },
    me: async () => {
        const res = await api.get<ApiResponse<User>>("/auth/me");
        return res.data;
    },
    askResetPassword: async (email: string) => {
        const res = await api.post<ApiResponse<string>>("/auth/ask-reset-password", {email});
        return res.data;
    },
    verifyOTP: async (email: string, otp: string) => {
        const res = await api.post<ApiResponse<string>>("/auth/verify-OTP", {email, otp});
        return res.data;
    },
    resetPassword: async (email: string, password: string, token: string) => {
        const res = await api.post<ApiResponse<string>>("/auth/reset-password", {email, password, token});
        return res.data;
    }
};
