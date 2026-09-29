import { AnalyticsEvent } from '../types';
import { getAttribution } from './attribution';

type EventName = AnalyticsEvent['event_name'];

export async function trackEvent(eventName: EventName, metadata?: Record<string, any>) {
  const attribution = getAttribution();
  const payload = {
    event_name: eventName,
    metadata: {
      ...metadata,
      attribution,
      url: window.location.href,
      path: window.location.pathname,
      timestamp: new Date().toISOString()
    }
  };

  try {
    // Send to backend
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(() => {
      // ignore transient analytics failures
    });

    // Also dispatch to window for in-app live event toast/monitor
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('atelier:analytics', {
          detail: { eventName, payload }
        })
      );
    }
  } catch (err) {
    console.debug('Analytics error:', err);
  }
}
