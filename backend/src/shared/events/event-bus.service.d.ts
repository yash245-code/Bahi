import { Subscription } from 'rxjs';
export interface DomainEvent<T = any> {
    eventName: string;
    timestamp: Date;
    payload: T;
}
export declare class EventBusService {
    private readonly logger;
    private readonly bus$;
    /**
     * Publish a domain event across the system.
     */
    publish<T>(eventName: string, payload: T): void;
    /**
     * Subscribe to specific domain events.
     */
    subscribe<T>(eventName: string, handler: (payload: T) => Promise<void> | void): Subscription;
}
//# sourceMappingURL=event-bus.service.d.ts.map