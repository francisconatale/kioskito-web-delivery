import { apiClient } from "./api-client";

export interface UserInfo {
    id: number;
    username: string;
    nombre: string;
    email: string;
    dni: string;
    telefono?: string;
    direccion?: string;
    rol: string;
}

export interface LoginResponse {
    success: boolean;
    token: string;
    user: UserInfo;
}

export const authService = {
    async login(credenciales: { username: string; password: string }) {
        const response = await apiClient.post<LoginResponse>("/auth/login", credenciales);
        const data = response.data;
        
        if (data?.token) {
            sessionStorage.setItem("auth_token", data.token);
            sessionStorage.setItem("user_info", JSON.stringify(data.user));
        }
        
        return data;
    },

    async register(data: Record<string, any>) {
        const response = await apiClient.post<any>("/auth/register", data);
        return response.data;
    },

    async logout() {
        sessionStorage.removeItem("auth_token");
        sessionStorage.removeItem("user_info");
    },

    async validateSession() {
        const token = sessionStorage.getItem("auth_token");
        if (!token) return null;

        try {
            const response = await apiClient.get<UserInfo>("/auth/me");
            const user = response.data;
            if (user) {
                sessionStorage.setItem("user_info", JSON.stringify(user));
            }
            return user;
        } catch (error) {
            console.error("Session validation failed:", error);
            this.logout();
            return null;
        }
    },

    getToken() {
        return typeof window !== 'undefined' ? sessionStorage.getItem("auth_token") : null;
    },

    getUserInfo(): UserInfo | null {
        if (typeof window === 'undefined') return null;
        const info = sessionStorage.getItem("user_info");
        return info ? JSON.parse(info) : null;
    },

    isAuthenticated() {
        return !!this.getToken();
    }
};
