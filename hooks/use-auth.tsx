"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { authService, UserInfo } from "@/lib/auth"

type AuthState = "login" | "authenticated" | "guest"

interface AuthContextType {
    user: UserInfo | null
    authState: AuthState
    isResolvingAuth: boolean
    login: (credentials: { username: string; password: string }) => Promise<void>
    register: (data: Record<string, any>) => Promise<void>
    logout: () => void
    setAsGuest: () => void
    refreshUser: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserInfo | null>(null)
    const [authState, setAuthState] = useState<AuthState>("login")
    const [isResolvingAuth, setIsResolvingAuth] = useState(true)

    const refreshUser = useCallback(() => {
        const info = authService.getUserInfo()
        setUser(info)
        if (info) {
            setAuthState("authenticated")
        }
    }, [])

    useEffect(() => {
        const checkSession = async () => {
            const token = authService.getToken()
            if (token) {
                const validatedUser = await authService.validateSession()
                if (validatedUser) {
                    setUser(authService.getUserInfo())
                    setAuthState("authenticated")
                } else {
                    setUser(null)
                    setAuthState("login")
                }
            } else {
                setUser(null)
                setAuthState("login")
            }
            setIsResolvingAuth(false)
        }
        checkSession()
    }, [])

    const login = async (credentials: { username: string; password: string }) => {
        const data = await authService.login(credentials)
        if (data?.user) {
            setUser(data.user)
            setAuthState("authenticated")
        }
    }

    const register = async (data: Record<string, any>) => {
        await authService.register(data)
        // Auto-login after register? We can reuse login logic if needed
        await login({ username: data.username, password: data.password })
    }

    const logout = () => {
        authService.logout()
        setUser(null)
        setAuthState("login")
    }

    const setAsGuest = () => {
        setUser(null)
        setAuthState("guest")
    }

    return (
        <AuthContext.Provider value={{ 
            user, 
            authState, 
            isResolvingAuth, 
            login, 
            register, 
            logout, 
            setAsGuest,
            refreshUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
