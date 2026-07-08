"use client";

import { useCallback, useEffect, useState } from "react";
import { ExternalLink, X } from "lucide-react";
import {
  detectInAppBrowser,
  getInAppBrowserMessage,
} from "@/lib/inAppBrowser";

export default function InAppBrowserModal() {
  const [open, setOpen] = useState(false);
  const [appName, setAppName] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const { isInApp, appName: detectedAppName } = detectInAppBrowser(
      navigator.userAgent,
    );

    if (!isInApp) return;

    setAppName(detectedAppName);
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="presentation"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="in-app-browser-title"
        aria-describedby="in-app-browser-description"
        className="relative w-full max-w-md bg-white rounded-2xl sm:rounded-[2rem] border border-neutral-100 shadow-2xl overflow-hidden"
      >
        <div className="flex items-start justify-between gap-3 px-5 sm:px-6 pt-5 sm:pt-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-amber-800">
            <ExternalLink className="h-3.5 w-3.5" />
            Open in browser
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 sm:px-6 pt-4 pb-5 sm:pb-6 space-y-4">
          <div className="space-y-2">
            <h2
              id="in-app-browser-title"
              className="text-xl sm:text-2xl font-bold text-[#101010] leading-tight"
            >
              {appName ? `Open Prepo outside ${appName}` : "Open Prepo in your browser"}
            </h2>
            <p
              id="in-app-browser-description"
              className="text-sm text-neutral-500 leading-relaxed"
            >
              {getInAppBrowserMessage(appName)}
            </p>
          </div>

          <div className="rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3 text-sm text-neutral-600 leading-relaxed">
            Tap the menu icon in the top corner, then choose{" "}
            <span className="font-semibold text-neutral-900">Open in browser</span>{" "}
            or <span className="font-semibold text-neutral-900">Open in Safari</span>.
          </div>

          <button
            type="button"
            onClick={copyLink}
            className="w-full rounded-full bg-[#101010] px-5 py-3 text-sm font-semibold text-white hover:bg-black/90 transition-colors"
          >
            {copied ? "Link copied" : "Copy page link"}
          </button>
        </div>
      </div>
    </div>
  );
}
