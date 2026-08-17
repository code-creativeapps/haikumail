/**
 * The HaikuEmail mark.
 *
 * Three lines in 5-7-5 proportion, held in a rounded square that stands in for
 * the envelope — the two halves of the name in one shape. Solid rather than
 * outlined: the first version drew the envelope as an outline too, and at 32px
 * the outline and the lines merged into a single grey blob. Three strokes on a
 * filled ground, with the gaps wider than the strokes, is what survives being
 * 16px in a browser tab.
 *
 * Kept in step with `static/icons/icon.svg`, which is the same drawing at the
 * sizes the manifest asks for.
 *
 * The wordmark sets "Haiku" in the serif the poems are set in and "Email" in
 * the interface sans — the same split the app itself makes.
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
      <span className="hk-wordmark-sans">Email</span>
    </span>
  )
}

/**
 * The same mark as a favicon, so the tab reads as this app rather than as a
 * Gmail with an unread count in it. Colours are baked in — a data URI has no
 * access to the page's custom properties — and `prefers-color-scheme` is
 * carried inside the SVG so the tab icon follows the browser's theme.
 */
export const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<style>
  .ground { fill: #46596b }
  .lines { stroke: #f7f5f1 }
  @media (prefers-color-scheme: dark) {
    .ground { fill: #8ba3b7 }
    .lines { stroke: #12161a }
  }
</style>
<rect class="ground" width="128" height="128" rx="30"/>
<g class="lines" stroke-width="11" stroke-linecap="round">
<path d="M44 42h40"/><path d="M36 64h56"/><path d="M44 86h40"/>
</g>
</svg>`
