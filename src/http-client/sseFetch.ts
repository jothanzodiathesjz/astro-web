import { useAuthStore } from "@/auth/store/Auth.store";

export type SseFetchOptions = RequestInit & {
    timeoutMs?: number;
};

/**
 * Helper fetch untuk SSE yang otomatis menyetel header auth dan opsi umum.
 */
export async function fetchSse(
    input: RequestInfo | URL,
    options: SseFetchOptions = {},
): Promise<Response> {
    const { timeoutMs, headers: initHeaders, ...rest } = options;
    const headers = new Headers(initHeaders || {});
    const authStore = useAuthStore();

    if (authStore.token) {
        headers.set("Authorization", `Bearer ${authStore.token}`);
    }
    headers.set("Accept", "text/event-stream");
    headers.set("Cache-Control", "no-cache");
    headers.set("ngrok-skip-browser-warning", "true");

    const config: RequestInit = {
        method: rest.method ?? "GET",
        ...rest,
        headers,
        referrerPolicy: rest.referrerPolicy ?? "no-referrer",
    };

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let abortController: AbortController | undefined;
    if (timeoutMs && !config.signal) {
        abortController = new AbortController();
        config.signal = abortController.signal;
        timeoutId = setTimeout(() => abortController?.abort(), timeoutMs);
    }

    try {
        const response = await fetch(input, config);
        return response;
    } finally {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    }
}
