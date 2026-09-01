import type { Metadata } from 'next'
import Link from 'next/link'
import { Footer, Header } from '@/components/Chrome'
import { JsonLd } from '@/components/JsonLd'
import { noteBySlug } from '@/lib/notes'
import { REPO_URL, SITE_URL } from '@/lib/site'

const note = noteBySlug('reading-gmail-without-oauth')!

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
          Every tool that reads your email asks for the Gmail API. You click through an
          OAuth screen, grant a scope that reads like a confession, and from then on a
          server somewhere holds a token that can read your mail whether you are at your
          desk or asleep.
        </p>
        <p>
          There is another way in, and it has been sitting in the browser the whole
          time. A content script runs <em>inside the tab you already have open</em>,
          where Gmail has already authenticated you and already rendered your mail into
          the DOM. It does not need a token, because it is not asking Google for
          anything. It is reading a page you are already looking at.
        </p>
        <p>
          That is how HaikuMail works. The manifest requests one origin and nothing
          else:
        </p>
        <pre className="hk-pre">
          <code>{`"host_permissions": ["https://mail.google.com/*"]`}</code>
        </pre>
        <p>
          No <code>permissions</code> array at all. No OAuth screen. No API key. No
          server, so nothing to breach and no token to leak. The trade is real and worth
          stating plainly: you get no background access, nothing on your phone, and you
          are reading Google&rsquo;s private markup, which they may change whenever they
          like.
        </p>

        <h2>Five things that will bite you</h2>
        <p>
          None of these are in any documentation, because none of this is a documented
          interface. Each cost an evening.
        </p>

        <h3>1. <code>innerText</code> returns nothing</h3>
        <p>
          HaikuMail hides the inbox with <code>body &#123; visibility: hidden &#125;</code>.
          But <code>innerText</code> is defined over <em>rendered</em> text — so under
          the mask it returns <code>&quot;&quot;</code> for the entire document. Not an
          error, not a warning; an empty string, everywhere.
        </p>
        <p>
          <code>textContent</code> is unaffected because it reads the DOM rather than
          the layout. If you are hiding a page and then reading it, this is the first
          thing that will break, and it will look like your selectors are wrong.
        </p>

        <h3>2. Gmail keeps every view you have looked at</h3>
        <p>
          Navigate, and Gmail does not discard the old view. It sets it to{' '}
          <code>display: none</code> and builds a new one beside it. So an unscoped{' '}
          <code>querySelectorAll(&apos;tr.zA&apos;)</code> hands you the current results{' '}
          <em>concatenated with every list you have opened this session, oldest first</em>.
        </p>
        <p>
          Which presents, delightfully, as &ldquo;my search returned my whole
          inbox&rdquo;. The fix is to find the one live view — the single{' '}
          <code>div[role=&quot;main&quot;]</code> that still has client rects.{' '}
          <code>display: none</code> removes an element from layout;{' '}
          <code>visibility: hidden</code> does not. That difference is exactly what
          tells a stale view apart from a merely masked one.
        </p>

        <h3>3. A selector list is not a priority list</h3>
        <p>
          <code>querySelector(&apos;a, b&apos;)</code> returns the earliest match in{' '}
          <strong>document order</strong> — not the first selector that matched. It is
          in the spec and it still catches people.
        </p>
        <p>
          The sender cell holds several spans, and the one carrying the address is not
          the first. So <code>&apos;.yW span[email], .yW span&apos;</code> quietly
          returned the wrong span every time. Candidates with a preference order have to
          be tried in separate calls.
        </p>

        <h3>4. Trusted Types are on, so you cannot parse HTML</h3>
        <p>
          <code>mail.google.com</code> enforces Trusted Types. Both{' '}
          <code>innerHTML = string</code> and{' '}
          <code>DOMParser.parseFromString</code> throw on this origin — the second one
          surprises people, since it looks like a safe alternative.
        </p>
        <p>
          Message markup therefore never becomes a string. It is carried around as
          detached, sanitised <em>nodes</em> and appended with DOM calls. Awkward at
          first, and then you notice it removes an entire class of injection bug by
          construction, because there is never a moment when the message is text that
          something could parse.
        </p>

        <h3>5. The thread id is not on the row</h3>
        <p>
          The row element carries an internal id like <code>:3x</code>, which is no use
          to anyone. The real one lives on a{' '}
          <code>span[data-legacy-thread-id]</code> inside the row, and it is what makes
          a <code>#search/&lt;query&gt;/&lt;id&gt;</code> URL open a specific message.
        </p>

        <h2>The honest caveat</h2>
        <p>
          Every selector above — <code>tr.zA</code>, <code>.y6</code>,{' '}
          <code>span[data-legacy-thread-id]</code>, <code>.a3s</code>,{' '}
          <code>h2.hP</code> — is a private Gmail class name. They have been stable for
          years. Google has promised nothing, and one morning they may not be.
        </p>
        <p>
          That is the actual price of not using the API. Not difficulty — the DOM
          approach is less code than an OAuth flow — but the absence of a contract. What
          you buy with it is that nothing leaves the browser, because there is nowhere
          for it to go.
        </p>
        <p>
          The whole thing is MIT and about a thousand lines:{' '}
          <a href={REPO_URL} rel="noopener">
            github.com/code-creativeapps/haikumail
          </a>
          . What it does with what it reads is described on{' '}
          <Link href="/privacy">the privacy page</Link>.
        </p>
      </main>
      <Footer />
    </>
  )
}
