import * as React from "react";
import {createContext, useCallback, useContext, useEffect, useState} from "react";
import type {Profile, User} from "./types";
import {AuthService} from "./services";
import {Loading} from "./components/Loading.tsx";
import {toast} from "react-toastify";
import {ProfileService} from "./services/ProfileService.ts";

export interface AuthContext {
    isAuthenticated: boolean
    me: User | null
    profile: Profile | null
    logout: () => void
    login: (token: string) => void
    selectProfile: (profile: Profile) => void
}

const TOKEN_KEY = 'token'
const PROFILE_ID_KEY = 'profile_ID'

const AuthContext = createContext<AuthContext>({} as AuthContext)

export const AuthProvider = ({children}: { children: React.ReactNode }) => {
    const [me, setMe] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const isAuthenticated = me !== null
    const [isPending, setIsPending] = useState(true)

    const logout = () => {
        setMe(null)
        setProfile(null)
        localStorage.clear()
    }

    const login = async (token: string) => {
        try {
            setIsPending(true)
            localStorage.setItem(TOKEN_KEY, token)
            const res = await AuthService.me()
            setMe(res.data)
        } catch {
            toast.error('Login failed')
        }
        setIsPending(false)
    }

    const selectProfile = (profile: Profile) => {
        localStorage.setItem(PROFILE_ID_KEY, profile.id.toString())
        setProfile(profile)
    }

    const checkAuthentication = useCallback(async () => {
        const token = localStorage.getItem(TOKEN_KEY)
        if (!token) {
            setIsPending(false)
            return logout()
        }
        try {
            const res = await AuthService.me()
            setMe(res.data)
            const profileId = localStorage.getItem(PROFILE_ID_KEY)
            if (profileId) {
                const profile = await ProfileService.getProfileById(parseInt(profileId))
                setProfile(profile)
            }
        } catch {
            logout()
        }
        setIsPending(false)
    }, [])

    useEffect(() => {
        checkAuthentication().then()
    }, [checkAuthentication])

    if (isPending) return <Loading/>

    return <AuthContext.Provider value={{
        isAuthenticated,
        me,
        logout,
        login,
        profile,
        selectProfile
    }}>
        {children}
    </AuthContext.Provider>
}


// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}