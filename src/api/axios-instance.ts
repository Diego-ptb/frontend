import axios, { type AxiosRequestConfig } from 'axios';
import { apiCircuitBreakers } from '../utils/circuitBreaker';

<<<<<<< HEAD
export const AXIOS_INSTANCE = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
=======
const getApiBaseUrl = (): string => {
    // Prefer Vite's import.meta.env when available
    try {
        // Use any casts to avoid TS errors in different environments
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const meta: any = (typeof import.meta !== 'undefined') ? import.meta : undefined;
        if (meta?.env?.VITE_API_BASE_URL) return meta.env.VITE_API_BASE_URL;
    } catch (e) {
        // ignore
    }

    // Fallback to Node-like process on test/CI environments
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const g: any = globalThis as any;
    if (g?.process?.env?.VITE_API_BASE_URL) return g.process.env.VITE_API_BASE_URL;

    return '';
};

export const AXIOS_INSTANCE = axios.create({
    baseURL: getApiBaseUrl(),
>>>>>>> 471294a (s)
});

AXIOS_INSTANCE.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Circuit breaker interceptor
AXIOS_INSTANCE.interceptors.request.use(async (config) => {
    // Determine which circuit breaker to use based on URL
    let circuitBreaker = apiCircuitBreakers.default;
    if (config.url?.includes('/inventory')) {
        circuitBreaker = apiCircuitBreakers.inventory;
    } else if (config.url?.includes('/marketplace')) {
        circuitBreaker = apiCircuitBreakers.marketplace;
    } else if (config.url?.includes('/trades')) {
        circuitBreaker = apiCircuitBreakers.trades;
    } else if (config.url?.includes('/catalog')) {
        circuitBreaker = apiCircuitBreakers.catalog;
    } else if (config.url?.includes('/users') || config.url?.includes('/auth')) {
        circuitBreaker = apiCircuitBreakers.users;
    }

    // Check circuit breaker state
    if (!circuitBreaker.canExecute()) {
        return Promise.reject(new Error('Circuit breaker is OPEN - service temporarily unavailable'));
    }

    return config;
});

AXIOS_INSTANCE.interceptors.response.use(
    (response) => {
        // Record success for circuit breaker
        let circuitBreaker = apiCircuitBreakers.default;
        if (response.config?.url?.includes('/inventory')) {
            circuitBreaker = apiCircuitBreakers.inventory;
        } else if (response.config?.url?.includes('/marketplace')) {
            circuitBreaker = apiCircuitBreakers.marketplace;
        } else if (response.config?.url?.includes('/trades')) {
            circuitBreaker = apiCircuitBreakers.trades;
        } else if (response.config?.url?.includes('/catalog')) {
            circuitBreaker = apiCircuitBreakers.catalog;
        } else if (response.config?.url?.includes('/users') || response.config?.url?.includes('/auth')) {
            circuitBreaker = apiCircuitBreakers.users;
        }

        circuitBreaker.recordSuccess();
        return response;
    },
    async (error) => {
        // Record failure for circuit breaker
        let circuitBreaker = apiCircuitBreakers.default;
        if (error.config?.url?.includes('/inventory')) {
            circuitBreaker = apiCircuitBreakers.inventory;
        } else if (error.config?.url?.includes('/marketplace')) {
            circuitBreaker = apiCircuitBreakers.marketplace;
        } else if (error.config?.url?.includes('/trades')) {
            circuitBreaker = apiCircuitBreakers.trades;
        } else if (error.config?.url?.includes('/catalog')) {
            circuitBreaker = apiCircuitBreakers.catalog;
        } else if (error.config?.url?.includes('/users') || error.config?.url?.includes('/auth')) {
            circuitBreaker = apiCircuitBreakers.users;
        }

        circuitBreaker.recordFailure();

        // Let React Query handle the retry logic
        return Promise.reject(error);
    }
);

export const customInstance = <T>(
    config: AxiosRequestConfig,
    options?: AxiosRequestConfig,
): Promise<T> => {
    const source = axios.CancelToken.source();
    const promise = AXIOS_INSTANCE({
        ...config,
        ...options,
        cancelToken: source.token,
    }).then(({ data }) => data);

    // @ts-expect-error - Adding cancel method to promise for query cancellation support
    promise.cancel = () => {
        source.cancel('Query was cancelled');
    };

    return promise;
};
