/**
 * One source for the questions, used both to render the visible FAQ and to
 * build the FAQPage structured data. Google requires the marked-up answers to
 * match the visible ones; sharing the array is how that stays true when the
 * copy is edited.
 *
 * These are objections rather than features — and they are also, not by
 * coincidence, the things people type into a search box.
 */
export const FAQ: { q: string; a: string }[] = [
  {
    q: 'Does it read my email?',
    a: 'It reads the Gmail page already open in your browser, in order to show you the message you asked for. Nothing is stored and nothing is sent anywhere — the extension makes no network requests at all, and has no server to send anything to.',
  },
  {
    q: 'Do I have to sign in or give it access to my Google account?',
    a: 'No. There is no account, no OAuth screen and no API key. Because it works inside the tab where you are already signed in, it never needs permission from Google to see your mail.',
  },
  {
    q: 'Can I still send mail?',
    a: 'Yes. HaikuMail does not block Gmail, it hides it. One link drops the mask for that tab and gives you the real Gmail, for the times you genuinely need to compose or manage something. Coming back restarts the thirty seconds, so the way in costs the same however you enter.',
  },
  {
    q: 'Can I change the thirty seconds?',
    a: 'Not at the moment, and that is deliberate. A wait you can shorten is a wait you will shorten, usually on precisely the day it was working.',
  },
  {
    q: 'Can I skip the wait by reloading the page?',
    a: 'No — reloading starts a fresh thirty seconds, so it costs you more than waiting.',
  },
  {
    q: 'Does it work with Google Workspace accounts?',
    a: 'Yes. It runs on mail.google.com, which is where Workspace mail is read, so a work account behaves the same as a personal one.',
  },
  {
    q: 'Does it work on my phone?',
    a: 'No. It is a Chrome extension, and mobile Chrome does not run extensions. The phone is where most compulsive checking actually happens, which is one of the reasons a hosted version is being considered.',
  },
  {
    q: 'What happens if Gmail changes?',
    a: 'The extension reads Gmail’s own page structure, so a large enough change on Google’s side can break searching or reading until it is updated. Those internals have been stable for years, but there is no promise from Google that they will stay that way.',
  },
  {
    q: 'Is it free?',
    a: 'Yes, and it stays free. A hosted version with an archive and background cleanup is being built separately, and that one will be paid — but everything described on this page is the free extension.',
  },
]
