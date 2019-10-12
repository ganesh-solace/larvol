import { Injectable } from '@angular/core';

declare let ga: Function;
@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {
  constructor() {}
  // Common Service for tracking events
  public emitEvent(eventCategory: string,
    eventAction: string,
    eventLabel: string = null,
    eventValue: number = null) {
ga('send', 'event', { eventCategory,eventAction,eventLabel, eventValue });
}
}
