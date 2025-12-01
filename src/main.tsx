import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeContext'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { apiCircuitBreakers } from './utils/circuitBreaker'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount: number, error: unknown) => {
        // Get circuit breaker for this query - using default for simplicity
        // In a production app, you might want to determine based on query context
        const circuitBreaker = apiCircuitBreakers.default;

        // Check if circuit breaker allows execution
        if (!circuitBreaker.canExecute()) {
          return false; // Don't retry if circuit is open
        }

        // Don't retry on 4xx errors (client errors)
        if (error && typeof error === 'object' && 'status' in error) {
          const status = (error as { status: number }).status;
          if (status >= 400 && status < 500) {
            return false;
          }
        }

        // Retry up to 3 times for other errors
        const shouldRetry = failureCount < 3;

        // Record failure for circuit breaker
        if (!shouldRetry) {
          circuitBreaker.recordFailure();
        }

        return shouldRetry;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: (failureCount: number, error: unknown) => {
        // For mutations, use a simple circuit breaker check
        const circuitBreaker = apiCircuitBreakers.default;
        if (!circuitBreaker.canExecute()) {
          return false;
        }

        // Don't retry mutations on client errors
        if (error && typeof error === 'object' && 'status' in error) {
          const status = (error as { status: number }).status;
          if (status >= 400 && status < 500) {
            return false;
          }
        }
        // Retry mutations once
        return failureCount < 1;
      },
      retryDelay: 1000,
      onSuccess: (_data: unknown, _variables: unknown, _context: unknown) => {
        // Record success
        apiCircuitBreakers.default.recordSuccess();
      },
      onError: (_error: unknown, _variables: unknown, _context: unknown) => {
        // Record failure
        apiCircuitBreakers.default.recordFailure();
      },
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
