interface CircuitBreakerState {
    failures: number;
    lastFailureTime: number;
    state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
}

class CircuitBreaker {
    private state: CircuitBreakerState = {
        failures: 0,
        lastFailureTime: 0,
        state: 'CLOSED'
    };

    private readonly failureThreshold: number;
    private readonly recoveryTimeout: number;

    constructor(failureThreshold = 5, recoveryTimeout = 60000) { // 5 failures, 60 seconds timeout
        this.failureThreshold = failureThreshold;
        this.recoveryTimeout = recoveryTimeout;
    }

    canExecute(): boolean {
        if (this.state.state === 'OPEN') {
            if (Date.now() - this.state.lastFailureTime > this.recoveryTimeout) {
                this.state.state = 'HALF_OPEN';
                return true;
            }
            return false;
        }
        return true;
    }

    recordSuccess() {
        this.state.failures = 0;
        this.state.state = 'CLOSED';
    }

    recordFailure() {
        this.state.failures++;
        this.state.lastFailureTime = Date.now();

        if (this.state.failures >= this.failureThreshold) {
            this.state.state = 'OPEN';
        }
    }

    getState() {
        return this.state.state;
    }

    getFailureCount() {
        return this.state.failures;
    }
}

// Global circuit breaker instances for different API endpoints
export const apiCircuitBreakers = {
    inventory: new CircuitBreaker(),
    marketplace: new CircuitBreaker(),
    trades: new CircuitBreaker(),
    catalog: new CircuitBreaker(),
    users: new CircuitBreaker(),
    default: new CircuitBreaker(),
};

// Helper function to get circuit breaker for a query key
export const getCircuitBreakerForQuery = (queryKey: readonly unknown[]): CircuitBreaker => {
    const key = queryKey[0] as string;
    if (key?.includes('inventory')) return apiCircuitBreakers.inventory;
    if (key?.includes('listings') || key?.includes('marketplace')) return apiCircuitBreakers.marketplace;
    if (key?.includes('trades')) return apiCircuitBreakers.trades;
    if (key?.includes('catalog')) return apiCircuitBreakers.catalog;
    if (key?.includes('users') || key?.includes('auth')) return apiCircuitBreakers.users;
    return apiCircuitBreakers.default;
};