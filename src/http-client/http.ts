import {
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from "./exceptions";
import { UnprocessableEntityException } from "@/http-client/exceptions";
import type { RequestMethod } from "./misc";
import { type IQueryMetadata, QueryMetadata } from "./query-metadata";
import type { Response } from "./response";

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

export class HttpClient {
    constructor(
        public base_url: string = import.meta.env.VITE_API_URL,
        public refreshing = false,
        public options: RequestInit = {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            mode: "cors",
        },
    ) {
        console.log("HTTP Client Constructed with base_url: ", base_url);
        console.log("HTTP refreshing token status: ", refreshing);
    }

    // public async logout() {
    //     localStorage.removeItem("token");
    // }

    // public async login(credential: {
    //     username?: string;
    //     email?: string;
    //     password: string;
    // }) {
    //     if (
    //         credential.username === undefined &&
    //         credential.email === undefined
    //     ) {
    //         throw new Error("Username or Email must be provided");
    //     }
    //     const response = await this.POST("/login", {
    //         body: JSON.stringify(credential),
    //     });

    //     if (!response.success) {
    //         switch (response.code) {
    //             case 422:
    //                 throw new UnprocessableEntityException(response);
    //             default:
    //                 throw new Error("Unknown error");
    //         }
    //     }

    //     localStorage.setItem("token", JSON.stringify(response.data ?? "{}"));
    // }

    private async refresh_token(): Promise<string> {
        // Cek jika proses refresh sedang berjalan
        if (isRefreshing) {
            // Jika ya, tambahkan permintaan ke antrean dan tunggu
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            });
        }

        isRefreshing = true;
        const refreshToken = JSON.parse(localStorage.getItem("token") ?? "{}")?.refresh_token;

        if (!refreshToken) {
            isRefreshing = false;
            // Jika tidak ada refresh token, langsung tolak semua permintaan
            processQueue(new UnauthorizedException({ success: false, code: 401, message: "No refresh token" }));
            throw new UnauthorizedException({ success: false, code: 401, message: "No refresh token" });
        }

        try {
            const response = await fetch(`${this.base_url}/refresh`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${refreshToken}`,
                },
            });

            if (!response.ok) {
                throw new UnauthorizedException({ success: false, code: 401, message: "Refresh failed" });
            }

            const data = await response.json();
            const newAccessToken = data.data?.access_token;
            const newRefreshToken = data.data?.refresh_token;

            // Simpan token baru
            localStorage.setItem(
                "token",
                JSON.stringify({
                    access_token: newAccessToken,
                    refresh_token: newRefreshToken,
                }),
            );

            isRefreshing = false;
            // Beri tahu semua permintaan di antrean bahwa refresh berhasil
            processQueue(null, newAccessToken);
            return newAccessToken;

        } catch (e) {
            isRefreshing = false;
            // Beri tahu semua permintaan di antrean bahwa refresh gagal
            processQueue(e);
            throw e;
        } finally {
            isRefreshing = false; // Memastikan status selalu direset
        }
    }

    public async send(
        uri: string,
        method: RequestMethod,
        query?: IQueryMetadata,
        options?: RequestInit,
    ): Promise<Response> {
        const regex = new RegExp("^/");
        const queryParams = new QueryMetadata(query);
        const url =
            this.base_url +
            "/" +
            uri.replace(regex, "") +
            queryParams.toString();

        const access_token = JSON.parse(
            localStorage.getItem("token") ?? "{}",
        )?.access_token;

        // Buat objek headers baru untuk setiap permintaan
        const finalOptions = {
            ...this.options,
            ...options,
            mode: "cors" as RequestMode,
            method: method,
            headers: {
                ...this.options.headers,
                ...options?.headers,
            },
        };

        if (access_token) {
            finalOptions.headers = {
                ...finalOptions.headers,
                Authorization: `Bearer ${access_token}`,
            };
        }

        const response = await fetch(url, finalOptions);

        if (!response.ok) {
            const response_data = (await response.json()) as Response;

            // Logika baru untuk 401
            if (response_data.code === 401) {
                try {
                    // Panggil refresh token. Ini akan menunggu jika sedang dalam proses
                    const newAccessToken = await this.refresh_token();

                    // Ulangi permintaan asli dengan token baru
                    finalOptions.headers = {
                        ...finalOptions.headers,
                        Authorization: `Bearer ${newAccessToken}`,
                    };

                    const retryResponse = await fetch(url, finalOptions);
                    return retryResponse.json();

                } catch (e) {
                    throw e; // Lemparkan error jika refresh token gagal
                }
            }

            // Logika penanganan error lainnya tetap di sini
            switch (response_data.code) {
                case 404:
                    throw new NotFoundException(response_data);
                case 409:
                    throw new ConflictException(response_data);
                case 422:
                    throw new UnprocessableEntityException(response_data);
                case 500:
                    throw new InternalServerErrorException(response_data);
                default:
                    throw new Error("Unknown error");
            }

        } else {
            return response.json();
        }
    }

    async GET(
        uri: string,
        query?: IQueryMetadata,
        options?: RequestInit,
    ): Promise<Response> {
        return await this.send(uri, "GET", query, options);
    }

    async POST(
        uri: string,
        options?: RequestInit,
        query?: IQueryMetadata,
    ): Promise<Response> {
        return await this.send(uri, "POST", query, options);
    }

    async PATCH(
        uri: string,
        options?: RequestInit,
        query?: IQueryMetadata,
    ): Promise<Response> {
        return await this.send(uri, "PATCH", query, options);
    }

    async PATCH_WithAdminPassword(
        uri: string,
        options?: RequestInit,
        query?: IQueryMetadata,
    ): Promise<Response> {
        const admin_password = prompt("Admin Password");
        if (admin_password === null) {
            throw new Error("Admin Password is required");
        }
        return await this.send(
            uri,
            "PATCH",
            query,
            options ?? {
                headers: {
                    "Admin-Password": admin_password,
                },
            },
        );
    }

    async DELETE(
        uri: string,
        options?: RequestInit,
        query?: IQueryMetadata,
    ): Promise<Response> {
        return await this.send(uri, "DELETE", query, options);
    }

    async PUT(
        uri: string,
        options?: RequestInit,
        query?: IQueryMetadata,
    ): Promise<Response> {
        return await this.send(uri, "PUT", query, options);
    }
}
