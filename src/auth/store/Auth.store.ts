// src/auth/store/Auth.store.ts
import type { DomainUser } from '@/domain/models/user';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';


export const useAuthStore = defineStore('auth', () => {
    // State
    const token = ref<string | null>(localStorage.getItem('auth_token'));
    const refreshToken = ref<string | null>(localStorage.getItem('refresh_token'));
    const user = ref<DomainUser | null>(null);

    // Getters
    const isAuthenticated = computed(() => !!token.value);
    const getUser = computed(() => user.value);
    const getToken = computed(() => token.value);
    const getRefreshToken = computed(() => refreshToken.value);

    // Actions
    const setToken = (newToken: string) => {
        token.value = newToken;
        localStorage.setItem('auth_token', newToken);
    };

    const setRefreshToken = (newRefreshToken: string) => {
        refreshToken.value = newRefreshToken;
        localStorage.setItem('refresh_token', newRefreshToken);
    };

    const setUser = (userData: DomainUser) => {
        user.value = userData;
    };

    const logout = () => {
        token.value = null;
        refreshToken.value = null;
        user.value = null;
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        // Redirect to login page atau lakukan navigasi di sini
    };

    const clearTokens = () => {
        token.value = null;
        refreshToken.value = null;
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
    };

    // Optional: Load user data from localStorage jika diperlukan
    const loadUserFromStorage = () => {
        const storedUser = localStorage.getItem('user_data');
        if (storedUser) {
            try {
                user.value = JSON.parse(storedUser);
            } catch (error) {
                console.error('Failed to parse user data from storage:', error);
                localStorage.removeItem('user_data');
            }
        }
    };

    // Optional: Save user data to localStorage
    const saveUserToStorage = (userData: DomainUser) => {
        user.value = userData;
        localStorage.setItem('user_data', JSON.stringify(userData));
    };

    return {
        // State
        token,
        refreshToken,
        user,

        // Getters
        isAuthenticated,
        getUser,
        getToken,
        getRefreshToken,

        // Actions
        setToken,
        setRefreshToken,
        setUser,
        logout,
        clearTokens,
        loadUserFromStorage,
        saveUserToStorage
    };
});