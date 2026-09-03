/**
 * Section marks.
 *
 * One small drawing per section, sitting in the left gutter beside the text.
 * They are held to the same rules as the logo: a 96 unit square, 2 unit
 * strokes with round ends, and no more than one accent colour per drawing —
 * at this size anything busier collapses into a grey smudge.
 *
 * Each one shows the mechanism the section describes rather than illustrating
 * the noun. The reading mark is a page with the tracking pixel struck out; the
 * privacy mark is a wall an arrow does not get through. That is the difference
 * between decoration and a second explanation.
 *
 * Colours come from the page's own tokens, so they follow light and dark.
 */

const S = {
  fill: 'none',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 96 96" className="hk-mark" aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}

/** The wait: a poem held inside a timer that has most of its way to run. */
export const MarkWait = () => (
  <Frame>
    <circle cx="48" cy="48" r="34" stroke="var(--hk-line-strong)" {...S} />
    <path d="M48 14a34 34 0 0 1 30 20" stroke="var(--hk-accent)" {...S} />
    <g stroke="var(--hk-ink-soft)" {...S}>
      <path d="M34 40h20" />
      <path d="M30 48h32" />
      <path d="M34 56h20" />
    </g>
  </Frame>
)

/** Search only: one field, and nothing underneath it until you ask. */
export const MarkSearch = () => (
  <Frame>
    <rect x="14" y="24" width="68" height="22" rx="11" stroke="var(--hk-line-strong)" {...S} />
    <circle cx="31" cy="35" r="6" stroke="var(--hk-accent)" {...S} />
    <path d="m35.5 39.5 4 4" stroke="var(--hk-accent)" {...S} />
    <g stroke="var(--hk-line)" strokeDasharray="3 5" {...S}>
      <path d="M14 60h68" />
      <path d="M14 72h68" />
    </g>
  </Frame>
)

/** Browse: kinds, not dates — three chips of honest different widths. */
export const MarkKinds = () => (
  <Frame>
    <rect x="12" y="26" width="34" height="16" rx="8" fill="var(--hk-accent)" stroke="none" />
    <g stroke="var(--hk-line-strong)" {...S}>
      <rect x="52" y="26" width="32" height="16" rx="8" />
      <rect x="12" y="50" width="26" height="16" rx="8" />
      <rect x="44" y="50" width="40" height="16" rx="8" />
    </g>
  </Frame>
)

/** Reading: a message with the tracking pixel struck out. */
export const MarkReading = () => (
  <Frame>
    <rect x="18" y="14" width="60" height="68" rx="6" stroke="var(--hk-line-strong)" {...S} />
    <g stroke="var(--hk-ink-soft)" {...S}>
      <path d="M28 32h30" />
      <path d="M28 44h40" />
      <path d="M28 56h34" />
    </g>
    <circle cx="31" cy="70" r="4.5" stroke="var(--hk-accent)" {...S} />
    <path d="m27 74 8-8" stroke="var(--hk-accent)" {...S} />
  </Frame>
)

/** Not a prison: the wall has a door, and the way back in is the same door. */
export const MarkDoor = () => (
  <Frame>
    <path d="M20 20v56M76 20v22" stroke="var(--hk-line-strong)" {...S} />
    <path d="M20 20h56M20 76h56" stroke="var(--hk-line-strong)" {...S} />
    <path d="M76 76V60" stroke="var(--hk-line-strong)" {...S} />
    <path d="M62 44h24m-8-7 8 7-8 7" stroke="var(--hk-accent)" {...S} />
  </Frame>
)

/** The tab: a browser tab with its badge struck through. */
export const MarkTab = () => (
  <Frame>
    <path d="M12 38h34a6 6 0 0 0 6-6V26a6 6 0 0 1 6-6h26" stroke="var(--hk-line-strong)" {...S} />
    <path d="M12 38v34h72V20" stroke="var(--hk-line-strong)" {...S} />
    <circle cx="66" cy="52" r="10" stroke="var(--hk-line)" {...S} />
    <path d="m59 59 14-14" stroke="var(--hk-accent)" {...S} />
  </Frame>
)

/** Nothing leaves: a boundary an arrow does not get through. */
export const MarkSealed = () => (
  <Frame>
    <rect x="14" y="18" width="52" height="60" rx="8" stroke="var(--hk-line-strong)" {...S} />
    <g stroke="var(--hk-ink-soft)" {...S}>
      <path d="M26 36h28" />
      <path d="M26 48h28" />
      <path d="M26 60h18" />
    </g>
    <path d="M82 30v36" stroke="var(--hk-accent)" {...S} />
    <path d="M70 48h6" stroke="var(--hk-accent)" strokeDasharray="2 5" {...S} />
  </Frame>
)

/** The poems: five, seven, five. */
export const MarkPoem = () => (
  <Frame>
    <g fill="var(--hk-ink-soft)" stroke="none">
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={`a${i}`} cx={26 + i * 11} cy="32" r="2.5" />
      ))}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <circle key={`b${i}`} cx={15 + i * 11} cy="48" r="2.5" />
      ))}
    </g>
    <g fill="var(--hk-accent)" stroke="none">
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={`c${i}`} cx={26 + i * 11} cy="64" r="2.5" />
      ))}
    </g>
  </Frame>
)

/** The app: the places an extension cannot reach. */
export const MarkApp = () => (
  <Frame>
    <rect x="10" y="24" width="46" height="34" rx="4" stroke="var(--hk-line-strong)" {...S} />
    <path d="M24 66h18" stroke="var(--hk-line-strong)" {...S} />
    <path d="M33 58v8" stroke="var(--hk-line-strong)" {...S} />
    <rect x="62" y="34" width="24" height="40" rx="5" stroke="var(--hk-accent)" {...S} />
    <path d="M70 68h8" stroke="var(--hk-accent)" {...S} />
  </Frame>
)
