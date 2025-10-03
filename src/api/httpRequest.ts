import { useAuthStore } from "@/auth/store/Auth.store";
import {
    throwExceptionFromStatusCode,
    UnauthorizedException,
} from "@/http-client/exceptions";
import type { Response } from "@/http-client/response";

// src/api/httpRequest.ts

export class HttpRequest {
    private readonly baseUrl: string;
    private readonly timeoutMs: number;
    private isRefreshing = false;
    private refreshSubscribers: Array<{
        resolve: (token: string) => void;
        reject: (err: unknown) => void;
    }> = [];

    constructor(baseUrl: string, timeoutMs = 20000) {
        this.baseUrl = baseUrl || "https://api.example.com";
        this.timeoutMs = timeoutMs;
    }

    private async refreshToken(): Promise<string> {
        const authStore = useAuthStore();

        if (this.isRefreshing) {
            // Jika sedang refresh, return promise yang resolve/reject saat refresh selesai
            return new Promise<string>((resolve, reject) => {
                this.refreshSubscribers.push({ resolve, reject });
            });
        }

        this.isRefreshing = true;

        try {
            const refreshToken = authStore.refreshToken;
            if (!refreshToken) {
                throw new Error("No refresh token available");
            }

            const response = await fetch(`${this.baseUrl}/refresh`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${refreshToken}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to refresh token");
            }

            const data = (await response.json()) as Response<{
                access_token: string;
                refresh_token: string;
            }>;

            if (data.data.access_token) {
                authStore.setToken(data.data.access_token);
                if (data.data.refresh_token) {
                    authStore.setRefreshToken(data.data.refresh_token);
                }

                // Notify semua subscribers yang menunggu token baru
                this.refreshSubscribers.forEach(({ resolve }) =>
                    resolve(data.data.access_token),
                );
                this.refreshSubscribers = [];

                return data.data.access_token;
            } else {
                throw new Error("Invalid token response");
            }
        } catch (error) {
            console.error("Token refresh failed:", error);
            // Reject semua subscribers yang menunggu
            this.refreshSubscribers.forEach(({ reject }) => reject(error));
            this.refreshSubscribers = [];
            // Logout user jika refresh token gagal
            authStore.logout();
            throw error;
        } finally {
            this.isRefreshing = false;
        }
    }

    private async request<T>(
        method: string,
        endpoint: string,
        options: RequestInit = {},
        retryCount = 0,
    ): Promise<Response<T>> {
        const authStore = useAuthStore();
        const headers = new Headers(options.headers || {});

        // Set Content-Type only when sending JSON body (avoid overriding FormData)
        const hasBody = options.body !== undefined && options.body !== null;
        if (
            hasBody &&
            !(options.body instanceof FormData) &&
            !headers.has("Content-Type")
        ) {
            headers.set("Content-Type", "application/json");
        }

        if (authStore.token) {
            headers.set("Authorization", `Bearer ${authStore.token}`);
        }

        const config: RequestInit = {
            method,
            headers,
            ...options,
        };

        // Compose URL safely without duplicate slashes
        const base = this.baseUrl.replace(/\/+$/, "");
        const path = endpoint.replace(/^\/+/, "");
        const urlToFetch = `${base}/${path}`;

        // Default timeout unless caller supplied a signal
        let timeoutId: ReturnType<typeof setTimeout> | undefined;
        if (!config.signal) {
            const controller = new AbortController();
            config.signal = controller.signal;
            timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);
        }

        const response = await fetch(urlToFetch, config).finally(() => {
            if (timeoutId) clearTimeout(timeoutId);
        });
        if (!response.ok) {
            // Jika token expired, coba refresh
            if (response.status === 401 && retryCount === 0) {
                // const errorData = (await response.json()) as Response<T>;
                // Periksa apakah error ini memang karena token expired
                // const isTokenExpiredError =
                //     errorData?.message?.includes("token") ||
                //     (errorData as any)?.code === "TOKEN_EXPIRED";
                try {
                    const newToken = await this.refreshToken();
                    // Lanjutkan dengan retry request
                    headers.set("Authorization", `Bearer ${newToken}`);
                    return this.request<T>(
                        method,
                        endpoint,
                        { ...options, headers },
                        retryCount + 1,
                    );
                } catch (refreshError) {
                    // Jika refresh token gagal, lempar UnauthorizedException
                    const errorBody = {
                        message:
                            "Sesi Anda telah berakhir. Silakan masuk kembali.",
                    };
                    throw new UnauthorizedException(errorBody as Response<T>);
                }

                //     // Cek jika error karena token expired
                //     if (isTokenExpiredError) {
                //   }
            }
            const errorData = (await response.json().catch(() => ({
                message: `Error ${response.status}`,
            }))) as Response<T>;
            throw throwExceptionFromStatusCode(response.status, errorData);
        } else {
            // Tangani 204 atau response non-JSON agar tidak melempar error parsing
            if (response.status === 204) {
                return {
                    success: true,
                    code: 204,
                    message: "",
                    data: undefined as unknown as T,
                } as Response<T>;
            }
            const contentType = response.headers.get("content-type") || "";
            if (contentType.includes("application/json")) {
                return (await response.json()) as Response<T>;
            }
            // Fallback: treat as empty success
            return {
                success: true,
                code: response.status,
                message: "",
                data: undefined as unknown as T,
            } as Response<T>;
        }
    }

    public GET<T>(
        endpoint: string,
        params?: Record<string, string | number | boolean | undefined | null>,
    ): Promise<Response<T>> {
        const searchParams = new URLSearchParams();

        if (params) {
            for (const key in params) {
                const value = params[key];
                if (value !== undefined && value !== null && value !== "") {
                    searchParams.append(key, String(value));
                }
            }
        }

        const queryString = searchParams.toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;

        return this.request("GET", url);
    }

    public POST<T, B>(endpoint: string, body: B): Promise<Response<T>> {
        const options: RequestInit = { body: JSON.stringify(body) };
        return this.request("POST", endpoint, options);
    }

    public PUT<T, B>(endpoint: string, body: B): Promise<Response<T>> {
        const options: RequestInit = { body: JSON.stringify(body) };
        return this.request("PUT", endpoint, options);
    }

    public PATCH<T, B>(endpoint: string, body: B): Promise<Response<T>> {
        const options: RequestInit = { body: JSON.stringify(body) };
        return this.request("PATCH", endpoint, options);
    }

    public DELETE<T>(endpoint: string): Promise<Response<T>> {
        return this.request("DELETE", endpoint);
    }
}
