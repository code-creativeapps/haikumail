import Link from 'next/link'
import { Footer, Header } from '@/components/Chrome'
import { HaikuStage } from '@/components/HaikuStage'
import { HeroVideo } from '@/components/HeroVideo'
import { InstallButton, InstallNote } from '@/components/InstallButton'
import {
  MarkApp,
  MarkArchive,
  MarkDoor,
  MarkInboxes,
  MarkPhone,
  MarkTidy,
  MarkKinds,
  MarkPoem,
  MarkReading,
  MarkSealed,
  MarkSearch,
  MarkTab,
  MarkWait,
} from '@/components/Marks'
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
          <HeroVideo />
          <div className="hk-cta">
            <InstallButton />
            <InstallNote />
          </div>
          <a className="hk-scroll" href="#how">
            How it works ↓
          </a>
        </section>

        {/* 1b — The coming app, teased once above the fold's edge. */}
        <aside className="hk-shell hk-teaser">
          <span className="hk-teaser-tag">Coming soon</span>
          <p>
            <strong>HaikuMail for any inbox — and for your phone.</strong> The extension
            is Gmail on the desktop. The app is the rest of it.{' '}
            <a href="#the-app">What it will do →</a>
          </p>
        </aside>

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
          <figure className="hk-figure"><MarkWait /></figure>
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
          <HaikuStage />
        </section>

        {/* 4 — Search only. */}
        <section className="hk-shell hk-section hk-narrow">
          <figure className="hk-figure"><MarkSearch /></figure>
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
          <figure className="hk-figure"><MarkKinds /></figure>
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
          <figure className="hk-figure"><MarkReading /></figure>
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
          <figure className="hk-figure"><MarkDoor /></figure>
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
          <figure className="hk-figure"><MarkTab /></figure>
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
          <figure className="hk-figure"><MarkSealed /></figure>
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
          <figure className="hk-figure"><MarkPoem /></figure>
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

        {/* 12 — The app. A section of its own rather than a footnote: it is a
            different product, and the page has to say what it is for before it
            asks for an address. Still framed as scope, never as a better tier. */}
        <section id="the-app" className="hk-app">
          <div className="hk-shell">
            <figure className="hk-figure">
              <MarkApp />
            </figure>
            <p className="hk-eyebrow">Coming soon</p>
            <h2>HaikuMail, everywhere else</h2>
            <p className="hk-app-lede">
              The extension is Gmail, on a desktop, in Chrome. That is a real limit and
              no amount of work removes it — a page script cannot reach your phone, and
              it cannot read an inbox that is not Gmail. The app is the version without
              those walls.
            </p>

            <ul className="hk-app-grid">
              <li>
                <MarkPhone />
                <h3>On your phone</h3>
                <p>
                  Mobile browsers do not run extensions at all — and the phone is where
                  most of the checking you would rather not do actually happens.
                </p>
              </li>
              <li>
                <MarkInboxes />
                <h3>Any inbox</h3>
                <p>
                  Not only Gmail. Fastmail, Outlook, a work account on a domain nobody
                  has heard of — the same thirty seconds in front of all of them.
                </p>
              </li>
              <li>
                <MarkArchive />
                <h3>An archive that goes back</h3>
                <p>
                  Years of mail, read sender-by-sender rather than message-by-message —
                  which is the shape you actually remember things in.
                </p>
              </li>
              <li>
                <MarkTidy />
                <h3>Tidying while you are away</h3>
                <p>
                  The filing that never happens, happening quietly in the background
                  instead of waiting for an afternoon you were never going to spend.
                </p>
              </li>
            </ul>

            <div className="hk-app-form">
              <p>
                It does not exist yet and there is no price, so this is not a pre-order
                and there is nothing to be early for. One email, when there is something
                to say.
              </p>
              <Waitlist />
            </div>

            <p className="hk-app-foot">
              Everything above this section is the free extension. It stays free.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
