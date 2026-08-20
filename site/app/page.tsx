import Link from 'next/link'
import { Footer, Header } from '@/components/Chrome'
import { HaikuStage } from '@/components/HaikuStage'
import { InstallButton, InstallNote } from '@/components/InstallButton'
import { JsonLd } from '@/components/JsonLd'
import { Waitlist } from '@/components/Waitlist'
import { FAQ } from '@/lib/faq'
import { DESCRIPTION, REPO_URL, SITE_NAME, SITE_URL, STORE_URL, TAGLINE } from '@/lib/site'
import { ORIGINALS, TRANSLATIONS } from '@/lib/haiku'

const softwareLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: SITE_NAME,
  description: DESCRIPTION,
  applicationCategory: 'BrowserApplication',
  operatingSystem: 'Chrome',
  url: SITE_URL,
  softwareVersion: '1.0.0',
  isAccessibleForFree: true,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  ...(STORE_URL ? { downloadUrl: STORE_URL } : {}),
}

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

export default function Home() {
  return (
    <>
      <JsonLd data={softwareLd} />
      <JsonLd data={faqLd} />
      <Header />

      <main>
        {/* 1 — The hero is the product, running. */}
        <section className="hk-shell hk-hero">
          <h1 className="hk-hero-title">{TAGLINE}</h1>
          <p className="hk-hero-sub">
            HaikuMail hides your inbox behind a search-only reader — and won&rsquo;t let
            you ask it for anything for thirty seconds.
          </p>
          <HaikuStage />
          <div className="hk-cta">
            <InstallButton />
            <InstallNote />
          </div>
          <a className="hk-scroll" href="#how">
            How it works ↓
          </a>
        </section>

        {/* 2 — The problem, before the product. */}
        <section className="hk-shell hk-section hk-narrow">
          <p className="hk-big">
            You check it when you&rsquo;re bored. You check it in a lift. You check it
            while someone is still talking to you. You checked it four minutes ago.
          </p>
          <p>
            Almost none of those times is there anything there. The inbox is not the
            problem — the <em>door</em> is the problem. It opens instantly, it always has
            something new-looking in it, and it costs nothing to push.
          </p>
          <p className="hk-big">
            HaikuMail doesn&rsquo;t block Gmail. It just makes the door slow.
          </p>
        </section>

        {/* 3 — The wait. */}
        <section id="how" className="hk-shell hk-section hk-narrow">
          <h2>Thirty seconds, first</h2>
          <p>
            Open Gmail and you get a poem instead, one line at a time, and a small grey
            number counting down. Every control is locked until it reaches zero. The
            counter is kept small and quiet on purpose — a big ticking number is just one
            more thing to stare at.
          </p>
          <p>
            Reloading does not help you: it starts a fresh thirty seconds. There is no
            settings page to shorten it, because a wait you can shorten is a wait you will
            shorten, usually on exactly the day it was working.
          </p>
          <p>
            Mostly what happens in those thirty seconds is that you remember you
            didn&rsquo;t need anything.
          </p>
        </section>

        {/* 4 — Search only. */}
        <section className="hk-shell hk-section hk-narrow">
          <h2>Then: nothing, until you ask</h2>
          <p>
            No list. No unread count. No bold senders arranged to be glanced at. Just a
            search field, and whatever you came for.
          </p>
          <p>
            Gmail&rsquo;s own operators all work — <code>from:anna</code>,{' '}
            <code>has:attachment</code>, <code>newer_than:2d</code> — because the search
            is Gmail&rsquo;s search. You are using the same index, without the room
            attached to it.
          </p>
        </section>

        {/* 5 — Browse. */}
        <section className="hk-shell hk-section hk-narrow">
          <h2>Or read by kind</h2>
          <p>
            Sometimes you don&rsquo;t have a search term, you have a mood. Browse gives
            you the categories you&rsquo;d have made yourself — favourites, the people you
            actually read, newsletters, notifications, social, promotions — and you pick
            one deliberately rather than being handed all of them at once.
          </p>
          <p>
            You can tag a sender once and have every message from them filed that way
            afterwards.
          </p>
        </section>

        {/* 6 — Reading. */}
        <section className="hk-shell hk-section hk-narrow">
          <h2>Reading a message</h2>
          <p>
            Two views. <strong>Plain</strong> rebuilds the message as text, with the
            quoted history dropped. <strong>Original</strong> shows the sender&rsquo;s
            real markup, images and all.
          </p>
          <p>
            Before anything is displayed it is stripped of scripts, event handlers, form
            tags and unsafe links, and <strong>tracking pixels are removed</strong> — so
            opening a message here does not quietly tell the sender that you opened it.
          </p>
        </section>

        {/* 7 — The escape hatch. Honesty as conversion. */}
        <section className="hk-shell hk-section hk-narrow">
          <h2>It isn&rsquo;t a prison</h2>
          <p>
            One link drops the mask and gives you the real Gmail for that tab, for when
            you genuinely need to compose something or dig through a thread. A small mark
            stays in the corner to put it back.
          </p>
          <p>
            Coming back restarts the thirty seconds — the way in costs the same however
            you enter. That is the only thing HaikuMail is strict about.
          </p>
        </section>

        {/* 8 — The tab. */}
        <section className="hk-shell hk-section hk-narrow">
          <h2>The tab stops being a notification</h2>
          <p>
            Gmail writes your unread count into the tab title and the favicon, which is
            how an inbox reaches you from across the room while you are doing something
            else. Both are replaced. The tab keeps HaikuMail&rsquo;s name and mark even
            while unmasked.
          </p>
        </section>

        {/* 9 — The strongest section, and the highest-intent moment on the page. */}
        <section className="hk-shell hk-section hk-narrow">
          <h2>Nothing leaves your browser</h2>
          <p>
            HaikuMail has no server. It makes no network requests. It asks for no account,
            shows no OAuth screen, and holds no API key — because it never asks Google for
            your mail at all. It reads the page already open in the tab in front of you.
          </p>
          <p>This is the whole of what it asks for:</p>
          <pre className="hk-pre">
            <code>{`"host_permissions": ["https://mail.google.com/*"]`}</code>
          </pre>
          <p>
            One origin. No access to your other tabs, your history, your downloads or any
            other site. No analytics inside the extension. There is no breach to worry
            about, because there is nowhere for anything to have been kept.
          </p>
          <p>
            You do not have to take that on trust. It is{' '}
            <a href={REPO_URL} rel="noopener">
              open source
            </a>
            , it is one content script, and if it made a request you would find one. The{' '}
            <Link href="/privacy">privacy policy</Link> says the same thing at length.
          </p>
          <div className="hk-cta hk-cta-inline">
            <InstallButton />
            <InstallNote />
          </div>
        </section>

        {/* 10 — The poems. */}
        <section className="hk-shell hk-section hk-narrow">
          <h2>About the poems</h2>
          <p>
            There are {ORIGINALS.length + TRANSLATIONS.length} of them, and you get a
            different one each time. {ORIGINALS.length} were written for this extension.
            The other {TRANSLATIONS.length} are Bashō, Buson, Issa, Shiki and a few
            others.
          </p>
          <p>
            Those needed translating rather than quoting, which is the trap in collecting
            &ldquo;famous haiku&rdquo; from the web: the Japanese originals have been
            public domain for centuries, but the English translations everyone circulates
            — Blyth, Henderson, Hass — are still firmly in copyright. So these renderings
            were made here. Each is labelled an AI translation, because you deserve to
            know the English is machine-made rather than a scholar&rsquo;s, and each
            carries the romaji of its source so it can be checked rather than trusted.
          </p>
          <p>
            <Link href="/haiku">Read all {ORIGINALS.length + TRANSLATIONS.length} →</Link>
          </p>
        </section>

        {/* 11 — FAQ. Objections, which are also queries. */}
        <section className="hk-shell hk-section hk-narrow">
          <h2>Questions</h2>
          <dl className="hk-faq">
            {FAQ.map(({ q, a }) => (
              <div key={q}>
                <dt>{q}</dt>
                <dd>{a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* 12 — The waitlist. Once, below the fold, framed as scope not tier. */}
        <section className="hk-shell hk-section hk-narrow hk-later">
          <h2>Other inboxes, eventually</h2>
          <p>
            Everything above is the free extension. It stays free.
          </p>
          <p>
            What it can&rsquo;t do is work on your phone, or on an inbox that isn&rsquo;t
            Gmail, or remember anything while you&rsquo;re not looking. A hosted version
            could — an archive you can read years back through, sender-by-sender rather
            than message-by-message, and the tidying-up happening quietly in the
            background instead of never.
          </p>
          <p>
            It doesn&rsquo;t exist yet and there is no price. If you&rsquo;d like to know
            when it does:
          </p>
          <Waitlist />
        </section>
      </main>

      <Footer />
    </>
  )
}
