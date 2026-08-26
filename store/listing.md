# Chrome Web Store listing — HaikuMail 1.0.0

Paste sheet for the Developer Dashboard.

> Rejected 26 Aug 2026 — "excessive keywords in the item's description",
> triggered by a list of nine poets' names. Naming them was worth nothing to a
> reader and read as keyword stuffing to the classifier. The list is gone;
> resist adding names, synonyms or comma-separated runs of them back.
 Every claim here is worded to match
`https://haikumail.app/privacy` exactly; the store's data-disclosure form and the
published policy disagreeing is a routine cause of rejection.

Upload: `haikumail-1.0.0.zip` (repo root, rebuild with `npm run package`).

---

## Store listing tab

**Item name**

    HaikuMail

**Short description** (max 132)

    Masks Gmail behind a calm, search-only reader. A haiku holds the first thirty seconds.

**Category**

    Workflow & Planning

**Language**

    English (United Kingdom)

**Detailed description**

    You open Gmail forty times a day, and most of those times you did not want
    anything. You wanted a moment away from what you were doing.

    HaikuMail does not block Gmail. It hides it, and makes the door slow.

    Open your inbox and the message list is gone. In its place is a haiku,
    arriving a line at a time, and a small counter counting down from thirty.
    Until it reaches zero you cannot ask for mail. Usually, by the time it does,
    you remember that you did not need any.

    THE WAIT
    Thirty seconds, every time — and reloading the page does not skip it, it
    starts it again. The way in costs the same however you enter, which is what
    makes it work when willpower does not.

    THEN, SEARCH ONLY
    Nothing appears until you ask for it. Search for the thing you came for,
    read it, and leave. There is no list to scroll and no unread count to
    answer to.

    OR BROWSE, BY KIND
    When you do not have a name in mind, browse by kind rather than by date —
    and tag the senders that matter so they are one click away.

    READING
    Two views. Plain rebuilds the message as text with the quoted history
    dropped; Original shows the sender's own markup. Either way it is first
    stripped of scripts, event handlers, form tags and unsafe links, and
    tracking pixels are removed — so opening a message does not quietly tell
    the sender that you opened it.

    IT IS NOT A PRISON
    One link drops the mask for that tab and gives you the real Gmail, for the
    times you genuinely need to compose or manage something. Coming back
    restarts the thirty seconds.

    THE TAB STOPS BEING A NOTIFICATION
    The title and the favicon are replaced, so a Gmail tab sitting in your
    window stops advertising how much mail is waiting.

    NOTHING LEAVES YOUR BROWSER
    This is the part worth checking rather than believing. HaikuMail asks for
    one permission — mail.google.com — and makes no network requests of its
    own. There is no account, no OAuth screen, no API key and no server, which
    means there is no server to breach and nothing to sell. Your preferences and
    sender tags live in your browser's local storage and never leave it.

    The extension is open source (MIT). The manifest is four lines long and you
    can read it: https://github.com/code-creativeapps/haikumail

    THE POEMS
    157 of them. 100 written for this, and 57 new translations of the classical
    Japanese poets, made for the extension because the well-known English
    renderings are still in copyright. You will not see the same one twice in a
    row. The poems and the reasoning behind the translations are at
    https://haikumail.app/haiku

    Free, and it stays free.

    Privacy policy: https://haikumail.app/privacy

---

## Privacy tab

**Single purpose**

    HaikuMail replaces the Gmail inbox with a search-only reader after a
    thirty-second delay, so that opening Gmail out of habit does not surface a
    list of unread mail. Everything it does serves that one purpose: hiding the
    inbox, holding the delay, and displaying the specific messages the user
    searches for.

**Permission justification — host permission `https://mail.google.com/*`**

    The extension's entire function is to change how the Gmail interface
    behaves, so it must run on the page where Gmail is displayed. It requests
    this single origin and no other; it does not request <all_urls> or any
    broader pattern. It reads the Gmail page's own DOM in the tab the user has
    already signed into, in order to render the search results and the message
    the user asked for. It sends nothing anywhere.

    Verified in the shipped bundle: it contains no fetch, XMLHttpRequest,
    WebSocket or sendBeacon call, and no chrome.* API call of any kind.

    (No other permissions are requested. The extension declares no entries under
    "permissions" at all — user preferences are held in the page's own
    localStorage, which requires no permission.)

**Are you using remote code?**

    No, I am not using remote code.

    All code is contained in the uploaded package. There are no external
    scripts, no eval, and no remotely hosted modules.

**Data usage — tick nothing.**

    Personally identifiable information ......... NO
    Health information .......................... NO
    Financial and payment information ........... NO
    Authentication information .................. NO
    Personal communications ..................... NO
    Location .................................... NO
    Web history ................................. NO
    User activity ............................... NO
    Website content ............................. NO

    The extension reads message content on screen in order to display it, but
    does not collect it: nothing is stored beyond the user's own browser and
    nothing is transmitted. "Collect" in this form means transmit or move off
    the client; HaikuMail does neither.

**Certifications — tick all three.**

    - I do not sell or transfer user data to third parties, outside of the
      approved use cases
    - I do not use or transfer user data for purposes that are unrelated to my
      item's single purpose
    - I do not use or transfer user data to determine creditworthiness or for
      lending purposes

**Privacy policy URL**

    https://haikumail.app/privacy

---

## Distribution tab

    Visibility ......... Public
    Regions ............ All regions
    Pricing ............ Free

---

## Assets

| Asset | Size | Status |
|---|---|---|
| Store icon | 128×128 | in the package (`icons/icon-128.png`) |
| Screenshots | 1280×800 ×5 | `store/screenshots/1..5-*.png` |
| Small promo tile | 440×280 | `store/screenshots/promo-tile-440x280.png` |
| Marquee | 1400×560 | optional, only needed for featuring |

Regenerate the lot with `npm run shots`. They are captured from `dev/test.html`
using the `shots` fixture — every person and company in them is invented — and
written out at the store's exact pixel sizes, which are the only ones it takes.

Upload the five in order; the store shows them as a carousel and the haiku is
the only one that will stop a scroll.

---

## Before submitting

- [ ] Publisher display name set (appears under the listing; a common cause of
      silent rejection). Suggest `HaikuMail` so the listing, the domain and the
      privacy policy all agree.
- [ ] `https://haikumail.app/privacy` loads — reviewers do check.
- [ ] Read `/privacy` against the data-disclosure form field by field.
