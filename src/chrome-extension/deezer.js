const injectedScript = document.createElement('script')
injectedScript.src = chrome.extension.getURL('scripts/deezer-browser.js')
;(document.head || document.documentElement).appendChild(injectedScript)

function sendMessageToBrowser(message) {
  document.dispatchEvent(
    new CustomEvent('PURPLE_ORWEL_MSG', { detail: { ...message, origin: 'CONTENT-SCRIPT' } })
  )
}

chrome.runtime.onMessage.addListener(function (message) {
  if (typeof message !== 'object') return
  sendMessageToBrowser(message)
})

document.addEventListener('PURPLE_ORWEL_MSG', ({ detail }) => {
  const { type, val, origin } = detail
  if (origin === 'CONTENT-SCRIPT') return
  switch (type) {
    case 'STATUS_CHANGED':
      chrome.runtime.sendMessage({ type, val })
      break
  }
})
