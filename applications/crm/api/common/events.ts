// ═══════════════════════════════════════════════════════════
// CRM Domain Event Dispatcher (Decoupled within @bahi/app-crm)
// ═══════════════════════════════════════════════════════════

import { Injectable, Logger } from '@nestjs/common';
import { Subject } from 'rxjs';

export interface CrmDomainEvent<T = any> {
  eventName: string;
  timestamp: Date;
  payload: T;
}

@Injectable()
export class CrmEventBus {
  private readonly logger = new Logger(CrmEventBus.name);
  private readonly bus$ = new Subject<CrmDomainEvent>();

  publish<T>(eventName: string, payload: T): void {
    this.logger.debug(`[CrmEventBus] Emitting ${eventName}`);
    this.bus$.next({
      eventName,
      timestamp: new Date(),
      payload,
    });
  }

  get events$() {
    return this.bus$.asObservable();
  }
}
