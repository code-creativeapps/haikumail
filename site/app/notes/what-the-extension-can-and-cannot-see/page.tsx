import type { Metadata } from 'next'
import Link from 'next/link'
import { Footer, Header } from '@/components/Chrome'
import { JsonLd } from '@/components/JsonLd'
import { noteBySlug } from '@/lib/notes'
import { REPO_URL, SITE_URL } from '@/lib/site'

const note = noteBySlug('what-the-extension-can-and-cannot-see')!

export const metadata: Metadata = {
  title: note.title,
  description: note.description,
  alternates: { canonical: `/notes/${note.slug}` },
  openGraph: { type: 'article', publishedTime: note.published },
}

export default function Note() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          '@id': `${SITE_URL}/notes/${note.slug}`,
          headline: note.title,
          description: note.description,
          datePublished: note.published,
          inLanguage: 'en',
          author: { '@type': 'Organization', name: 'HaikuMail' },
        }}
      />
      <Header />
      <main className="hk-shell hk-prose hk-narrow">
        <h1>{note.title}</h1>
        <p className="hk-note-meta">
          <time dateTime={note.published}>1 September 2026</time>
        </p>

        <p>
          Anything that sits between you and your inbox is asking for a great deal of
          trust. &ldquo;We respect your privacy&rdquo; is what everyone says, including
          the ones who do not. So here is the long version, with the parts you can check
          marked as such.
        </p>

        <h2>The whole manifest</h2>
        <p>An extension can only do what its manifest permits. This one asks for:</p>
        <pre className="hk-pre">
          <code>{`"host_permissions": ["https://mail.google.com/*"]`}</code>
        </pre>
        <p>
          That is the complete list. There is no <code>permissions</code> array at all
          — not <code>storage</code>, not <code>tabs</code>, not{' '}
          <code>webRequest</code>, not <code>&lt;all_urls&gt;</code>. One origin, and
          nothing else.
        </p>
        <p>
          The single most common thing to get wrong when reading a manifest is treating{' '}
          <em>can display</em> as <em>can collect</em>. So, precisely:
        </p>

        <h2>What it can see</h2>
        <ul>
          <li>
            <strong>The Gmail page in the tab you have open.</strong> It reads the
            message list and the message body out of the page&rsquo;s own DOM, because
            that is the only way to show you the message you searched for.
          </li>
          <li>
            <strong>Only while that tab is open.</strong> A content script exists only
            in the page. Close the tab and it stops existing — there is no background
            process, no service worker, nothing that runs when you are not there.
          </li>
        </ul>

        <h2>What it cannot see</h2>
        <ul>
          <li>
            <strong>Any other website.</strong> The single host permission is a hard
            boundary enforced by Chrome, not a promise we are making. On any other
            domain the extension is not loaded at all.
          </li>
          <li>
            <strong>Your mail when you are not looking at it.</strong> No token, no
            background sync, nothing overnight.
          </li>
          <li>
            <strong>Your Google account.</strong> There is no OAuth screen because there
            is no API access. It works inside a session you already established, and
            never asks Google for anything.
          </li>
        </ul>

        <h2>What it stores, and where</h2>
        <p>
          Four values, in the browser&rsquo;s own <code>localStorage</code>, on your
          machine:
        </p>
        <ul>
          <li>
            <code>haikumail:last-haiku</code> — a number, so the same poem is not drawn
            twice running.
          </li>
          <li>
            <code>haikumail:view</code> — whether you last read a message plain or as
            sent.
          </li>
          <li>
            <code>haikumail:sender-tags</code> — labels you have put on a sender.
          </li>
          <li>
            <code>haikumail:favorite-senders</code> — a cached list of addresses.
          </li>
        </ul>
        <p>
          Two of those contain the email addresses of people who write to you. They stay
          in your browser, they are never transmitted, and — worth knowing —{' '}
          <strong>they survive uninstalling the extension</strong>, because that is how
          browser storage works. The{' '}
          <Link href="/privacy">privacy page</Link> gives you a one-line console command
          that clears them.
        </p>

        <h2>Where it sends things</h2>
        <p>Nowhere. There is no server. And this one you can verify without trusting us:</p>
        <ul>
          <li>
            The shipped bundle contains no <code>fetch</code>, no{' '}
            <code>XMLHttpRequest</code>, no <code>WebSocket</code>, no{' '}
            <code>sendBeacon</code>. Not one.
          </li>
          <li>
            It calls no <code>chrome.*</code> API of any kind. Not storage, not
            messaging, not tabs.
          </li>
          <li>
            Open your browser&rsquo;s network tab on Gmail. The extension adds nothing
            to it.
          </li>
        </ul>
        <p>
          There is no analytics in the extension, so we have no idea how many people use
          it or what they search for. That is a genuine cost to us and the correct
          trade.
        </p>

        <h2>The one honest caveat</h2>
        <p>
          When you switch a message to its original formatting, remote images load, the
          same as they would in Gmail. Those requests go to whoever sent the mail, not
          to us. <strong>Tracking pixels are stripped</strong> — the invisible
          one-by-one images whose only purpose is to report that you opened
          something — so the common case of being silently tracked by a sender is
          covered. Ordinary images are not blocked.
        </p>

        <h2>How to check all of this</h2>
        <p>
          The extension is MIT licensed and about a thousand lines. The manifest is the
          first thing in it.
        </p>
        <p>
          <a href={REPO_URL} rel="noopener">
            github.com/code-creativeapps/haikumail
          </a>
        </p>
        <p>
          A privacy claim you cannot check is a marketing claim. This one is small
          enough to read over a coffee, which is rather the point of building it this
          way.
        </p>
      </main>
      <Footer />
    </>
  )
}
