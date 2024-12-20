import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { User } from '../types/auth';
import { authAPI } from '../services/api/auth';

type AuthContextType = {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (token: string, user: User) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const isAuthenticated = !!token;

    // Check for existing token on app start
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const storedToken = await SecureStore.getItemAsync('userToken');
                const storedUser = await SecureStore.getItemAsync('user');
                
                if (storedToken && storedUser) {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                    router.push('/(main)/home');
                } else {
                    router.push('/');
                }
            } catch (error) {
                console.error('Error loading auth state:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (newToken: string, newUser: User) => {
        try {
            // Store in secure storage
            await SecureStore.setItemAsync('userToken', newToken);
            await SecureStore.setItemAsync('user', JSON.stringify(newUser));
            
            // Update state
            setToken(newToken);
            setUser(newUser);

            // Navigate to home screen
            router.replace('/(main)/home');
        } catch (error) {
            console.error('Error storing auth state:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            // Clear secure storage
            await SecureStore.deleteItemAsync('userToken');
            await SecureStore.deleteItemAsync('user');
            
            // Clear state
            setToken(null);
            setUser(null);
            
            // Navigate to login
            router.push('/');
        } catch (error) {
            console.error('Error clearing auth state:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            token, 
            isLoading, 
            isAuthenticated, 
            login, 
            logout 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
