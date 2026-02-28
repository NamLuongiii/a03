import {createContext, type ReactNode, useContext, useState} from 'react';

// Giả định ModelUser dựa trên nhu cầu quản lý sách của bạn
export interface ModelUser {
    id: string;
    email: string;
    fullName: string;
    role: 'admin' | 'editor';
    avatarUrl?: string;
}

interface AuthContextType {
    me: ModelUser | null;
    setMe: (user: ModelUser | null) => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // Bạn có thể khởi tạo từ localStorage nếu có token lưu sẵn
    const [me, setMe] = useState<ModelUser | null>(null);

    const isAuthenticated = !!me;

    return (
        <AuthContext.Provider value={{ me, setMe, isAuthenticated }}>
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