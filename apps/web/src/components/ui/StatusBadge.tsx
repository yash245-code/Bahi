type StatusVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const variantClasses: Record<StatusVariant, { badge: string; dot: string }> = {
  success: {
    badge: 'badge-success',
    dot: 'bg-[#1F7A4D]',
  },
  warning: {
    badge: 'badge-warning',
    dot: 'bg-[#B8790A]',
  },
  danger: {
    badge: 'badge-danger',
    dot: 'bg-[#B23A2E]',
  },
  info: {
    badge: 'badge-info',
    dot: 'bg-[#75766E]',
  },
  neutral: {
    badge: 'badge-neutral',
    dot: 'bg-[#9A9B93]',
  },
};

interface StatusBadgeProps {
  label: string;
  variant?: StatusVariant;
}

export function StatusBadge({ label, variant = 'neutral' }: StatusBadgeProps) {
  const config = variantClasses[variant];

  return (
    <span className={`badge ${config.badge} gap-1.5`}>
      {variant === 'danger' ? (
        // Alert icon specifically for Danger to differentiate from Rust accent
        <svg className="w-3 h-3 text-[#B23A2E] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ) : (
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot} flex-shrink-0`} />
      )}
      <span>{label}</span>
    </span>
  );
}
