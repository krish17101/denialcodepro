'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const key = 'dcp.analytics.v1';
const pages: Record<string, string> = {
  '/': 'home',
  '/guides': 'guides',
  '/guides/find-the-claim-response': 'response',
  '/guides/choose-a-correction-or-review': 'correction',
  '/guides/build-a-deadline-evidence-record': 'deadline',
};
const live = () => location.origin === 'https://denialcodepro.com';
function allowed() {
  try { return live() && localStorage.getItem(key) === 'allow'; }
  catch { return false; }
}

export function Analytics({ production }: { production: boolean }) {
  const path = usePathname();
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    function sync() { setEnabled(production && allowed()); }
    sync();
    window.addEventListener('storage', sync);
    window.addEventListener('pageshow', sync);
    window.addEventListener(key, sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('pageshow', sync);
      window.removeEventListener(key, sync);
    };
  }, [production]);
  const id = path && Object.hasOwn(pages, path) ? pages[path] : null;
  // The tag runs in a separate document: it has no search UI, outbound links or forms.
  return production && enabled && id
    ? <iframe hidden aria-hidden="true" title="Optional site measurement" key={id}
        referrerPolicy="no-referrer" src={'/site-measurement.html#' + id} /> : null;
}

export function AnalyticsChoice({ production }: { production: boolean }) {
  const [ready, setReady] = useState(false);
  const [on, setOn] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    function sync() { setReady(production && live()); setOn(allowed()); }
    sync();
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, [production]);
  if (!ready) return null;
  return <div><button type="button" aria-pressed={on} className="rounded border px-3 py-2 font-semibold"
    onClick={() => {
      try {
        localStorage.setItem(key, on ? 'deny' : 'allow');
        setOn(!on); setError(false); window.dispatchEvent(new Event(key));
      } catch { setError(true); }
    }}>Optional analytics: {on ? 'on' : 'off'}</button>
    <p className="mt-2" role="status">{error ? 'Your browser could not save that change.' : 'Select the button to change your choice for this browser.'}</p></div>;
}
