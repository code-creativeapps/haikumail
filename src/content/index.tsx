import { StrictMode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import themeCss from '@radix-ui/themes/styles.css?inline'
import appCss from './app.css?inline'
import App from '../app/App'
import { maskTabIdentity } from '../lib/gmail'

const HOST_ID = 'quiet-mail-root'
const MASKED_TITLE = 'Quiet Mail'

/**
 * Mount point: appended to <html>, not <body>. `mask.css` hides <body>, so
 * living outside it is what keeps our UI visible while Gmail is not.
 */
function mount(): { host: HTMLElement; root: Root } {
  const host = document.createElement('div')
  host.id = HOST_ID
  const shadow = host.attachShadow({ mode: 'open' })

  const style = document.createElement('style')
  // Radix Themes scopes some tokens to :root, which never matches inside a
  // shadow tree — rehome them onto the host.
  style.textContent = themeCss.replace(/:root\b/g, ':host') + '\n' + appCss
  shadow.append(style)

  const container = document.createElement('div')
  shadow.append(container)
  document.documentElement.append(host)

  const root = createRoot(container)
  return { host, root }
}

let unmasked = false

function start() {
  if (unmasked || document.getElementById(HOST_ID)) return
  maskTabIdentity(MASKED_TITLE)

  const { host, root } = mount()

  const unmask = () => {
    unmasked = true
    root.unmount()
    host.remove()
    const undo = document.createElement('style')
    undo.textContent = 'body { visibility: visible !important } html { overflow: auto !important }'
    document.documentElement.append(undo)
  }

  root.render(
    <StrictMode>
      <App onUnmask={unmask} />
    </StrictMode>,
  )
}

start()

// Gmail replaces large parts of the document as it boots; make sure the mask
// survives that.
new MutationObserver(() => {
  if (!document.getElementById(HOST_ID)) start()
}).observe(document.documentElement, { childList: true })
