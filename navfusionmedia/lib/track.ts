type TrackWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
};

/** Call from the browser after a successful form submission. */
export function trackLead(interest: string) {
  const w = window as TrackWindow;
  w.gtag?.("event", "generate_lead", { lead_interest: interest });
  w.fbq?.("track", "Lead", { content_category: interest });
}
