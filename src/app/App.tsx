import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Box,
  Card,
  Flex,
  Heading,
  Progress,
  ScrollArea,
  SegmentedControl,
  Separator,
  Spinner,
  Text,
  Theme,
} from '@radix-ui/themes'
import { closeThread, openThread, search, type Message, type Row } from '../lib/gmail'
import { pickHaiku } from './haikus'
import { LogoMark, Wordmark } from './Logo'
import { useCoolDown } from './useCoolDown'

/**
 * 30 seconds, always, on Gmail itself. The `?fast` shortcut exists only for the
 * dev harness and is deliberately unreachable on mail.google.com.
 */
const COOL_DOWN_SECONDS =
  location.hostname !== 'mail.google.com' && location.search.includes('fast') ? 2 : 30

/** The shadow root can't inherit a theme, so resolve the OS preference here. */
const appearance = (): 'light' | 'dark' =>
  window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

type View ={ kind: 'idle' } | { kind: 'loading' } | { kind: 'results'; rows: Row[] } | { kind: 'reading'; message: Message }

export default function App({ onUnmask }: { onUnmask: () => void }) {
  const { remaining, locked, progress } = useCoolDown(COOL_DOWN_SECONDS)
  const [query, setQuery] = useState('')
  const [view, setView] = useState<View>({ kind: 'idle' })
  const lastQuery = useRef('')
  const inputRef = useRef<HTMLInputElement>(null)

  const runSearch = useCallback(async () => {
    const q = query.trim()
    if (!q || locked) return
    lastQuery.current = q
    setView({ kind: 'loading' })
    setView({ kind: 'results', rows: await search(q) })
  }, [query, locked])

  const read = useCallback(async (row: Row) => {
    setView({ kind: 'loading' })
    setView({ kind: 'reading', message: await openThread(row, lastQuery.current) })
  }, [])

  const back = useCallback(async () => {
    closeThread(lastQuery.current)
    setView({ kind: 'loading' })
    setView({ kind: 'results', rows: await search(lastQuery.current) })
  }, [])

  return (
    <Theme accentColor="gray" grayColor="sand" radius="small" scaling="100%" appearance={appearance()}>
      <Flex direction="column" align="center" style={{ minHeight: '100vh', padding: '10vh 24px 48px' }}>
        <Box style={{ width: '100%', maxWidth: 680 }}>
          <Masthead />

          {locked ? (
            <CoolDown remaining={remaining} progress={progress} />
          ) : (
            <SearchBar
              ref={inputRef}
              query={query}
              setQuery={setQuery}
              onSubmit={runSearch}
              busy={view.kind === 'loading'}
            />
          )}

          <Box mt="6">
            {view.kind === 'idle' && <Idle locked={locked} />}
            {view.kind === 'loading' && <Muted>Reading…</Muted>}
            {view.kind === 'results' && <Results rows={view.rows} onOpen={read} />}
            {view.kind === 'reading' && <Reader message={view.message} onBack={back} />}
          </Box>

          {!locked && (
            <Box mt="8" style={{ textAlign: 'center' }}>
              <button type="button" className="hk-unmask" onClick={onUnmask}>
                Unmask the real Gmail for this tab
              </button>
            </Box>
          )}
        </Box>
      </Flex>
    </Theme>
  )
}

function Masthead() {
  return (
    <Flex align="center" justify="between" mb="7">
      <Flex align="center" gap="2">
        <LogoMark />
        <Wordmark />
      </Flex>
      <ModeToggle />
    </Flex>
  )
}

/**
 * The mode switch, present but inert.
 *
 * There is only one mode today, so this is a real toggle showing its one real
 * option rather than a badge that would have to be replaced later. `Browse` is
 * a placeholder for the second mode — rename it here and in `MODES` when it
 * exists, and drop the `aria-disabled` wrapper to bring it to life.
 */
const MODES = [
  { value: 'search', label: 'Search only' },
  { value: 'browse', label: 'Browse' },
] as const

function ModeToggle() {
  return (
    <div className="hk-mode" title="Search only — other modes are coming">
      <SegmentedControl.Root size="1" value="search" aria-disabled="true" tabIndex={-1}>
        {MODES.map((mode) => (
          <SegmentedControl.Item key={mode.value} value={mode.value}>
            {mode.label}
          </SegmentedControl.Item>
        ))}
      </SegmentedControl.Root>
    </div>
  )
}

/**
 * The wait, given something to be.
 *
 * The haiku is the screen; the countdown is deliberately small and quiet at the
 * bottom, because a large ticking number is just another thing to stare at.
 */
function CoolDown({ remaining, progress }: { remaining: number; progress: number }) {
  const [haiku] = useState(pickHaiku)

  return (
    <Box>
      <Box style={{ minHeight: '10.5rem' }}>
        {haiku.lines.map((line, i) => (
          <p key={i} className="haiku-line" style={{ animationDelay: `${i * 260}ms` }}>
            {line}
          </p>
        ))}

        {/* Only translations carry a poet; the originals stay unsigned. The
            romaji rides along in `title` so the source can be checked without
            putting a second alphabet on a screen meant to be calm. */}
        {haiku.poet && (
          <p
            className="hk-attribution"
            title={haiku.romaji}
            style={{ animationDelay: `${haiku.lines.length * 260}ms`, marginTop: '1.35rem' }}
          >
            {haiku.poet}
            <span className="hk-ai-note">AI translation</span>
          </p>
        )}
      </Box>

      <Box mt="7">
        <Progress value={progress} size="1" color="gray" />
        <Flex justify="between" mt="2">
          <Text size="1" color="gray">
            Your inbox is loaded, and hidden. Nothing appears unless you ask for it.
          </Text>
          <Text size="1" color="gray" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {remaining}s
          </Text>
        </Flex>
      </Box>
    </Box>
  )
}

const MagnifierIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="7" cy="7" r="4.25" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const ArrowIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
    <path
      d="M3.5 7.5h8m0 0L8.25 4.25M11.5 7.5L8.25 10.75"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/**
 * One control rather than a field plus a button.
 *
 * The stock Radix field and a soft grey Button were two different design
 * languages sitting next to each other. This is a single bordered shell that
 * takes the focus ring itself, with the magnifier as a label and the submit
 * arrow only becoming solid once there is something to search for — so the
 * whole thing reads as one object.
 */
const SearchBar = ({
  ref,
  query,
  setQuery,
  onSubmit,
  busy,
}: {
  ref: React.Ref<HTMLInputElement>
  query: string
  setQuery: (v: string) => void
  onSubmit: () => void
  busy: boolean
}) => (
  <form
    onSubmit={(e) => {
      e.preventDefault()
      onSubmit()
    }}
  >
    <div className="hk-search">
      <span className="hk-search-icon">
        <MagnifierIcon />
      </span>
      <input
        ref={ref}
        className="hk-search-input"
        autoFocus
        spellCheck={false}
        autoComplete="off"
        aria-label="Search your mail"
        placeholder="from:anna invoice, newer_than:2d …"
        value={query}
        onChange={(e) => setQuery(e.currentTarget.value)}
      />
      <button className="hk-submit" type="submit" disabled={!query.trim() || busy} aria-label="Search">
        {busy ? <Spinner size="1" /> : <ArrowIcon />}
      </button>
    </div>
  </form>
)

function Idle({ locked }: { locked: boolean }) {
  if (locked) return null
  return (
    <Muted>
      Nothing is shown by default. Search for the one thing you came for — Gmail's own operators
      (<code>from:</code>, <code>has:attachment</code>, <code>newer_than:2d</code>) all work.
    </Muted>
  )
}

function Results({ rows, onOpen }: { rows: Row[]; onOpen: (row: Row) => void }) {
  if (!rows.length) return <Muted>No messages matched.</Muted>
  return (
    <Box>
      {/* Matches the list's own gutter so every rule ends on the same edge. */}
      <Box pr="4">
        <Text size="1" color="gray">
          {rows.length} {rows.length === 1 ? 'result' : 'results'}
        </Text>
        <Separator size="4" my="3" />
      </Box>
      {/* pr: the scrollbar is an overlay, so the content has to leave it room. */}
      <ScrollArea type="hover" scrollbars="vertical" style={{ maxHeight: '52vh' }}>
        <Flex direction="column" pr="4">
          {rows.map((row, i) => (
            <Box key={`${row.id}-${i}`}>
              {i > 0 && <Separator size="4" />}
              <Box
                role="button"
                tabIndex={0}
                className="hk-row"
                onClick={() => onOpen(row)}
                onKeyDown={(e) => e.key === 'Enter' && onOpen(row)}
              >
                <Flex justify="between" gap="4" align="baseline">
                  <Text
                    size="2"
                    weight={row.unread ? 'medium' : 'regular'}
                    color={row.unread ? undefined : 'gray'}
                    truncate
                  >
                    {row.sender}
                  </Text>
                  <Text size="1" color="gray" style={{ whiteSpace: 'nowrap' }}>
                    {row.date}
                  </Text>
                </Flex>
                <Text
                  as="p"
                  size="2"
                  mt="1"
                  truncate
                  className="hk-subject"
                  style={{ letterSpacing: '-0.005em' }}
                >
                  {row.subject}
                </Text>
                {row.snippet && (
                  <Text as="p" size="1" color="gray" mt="1" truncate style={{ opacity: 0.85 }}>
                    {row.snippet}
                  </Text>
                )}
              </Box>
            </Box>
          ))}
        </Flex>
      </ScrollArea>
    </Box>
  )
}

const VIEW_KEY = 'haiku-email:view'
type ViewMode = 'plain' | 'rich'

function Reader({ message, onBack }: { message: Message; onBack: () => void }) {
  const [mode, setMode] = useState<ViewMode>(
    () => (localStorage.getItem(VIEW_KEY) as ViewMode | null) ?? 'rich',
  )
  const paragraphs = useMemo(
    () => message.body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean),
    [message.body],
  )
  const canRender = Boolean(message.content)
  const showRich = canRender && mode === 'rich'

  const choose = (next: ViewMode) => {
    setMode(next)
    localStorage.setItem(VIEW_KEY, next)
  }

  return (
    <Box>
      <Flex justify="between" align="center">
        <button type="button" className="hk-back" onClick={onBack}>
          <span aria-hidden="true">←</span> Back to results
        </button>
        {canRender && (
          <SegmentedControl.Root size="1" value={mode} onValueChange={(v) => choose(v as ViewMode)}>
            <SegmentedControl.Item value="plain">Plain</SegmentedControl.Item>
            <SegmentedControl.Item value="rich">Original</SegmentedControl.Item>
          </SegmentedControl.Root>
        )}
      </Flex>
      <Card mt="4" variant="surface">
        {/* Same gutter as the scrolling body below it. */}
        <Box pr="4">
          <Heading size="3" weight="medium" mb="1" className="hk-subject-heading">
            {message.subject}
          </Heading>
          <Text as="p" size="1" color="gray" mb="4">
            {message.sender} · {message.date}
          </Text>
          <Separator size="4" mb="4" />
        </Box>
        <ScrollArea type="hover" scrollbars="vertical" style={{ maxHeight: '52vh' }}>
          <Box pr="4" className={showRich ? undefined : 'hk-plain-body'}>
            {showRich ? (
              <RichBody content={message.content!} />
            ) : (
              paragraphs.map((p, i) => (
                <Text as="p" key={i} mb="3" className="hk-plain-line">
                  {p}
                </Text>
              ))
            )}
          </Box>
        </ScrollArea>
      </Card>
    </Box>
  )
}

/**
 * The email's own markup, hosted in a shadow root of its own.
 *
 * Nesting a second shadow root inside ours is what makes this safe to look at:
 * the sender's CSS is sealed inside it and cannot restyle the reader, and our
 * Radix styling does not leak in and mangle their layout. React never manages
 * these nodes either, so its reconciliation stays out of the way.
 *
 * Everything here is built with DOM calls — no `innerHTML`, no
 * `dangerouslySetInnerHTML`. Gmail enforces Trusted Types, which makes both of
 * those throw on this origin.
 */
const MESSAGE_CSS = `
  :host { all: initial; display: block; color-scheme: light; }
  .message {
    background: #fff;
    color: #1a1a1a;
    font: 14px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    overflow-x: auto;
  }
  .message img { max-width: 100%; height: auto; }
  .message table { max-width: 100%; }
  .message a { color: #0b57d0; }
`

function RichBody({ content }: { content: Element }) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const shadow = host.shadowRoot ?? host.attachShadow({ mode: 'open' })

    const style = document.createElement('style')
    style.textContent = MESSAGE_CSS

    const wrapper = document.createElement('div')
    wrapper.className = 'message'
    // A copy each time, so toggling back and forth can't consume the original.
    wrapper.append(content.cloneNode(true))

    shadow.replaceChildren(style, wrapper)
  }, [content])

  return <div ref={hostRef} />
}

const Muted = ({ children }: { children: React.ReactNode }) => (
  <Text
    as="p"
    size="2"
    color="gray"
    // `pretty` keeps the last line from being a single orphaned word.
    style={{ lineHeight: 1.7, maxWidth: '54ch', textWrap: 'pretty' }}
  >
    {children}
  </Text>
)
