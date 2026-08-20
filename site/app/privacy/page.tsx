import type { Metadata } from 'next'
import Link from 'next/link'
import { Footer, Header } from '@/components/Chrome'
import { CONTACT_EMAIL, REPO_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Privacy',
  description:
    'HaikuMail makes no network requests, has no server, and stores nothing off your machine. Here is exactly what that means, and what the website collects.',
  alternates: { canonical: '/privacy' },
}

const UPDATED = '20 August 2026'

export default function Privacy() {
  return (
    <>
      <Header />
      <main className="hk-shell">
        <article className="hk-prose">
          <h1>Privacy</h1>
          <p className="hk-dateline">Last updated {UPDATED}</p>

          <p className="hk-lede">
            There are two separate things under this name: a Chrome extension, which
            collects nothing, and this website, which collects an email address if you
            ask to be told when there is news. They are covered separately below,
            because they genuinely are separate.
          </p>

          <h2>The extension</h2>

          <h3>It makes no network requests</h3>
          <p>
            HaikuMail has no server, no account, no API key and no analytics. It never
            sends anything anywhere, because it has nowhere to send it to. There is no
            OAuth screen because it never asks Google for access to your mail.
          </p>
          <p>
            Instead it runs inside the Gmail tab you already opened, in your browser,
            and reads the page Gmail has already drawn there. Your mail is read the same
            way your screen reads it: locally, and only while you are looking at it.
          </p>
          <div className="hk-aside">
            <p>
              This is checkable rather than promised. The extension is open source, and
              the whole of it is one content script —{' '}
              <a href={REPO_URL} rel="noopener">
                read it
              </a>
              . If it made a network request, you would find one.
            </p>
          </div>

          <h3>What it can access</h3>
          <p>
            The extension asks for one thing: permission to run on{' '}
            <code>https://mail.google.com</code>. It requests no other host and no other
            capability — no access to your other tabs, your browsing history, your
            downloads, your cookies, or any other site.
          </p>
          <pre className="hk-pre">
            <code>{`"host_permissions": ["https://mail.google.com/*"]`}</code>
          </pre>
          <p>
            While you have a Gmail tab open, the extension can read the subjects,
            senders, dates and message bodies that Gmail has rendered in it — that is
            what makes searching and reading possible. It holds them in memory long
            enough to show them to you, and does not write them anywhere.
          </p>

          <h3>What it stores, and where</h3>
          <p>
            Four values are kept in your browser&rsquo;s <code>localStorage</code>, under
            Gmail&rsquo;s own origin. Nothing else is stored, and none of it leaves your
            machine:
          </p>
          <ul>
            <li>
              <code>haikumail:last-haiku</code> — a number, so the same poem is not drawn
              twice in a row.
            </li>
            <li>
              <code>haikumail:view</code> — whether you last read a message as plain text
              or in the sender&rsquo;s own markup.
            </li>
            <li>
              <code>haikumail:sender-tags</code> — any labels you have put on a sender,
              which include that sender&rsquo;s email address.
            </li>
            <li>
              <code>haikumail:favorite-senders</code> — a cached list of addresses worked
              out from mail you have starred, so the list does not have to be rebuilt on
              every visit.
            </li>
          </ul>
          <p>
            The last two contain email addresses of people who have written to you. They
            are held locally, in the same place a website holds your preferences, and are
            readable only by that origin in your browser.
          </p>
          <p>
            Because they belong to the origin rather than to the extension, removing the
            extension does not by itself erase them. To clear them, remove Gmail&rsquo;s
            site data in your browser settings, or run{' '}
            <code>
              Object.keys(localStorage).filter(k =&gt; k.startsWith(&apos;haikumail:&apos;)).forEach(k
              =&gt; localStorage.removeItem(k))
            </code>{' '}
            in the console on a Gmail tab.
          </p>

          <h3>What it does not do</h3>
          <ul>
            <li>No data is transmitted, sold, shared, or transferred to anyone.</li>
            <li>No advertising, profiling, or interest-based targeting of any kind.</li>
            <li>No tracking of your browsing, on Gmail or anywhere else.</li>
            <li>
              No human ever sees your mail. Nobody could: it never leaves your browser.
            </li>
            <li>
              Tracking pixels embedded in the mail you read are removed before the message
              is displayed, so opening a message here does not tell the sender you opened
              it.
            </li>
          </ul>

          <h3>Limited Use</h3>
          <p>
            The use of information received from Google APIs will adhere to the{' '}
            <a
              href="https://developer.chrome.com/docs/webstore/program-policies/limited-use"
              rel="noopener"
            >
              Chrome Web Store User Data Policy
            </a>
            , including the Limited Use requirements. HaikuMail does not in fact use any
            Google API — it reads only the page already rendered in your own tab — but the
            commitment stands.
          </p>

          <h2>This website</h2>

          <h3>The waitlist</h3>
          <p>
            If you enter your email address to hear about the hosted version, we store
            your address, the date you gave it, and whether you confirmed it. Nothing
            else — no name, no company, no tracking of what you looked at before you
            typed it.
          </p>
          <p>
            You will be sent one message asking you to confirm, and after that only when
            there is genuinely something to say. Every email carries an unsubscribe link,
            and unsubscribing deletes the address rather than merely flagging it.
          </p>
          <p>
            The list is held by <strong>Buttondown</strong>, which acts as our processor
            and does not use the addresses for anything of its own. The legal basis is
            your consent, under Article 6(1)(a) of the UK GDPR and the EU GDPR, and you
            may withdraw it at any time.
          </p>

          <h3>Abuse prevention</h3>
          <p>
            To stop the signup form being used to send confirmation mail to people who did
            not ask for it, requests to it are rate limited by our host at the network
            edge, before they reach any code of ours. We neither see nor store an IP
            address for this. The form also carries a hidden field that a person never
            fills in and a great many automated scripts do.
          </p>
          <p>
            Confirmation is why this matters: an address that has not been confirmed is
            never sent anything at all, so the form cannot be used to mail somebody who
            did not ask for it.
          </p>

          <h3>Analytics</h3>
          <p>
            The site uses Vercel Web Analytics, which counts page views without cookies,
            without a device fingerprint, and without following anyone between sites. That
            is also why there is no cookie banner: there are no cookies to ask you about.
          </p>

          <h3>Hosting</h3>
          <p>
            The site is hosted by Vercel, which keeps short-lived server logs including IP
            addresses as an ordinary part of serving and protecting a website. We do not
            use those logs to build any profile.
          </p>

          <h2>Your rights</h2>
          <p>
            You can ask for a copy of what is held about you, ask for it corrected, or ask
            for it deleted, and we will act within 30 days. For the waitlist, the
            unsubscribe link in any email does it immediately and without asking anyone.
            For anything else, write to{' '}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
          <p>
            There is nothing to request about the extension, because there is nothing held
            about you — what it stores is on your own machine and under your control.
          </p>

          <h2>Children</h2>
          <p>
            HaikuMail is not directed at children under 13, and we do not knowingly
            collect anything from them.
          </p>

          <h2>Changes</h2>
          <p>
            If what is collected ever changes, this page changes first and the date at the
            top moves. Anything that would alter how your data is handled will be said
            plainly rather than absorbed quietly into a new version — and if the extension
            itself ever starts collecting anything, that will be announced in the
            extension, not only here.
          </p>

          <p>
            Questions: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. See also
            the <Link href="/terms">terms</Link>.
          </p>
        </article>
      </main>
      <Footer />
    </>
  )
}
