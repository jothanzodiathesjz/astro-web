
import { useAuthStore } from '@/auth/store/Auth.store';
import router from '@/routes';

// Ganti URL ini dengan URL API Anda dari environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// --- STATE GLOBAL UNTUK ANTRIAN ---
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: any) => void; reject: (reason: any) => void }> = [];

// Fungsi untuk memproses antrean permintaan yang gagal
const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Fungsi yang menangani permintaan refresh token
const refreshAccessToken = async () => {
    const authStore = useAuthStore();

    // Jika proses refresh sedang berjalan, tambahkan ke antrean dan tunggu
    if (isRefreshing) {
        return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
        });
    }

    isRefreshing = true;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
            method: 'POST', // Gunakan POST untuk keamanan
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: authStore.refreshToken }),
        });

        if (!response.ok) throw new Error('Refresh token failed');
        const data = await response.json();

        // Simpan token baru di Pinia store
        authStore.setTokens(data.accessToken, data.refreshToken);

        // Beritahu semua permintaan di antrean bahwa refresh berhasil
        processQueue(null, data.accessToken);

        return data.accessToken;
    } catch (err) {
        // Jika refresh gagal, bersihkan semua data auth dan arahkan ke halaman login
        authStore.clearAuthData();
        router.push({ name: 'login' });

        // Tolak semua permintaan di antrean
        processQueue(err);
        throw err;
    } finally {
        isRefreshing = false;
    }
};

/**
 * Fungsi utama untuk semua permintaan API yang memerlukan otentikasi.
 * Mengelola token dan logika refresh secara otomatis.
 */
export const authFetch = async (url: string, options: RequestInit = {}) => {
    const authStore = useAuthStore();
    const headers = new Headers(options.headers);

    // Tambahkan token ke header jika ada
    if (authStore.accessToken) {
        headers.set('Authorization', `Bearer ${authStore.accessToken}`);
    }

    const finalOptions = { ...options, headers };

    try {
        const response = await fetch(`${API_BASE_URL}${url}`, finalOptions);

        // Tangani respons 401
        if (response.status === 401 && authStore.refreshToken) {
            try {
                // Tunggu hingga token baru tersedia dari fungsi refreshAccessToken
                const newAccessToken = await refreshAccessToken();

                // Ulangi permintaan asli dengan token baru
                headers.set('Authorization', `Bearer ${newAccessToken}`);
                return fetch(`${API_BASE_URL}${url}`, { ...options, headers });
            } catch (err) {
                // Jika refresh token gagal, lemparkan error
                return response;
            }
        }

        return response;
    } catch (err) {
        throw err;
    }
};