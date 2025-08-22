import { useAuthStore } from "@/auth/store/Auth.store";
import type { Response } from "@/http-client/response";

// src/api/httpRequest.ts

export class HttpRequest {
    private readonly baseUrl: string;
    private isRefreshing = false;
    private refreshSubscribers: Array<(token: string) => void> = [];

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl || 'https://api.example.com';
    }

    private async refreshToken(): Promise<string> {
        const authStore = useAuthStore();

        if (this.isRefreshing) {
            // Jika sedang refresh, return promise untuk menunggu token baru
            return new Promise<string>((resolve) => {
                this.refreshSubscribers.push((token: string) => {
                    resolve(token);
                });
            });
        }

        this.isRefreshing = true;

        try {
            const refreshToken = authStore.refreshToken;
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            const response = await fetch(`${this.baseUrl}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${refreshToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to refresh token');
            }

            const data = await response.json();

            if (data.token) {
                authStore.setToken(data.token);
                if (data.refreshToken) {
                    authStore.setRefreshToken(data.refreshToken);
                }

                // Notify semua subscribers yang menunggu token baru
                this.refreshSubscribers.forEach(callback => callback(data.token));
                this.refreshSubscribers = [];

                return data.token;
            } else {
                throw new Error('Invalid token response');
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
            // Logout user jika refresh token gagal
            authStore.logout();
            throw error;
        } finally {
            this.isRefreshing = false;
        }
    }

    private async request<T>(method: string, endpoint: string, options: RequestInit = {}, retryCount = 0): Promise<Response<T>> {
        const authStore = useAuthStore();
        const headers = new Headers(options.headers || {});
        headers.append('Content-Type', 'application/json');

        if (authStore.token) {
            headers.append('Authorization', `Bearer ${authStore.token}`);
        }

        const config: RequestInit = {
            method,
            headers,
            ...options,
        };

        try {
            const response = await fetch(`${this.baseUrl}/${endpoint}`, config);

            // Jika token expired, coba refresh
            if (response.status === 401 && retryCount === 0) {
                const errorData = await response.json().catch(() => ({}));

                // Cek jika error karena token expired
                if (errorData.code === 'TOKEN_EXPIRED' || errorData.message?.includes('token')) {
                    try {
                        const newToken = await this.refreshToken();

                        // Update header dengan token baru
                        headers.set('Authorization', `Bearer ${newToken}`);

                        // Retry request dengan token baru
                        return this.request<T>(method, endpoint, { ...options, headers }, retryCount + 1);
                    } catch (refreshError) {
                        console.error('Refresh token failed:', refreshError);
                        authStore.logout();
                        throw new Error('Session expired. Please login again.');
                    }
                }
            }

            if (!response.ok) {
                const errorData = await response.json() as Response<T>;
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            if (response.status === 204) {
                return {} as Response<T>;
            }

            return (await response.json()) as Response<T>;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    public GET<T>(endpoint: string, params?: Record<string, string>): Promise<Response<T>> {
        const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
        return this.request('GET', url);
    }

    public POST<T, B>(endpoint: string, body: B): Promise<Response<T>> {
        const options: RequestInit = { body: JSON.stringify(body) };
        return this.request('POST', endpoint, options);
    }

    public PUT<T, B>(endpoint: string, body: B): Promise<Response<T>> {
        const options: RequestInit = { body: JSON.stringify(body) };
        return this.request('PUT', endpoint, options);
    }

    public PATCH<T, B>(endpoint: string, body: B): Promise<Response<T>> {
        const options: RequestInit = { body: JSON.stringify(body) };
        return this.request('PATCH', endpoint, options);
    }

    public DELETE<T>(endpoint: string): Promise<Response<T>> {
        return this.request('DELETE', endpoint);
    }
}