'use client';

import { useState } from 'react';
import {
  MessageSquare,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

const WEB3FORMS_ACCESS_KEY = '6e91efd0-02f2-4740-b3a8-8cfd52c3719b';

export function FeedbackForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle'
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    const formData = new FormData(e.currentTarget);
    formData.append('access_key', WEB3FORMS_ACCESS_KEY);
    formData.append('subject', 'New Feedback — DenialCode Pro');
    formData.append('from_name', 'DenialCode Pro Website');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-7 w-7 text-emerald-600" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-emerald-900">
              Feedback Sent
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-emerald-800/80">
              Thank you for your feedback. Our team will review your message and
              get back to you if needed.
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-6 inline-flex items-center gap-2 rounded-lg border border-emerald-300 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-100"
            >
              Send Another Message
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-800 text-white">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-navy-800">
                Send Us Feedback
              </h3>
              <p className="text-sm text-slate-500">
                Found a typo, have a suggestion, or need a code added? Let us
                know.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="fb-name"
                  className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Name
                </label>
                <input
                  id="fb-name"
                  name="name"
                  type="text"
                  required
                  placeholder="Your name"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-navy-400 focus:ring-2 focus:ring-navy-400/20"
                />
              </div>
              <div>
                <label
                  htmlFor="fb-email"
                  className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Email
                </label>
                <input
                  id="fb-email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-navy-400 focus:ring-2 focus:ring-navy-400/20"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="fb-message"
                className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                Message
              </label>
              <textarea
                id="fb-message"
                name="message"
                required
                rows={4}
                placeholder="Tell us what you think..."
                className="mt-1.5 w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-navy-400 focus:ring-2 focus:ring-navy-400/20"
              />
            </div>

            {status === 'error' && (
              <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                Something went wrong. Please try again or email us directly at
                denialcodepro@gmail.com.
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-navy-800 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-navy-900 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Feedback'
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
