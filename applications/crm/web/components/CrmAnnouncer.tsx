'use client';

interface CrmAnnouncerProps {
  message: string | null;
}

/**
 * Screen reader live region component for announcing dynamic CRM state updates
 * (e.g. stage movements, lead conversions, modal openings, toast messages)
 * without visual clutter. Complies with WCAG 2.1 AA 4.1.3 Status Messages.
 */
export function CrmAnnouncer({ message }: CrmAnnouncerProps) {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
      role="status"
    >
      {message || ''}
    </div>
  );
}
