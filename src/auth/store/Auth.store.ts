// src/auth/store/Auth.store.ts
import { container } from '@/container/di';
import { TOKENS } from '@/container/tokens';
import type { DomainUser } from '@/domain/models/User';
import { throwExceptionFromStatusCode } from '@/http-client/exceptions';
import type { Response } from '@/http-client/response';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';


export const useAuthStore = defineStore('auth', () => {
    // State
    const token = ref<string | null>(localStorage.getItem('auth_token'));
    const refreshToken = ref<string | null>(localStorage.getItem('refresh_token'));
    const user = ref<DomainUser | null>(null);

    // Getters
    const isAuthenticated = computed(() => !!token.value && !!user.value);
    // const getUser = computed(() => user.value);
    // const getToken = computed(() => token.value);
    // const getRefreshToken = computed(() => refreshToken.value);

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

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    async function login(credentials: { username: string; email: string; password: string }) {
        try {
            // Panggil API login
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                const errorData = (await response
                    .json()
                    .catch(() => ({
                        message: `Error ${response.status}`,
                    }))) as Response<any>;
                throwExceptionFromStatusCode(response.status, errorData);
            }

            const data = (await response.json()) as Response<{ access_token: string; refresh_token: string }>;

            // Simpan token dan data pengguna di store dan localStorage
            setToken(data.data.access_token);
            setRefreshToken(data.data.refresh_token);

            // return true; // Berhasil
        } catch (error) {
            clearTokens(); // Pastikan data bersih jika gagal
            // return false; // Gagal
            throw error
        }
    }

    async function getUser() {
        if (user.value !== null) {
            return
        }
        try {
            const response = await container.get(TOKENS.UserRepository).getOne();
            user.value = response;
        } catch (error) {
            clearTokens();
            user.value = null;
        }
    }


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
        // getToken,
        // getRefreshToken,

        // Actions
        setToken,
        setRefreshToken,
        setUser,
        logout,
        clearTokens,
        loadUserFromStorage,
        saveUserToStorage,
        login
    };
});