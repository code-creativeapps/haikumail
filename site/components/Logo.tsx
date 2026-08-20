/**
 * The mark and the wordmark, kept in step with src/app/Logo.tsx in the
 * extension and static/icons/icon.svg. Twelve lines of JSX is cheaper to copy
 * than to share across the /site boundary — but if the drawing changes, it
 * changes in three places.
 *
 * Three lines in 5-7-5 proportion inside a rounded square that stands in for
 * the envelope: the two halves of the name in one shape.
 */

export function LogoMark({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      aria-hidden="true"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <rect width="128" height="128" rx="30" fill="var(--hk-mark-bg)" />
      <g stroke="var(--hk-mark-ink)" strokeWidth="10" strokeLinecap="round">
        <path d="M44 42h40" />
        <path d="M36 64h56" />
        <path d="M44 86h40" />
      </g>
    </svg>
  )
}

export function Wordmark() {
  return (
    <span className="hk-wordmark">
      <span className="hk-wordmark-serif">Haiku</span>
      <span className="hk-wordmark-sans">Mail</span>
    </span>
  )
}

export function Lockup({ size = 24 }: { size?: number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
      <LogoMark size={size} />
      <Wordmark />
    </span>
  )
}
