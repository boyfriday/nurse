import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { login as loginApi, register as registerApi } from '../services/api';
import { toast } from 'react-toastify';
import { User } from '../types';

interface AuthContextType {
    user: User | null;
    login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; message?: string }>;
    register: (userData: { name: string; email: string; password: string; role: string }) => Promise<{ success: boolean; message?: string }>;
    logout: () => void;
    isAuthenticated: boolean;
    isHeadNurse: boolean;
    isNurse: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
            setUser(JSON.parse(userData));
        }
        setLoading(false);
    }, []);

    const login = async (credentials: { email: string; password: string }) => {
        try {
            const response = await loginApi(credentials);
            const { token, user } = response;

            if (token && user) {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));

                setUser(user);
                toast.success('Login successful');
                return { success: true };
            } else {
                return { success: false, message: response.message || 'Login failed' };
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
            return { success: false, message };
        }
    };

    const register = async (userData: { name: string; email: string; password: string; role: string }) => {
        try {
            const response = await registerApi(userData);
            const { token, user } = response;

            if (token && user) {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));

                setUser(user);
                toast.success('Registration successful');
                return { success: true };
            } else {
                return { success: false, message: response.message || 'Registration failed' };
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'Registration failed';
            toast.error(message);
            return { success: false, message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        toast.success('Logged out successfully');
    };

    const value: AuthContextType = {
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isHeadNurse: user?.role === 'head_nurse',
        isNurse: user?.role === 'nurse'
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};