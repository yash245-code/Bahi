"use strict";
// ═══════════════════════════════════════════════════════════
// Domain Event Bus Service — Modular asynchronous event dispatch
// Allows CRM and ERP modules to communicate without direct coupling.
// ═══════════════════════════════════════════════════════════
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var EventBusService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBusService = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
let EventBusService = EventBusService_1 = class EventBusService {
    logger = new common_1.Logger(EventBusService_1.name);
    bus$ = new rxjs_1.Subject();
    /**
     * Publish a domain event across the system.
     */
    publish(eventName, payload) {
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
    subscribe(eventName, handler) {
        return this.bus$
            .pipe((0, operators_1.filter)((event) => event.eventName === eventName))
            .subscribe(async (event) => {
            try {
                await handler(event.payload);
            }
            catch (err) {
                this.logger.error(`Error in event handler for ${eventName}: ${err.message}`, err.stack);
            }
        });
    }
};
exports.EventBusService = EventBusService;
exports.EventBusService = EventBusService = EventBusService_1 = __decorate([
    (0, common_1.Injectable)()
], EventBusService);
//# sourceMappingURL=event-bus.service.js.map