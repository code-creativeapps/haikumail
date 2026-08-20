import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { OPENING_HAIKU } from '@/lib/haiku'
import { TAGLINE } from '@/lib/site'

export const alt = 'HaikuMail — Gmail, behind a haiku'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OgImage() {
  // Satori has no access to system fonts, so `ui-serif` resolves to nothing and
  // the image silently renders in a default sans — which, on a page whose whole
  // argument is that the typography was chosen, is a bad way to be seen in a
  // Slack preview. The font has to be handed over as a buffer — and it has to be a *static*
  // instance: satori cannot read a variable font, and fails with an opaque
  // "cannot read properties of undefined" rather than saying so.
  const serif = await readFile(join(process.cwd(), 'assets', 'CrimsonText-Regular.ttf'))

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#faf9f7',
          padding: '72px 80px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <svg width="44" height="44" viewBox="0 0 128 128">
            <rect width="128" height="128" rx="30" fill="#46596b" />
            <g stroke="#f7f5f1" strokeWidth="10" strokeLinecap="round">
              <path d="M44 42h40" />
              <path d="M36 64h56" />
              <path d="M44 86h40" />
            </g>
          </svg>
          <span style={{ fontSize: 30, fontFamily: 'Crimson', color: '#1c1c19' }}>
            HaikuMail
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {OPENING_HAIKU.lines.map((line, i) => (
            <span
              key={i}
              style={{ fontSize: 56, fontFamily: 'Crimson', color: '#1c1c19', lineHeight: 1.45 }}
            >
              {line}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <span style={{ fontSize: 26, fontFamily: 'Crimson', color: '#56564f' }}>
            {TAGLINE}
          </span>
          <span style={{ fontSize: 20, color: '#8a8a82' }}>haikumail.app</span>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: 'Crimson', data: serif, style: 'normal', weight: 400 }] },
  )
}
