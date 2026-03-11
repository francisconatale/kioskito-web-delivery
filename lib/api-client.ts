export class OfflineError extends Error {
    public readonly isOffline = true;
    constructor(message = "Sin conexión a internet") {
        super(message);
        this.name = "OfflineError";
    }
}

export const isOnline = () => {
    if (typeof window === 'undefined') return true;
    return navigator.onLine;
};

export const isOfflineError = (error: any): boolean => {
    if (!error) return false;
    if (error instanceof OfflineError || error.isOffline) return true;
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        return !navigator.onLine;
    }
    if (typeof window !== 'undefined' && !navigator.onLine) {
        return true;
    }
    return false;
};

export const safeFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    if (typeof window !== 'undefined' && !navigator.onLine) {
        throw new OfflineError();
    }
    try {
        const response = await fetch(input, init);
        return response;
    } catch (error: any) {
        if (typeof window !== 'undefined') {
            if (!navigator.onLine) {
                throw new OfflineError();
            }
            window.dispatchEvent(new CustomEvent('kioskito:network-error'));
        }
        throw error;
    }
};

export const API_URL = "/api";

export async function handleResponse(response: Response, options: { silent?: boolean } = {}) {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Error en la solicitud" }));
        let errorMessage = error.message || "Error en la solicitud";
        if (error.errors && Array.isArray(error.errors)) {
            errorMessage = error.errors.map((e: any) => e.defaultMessage || e.message).join(", ");
        } else if (error.error && typeof error.error === "string") {
            errorMessage = error.message ? error.message : `${error.error}: ${error.path || ""}`;
        }
        console.error("API Error detailed:", error);
        const err = new Error(errorMessage) as any;
        err.status = response.status;
        err.data = error;
        throw err;
    }

    if (response.status === 204) {
        return null;
    }

    const text = await response.text();
    if (!text || !text.trim()) {
        return null;
    }

    try {
        const result = JSON.parse(text);
        if (result && typeof result === 'object' && 'success' in result && 'data' in result) {
            if (typeof result.totalElements === 'number') {
                return result;
            }
            return result.data;
        }
        return result;
    } catch (e) {
        return null;
    }
}

export function getAuthHeaders(contentType: string = "application/json") {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem("auth_token") : null;
    return {
        ...(contentType && { "Content-Type": contentType }),
        ...(token && { "Authorization": `Bearer ${token}` })
    };
}

export const apiClient = {
    get: async <T = any>(url: string, options?: { params?: Record<string, any>, silent?: boolean }): Promise<{ data: T }> => {
        const queryParams = options?.params
            ? '?' + new URLSearchParams(options.params).toString()
            : '';
        const response = await safeFetch(`${API_URL}${url}${queryParams}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        const data = await handleResponse(response, { silent: options?.silent });
        return { data };
    },
    post: async <T = any>(url: string, body?: any, options?: { params?: Record<string, any>, silent?: boolean }): Promise<{ data: T }> => {
        const queryParams = options?.params
            ? '?' + new URLSearchParams(options.params).toString()
            : '';
        const response = await safeFetch(`${API_URL}${url}${queryParams}`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: body ? JSON.stringify(body) : undefined
        });
        const data = await handleResponse(response, { silent: options?.silent });
        return { data };
    },
    put: async <T = any>(url: string, body?: any, options?: { silent?: boolean }): Promise<{ data: T }> => {
        const response = await safeFetch(`${API_URL}${url}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: body ? JSON.stringify(body) : undefined
        });
        const data = await handleResponse(response, { silent: options?.silent });
        return { data };
    },
    patch: async <T = any>(url: string, body?: any, options?: { silent?: boolean }): Promise<{ data: T }> => {
        const response = await safeFetch(`${API_URL}${url}`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: body ? JSON.stringify(body) : undefined
        });
        const data = await handleResponse(response, { silent: options?.silent });
        return { data };
    },
    delete: async (url: string, options?: { silent?: boolean }): Promise<void> => {
        const response = await safeFetch(`${API_URL}${url}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        await handleResponse(response, { silent: options?.silent });
    }
};
