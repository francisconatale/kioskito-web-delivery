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
    clientId?: number;
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
            localStorage.setItem("auth_token", data.token);
            localStorage.setItem("user_info", JSON.stringify(data.user));
        }
        
        return data;
    },

    async register(data: Record<string, any>) {
        const response = await apiClient.post<any>("/auth/register", data);
        return response.data;
    },

    async logout() {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_info");
    },

    async validateSession() {
        const token = localStorage.getItem("auth_token");
        if (!token) return null;

        try {
            const response = await apiClient.get<UserInfo>("/auth/me");
            const user = response.data;
            if (user) {
                localStorage.setItem("user_info", JSON.stringify(user));
            }
            return user;
        } catch (error) {
            console.error("Session validation failed:", error);
            this.logout();
            return null;
        }
    },

    getToken() {
        return typeof window !== 'undefined' ? localStorage.getItem("auth_token") : null;
    },

    getUserInfo(): UserInfo | null {
        if (typeof window === 'undefined') return null;
        const info = localStorage.getItem("user_info");
        return info ? JSON.parse(info) : null;
    },

    isAuthenticated() {
        return !!this.getToken();
    }
};
