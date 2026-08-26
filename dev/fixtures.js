/**
 * Row fixtures for the harness. Two sets, because they answer to different
 * things: `dev` is built to break the layout (thirty rows, a snippet long
 * enough to force truncation, a third of them unread), while `shots` is what
 * goes in front of strangers on the Chrome Web Store and has to look like an
 * inbox someone might actually have.
 *
 * Everything here is invented — the people, the companies, the amounts. No
 * real name, address or brand appears in either set, which is what lets the
 * store screenshots be taken from the harness rather than from a real mailbox.
 *
 * Columns: [from, subject, snippet, date, unread, labels]
 *
 * `labels` stands in for Gmail's smart labels and categories, so the Browse
 * filters return something believable rather than the whole fixture.
 */
const LONG =
  "If you don't recognise this transfer, please contact us immediately. Our Support team is available 24/7 via the in-app chat and will help you sort it out."

const dev = [
  ['Anna Reyes', 'Invoice #1043 for July', 'Attached is the invoice for last month', 'Aug 14, 2026', true],
  ['Ledgerline', 'Your payout is on the way', 'A payout of €2,340.00 is expected', 'Aug 12, 2026', false],
  ['Marc Dubois', 'Re: contract review', 'Two small edits and I think we are done', 'Aug 9, 2026', false],
  ...Array.from({ length: 27 }, (_, i) => [
    'Ledgerline',
    `You sent €${(i + 1) * 5} to CreativeApps`,
    LONG,
    `Aug ${(i % 28) + 1}, 2026`,
    i % 3 === 0,
  ]),
]

const shots = [
  ['Nadia Okonkwo', 'Invoice #1043 for July', 'Attached is the invoice for last month — no rush on this one.', 'Aug 14, 2026', true, ['starred']],
  ['Fieldnotes', 'Issue 84: the quiet hour', 'Three things worth your attention, and one worth ignoring.', 'Aug 14, 2026', true, ['newsletter', 'updates']],
  ['Tomas Lindqvist', 'Re: contract review', 'Two small edits and I think we are done.', 'Aug 13, 2026', false, []],
  ['Harbour Books', 'Your order has shipped', 'Two of the three are on their way; the third follows next week.', 'Aug 13, 2026', false, ['notification', 'updates']],
  ['Lena Vasquez', 'Thursday instead?', 'Something has come up on Wednesday — could we move it?', 'Aug 12, 2026', true, []],
  ['Meridian Bank', 'Your August statement is ready', 'You can view it any time from your account.', 'Aug 12, 2026', false, ['notification', 'updates']],
  ['The Marginal Press', 'This week: seven short things', 'On patience, tide tables, and a very small bird.', 'Aug 11, 2026', false, ['newsletter', 'updates']],
  ['Kite Studio', 'Notes from Thursday', 'Everything we agreed, plus the two things we did not.', 'Aug 11, 2026', false, []],
  ['Studio Verrier', 'Invoice #229 for August', 'Due at the end of the month, as usual.', 'Aug 10, 2026', true, []],
  ['Northwind Energy', 'Your bill for August', 'A little lower than last month, for once.', 'Aug 10, 2026', false, ['notification', 'updates']],
  ['Slow Cinema Club', 'What we are watching in September', 'Four films, one of them almost cheerful.', 'Aug 9, 2026', false, ['newsletter', 'updates']],
  ['Rowan Pike', 'The photos from the weekend', 'There are far too many. I have picked the nine best.', 'Aug 9, 2026', false, []],
  ['Cadence Gym', 'Your membership renews soon', 'No action needed if you are happy to continue.', 'Aug 8, 2026', false, ['promo', 'promotions']],
]

window.FIXTURES = { dev, shots }

/**
 * The message body used for the store screenshots — a plausible invoice mail.
 * The harness's own body is a deliberately hostile payload (a javascript:
 * href, an onerror handler, an injected <script>) that exists to prove the
 * sanitiser works; correct for testing, wrong for a shop window.
 *
 * The logo is a data URI, so this fixture makes no network request either.
 */
const MARK =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="132" height="28">' +
      '<text x="0" y="20" font-family="Georgia,serif" font-size="19" fill="#2f3b46">Okonkwo &amp; Co.</text></svg>',
  )

window.SHOT_BODY = (from) => `
  <div style="font-family:Georgia,serif;color:#23231f;line-height:1.55;max-width:560px">
    <img src="${MARK}" alt="Okonkwo &amp; Co." width="132" height="28">
    <p style="margin:20px 0 0">Hi there,</p>
    <p>The invoice is attached as a PDF. It covers the two days in the studio
      and the print run — the framing goes on the next one, once the shop has
      confirmed their price.</p>
    <p>Payable by the end of the month, as usual. Shout if anything looks off.</p>
    <p style="margin-bottom:0">Best,<br>${from}</p>
    <div class="gmail_quote">On Tue, someone wrote: quoted history that should be dropped</div>
  </div>`
