import {createContext, type ReactNode, useCallback, useContext, useEffect, useState} from 'react';
import {Auth, type ModelsAccount} from "@/api";
import {Spinner} from "@heroui/react";

interface AuthContextType {
    me: ModelsAccount | null;
    setMe: (user: ModelsAccount | null) => void;
    isAuthenticated: boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: { children: ReactNode }) => {
    // Bạn có thể khởi tạo từ localStorage nếu có token lưu sẵn
    const [me, setMe] = useState<ModelsAccount | null>(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!me;

    useEffect(() => {
        if (me) return
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true)

        Auth.getAuthMe().then(res => {
            const me = res.data?.data as ModelsAccount
            setMe(me)
            setLoading(false)
        }).catch(() => {
            setLoading(false)
        })
    }, [me])

    const logout = useCallback(() => {
        setMe(null)
        localStorage.removeItem('token')
        window.location.href = '/login'
    }, [])

    if (loading) return <div className="flex items-center justify-center h-screen">
        <Spinner/>
    </div>

    return (
        <AuthContext.Provider value={{me, setMe, isAuthenticated, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook useAuth để sử dụng trong các component
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};