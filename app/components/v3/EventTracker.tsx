'use client';

import { useEffect } from 'react';

interface EventTrackerProps {
  eventName: string;
  eventParams?: Record<string, any>;
}

export function EventTracker({ eventName, eventParams = {} }: EventTrackerProps) {
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', eventName, eventParams);
    }
  }, [eventName, eventParams]);

  return null;
}
