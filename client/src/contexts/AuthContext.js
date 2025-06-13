'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { adminAPI } from '@/lib/api-functions';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = Cookies.get('adminToken');
            if (token) {
                const response = await adminAPI.getProfile();
                setAdmin(response.data.data);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            Cookies.remove('adminToken');
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            const response = await adminAPI.login(credentials);
            const { admin, accessToken } = response.data.data;

            // Store token in cookie
            Cookies.set('adminToken', accessToken, { expires: 7 });
            setAdmin(admin);

            return { success: true, admin };
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await adminAPI.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            Cookies.remove('adminToken');
            setAdmin(null);
        }
    };

    const value = {
        admin,
        loading,
        login,
        logout,
        isAuthenticated: !!admin,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
