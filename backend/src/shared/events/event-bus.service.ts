// ═══════════════════════════════════════════════════════════
// Domain Event Bus Service — Modular asynchronous event dispatch
// Allows CRM and ERP modules to communicate without direct coupling.
// ═══════════════════════════════════════════════════════════

import { Injectable, Logger } from '@nestjs/common';
import { Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface DomainEvent<T = any> {
  eventName: string;
  timestamp: Date;
  payload: T;
}

@Injectable()
export class EventBusService {
  private readonly logger = new Logger(EventBusService.name);
  private readonly bus$ = new Subject<DomainEvent>();

  /**
   * Publish a domain event across the system.
   */
  publish<T>(eventName: string, payload: T): void {
    this.logger.debug(`[EventBus] Publishing ${eventName}`);
    this.bus$.next({
      eventName,
      timestamp: new Date(),
      payload,
    });
  }

  /**
   * Subscribe to specific domain events.
   */
  subscribe<T>(
    eventName: string,
    handler: (payload: T) => Promise<void> | void,
  ): Subscription {
    return this.bus$
      .pipe(filter((event) => event.eventName === eventName))
      .subscribe(async (event) => {
        try {
          await handler(event.payload);
        } catch (err: any) {
          this.logger.error(
            `Error in event handler for ${eventName}: ${err.message}`,
            err.stack,
          );
        }
      });
  }
}
