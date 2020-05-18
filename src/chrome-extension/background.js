let token = null

chrome.runtime.onInstalled.addListener(function () {
  let isListening = false
  chrome.tabs.query({ url: 'https://www.deezer.com/*' }, (tabs) => {
    tabs.forEach((tab) => {
      console.log('Init tabs', tabs)
      chrome.pageAction.show(tab.id)
    })
  })
  chrome.tabs.onUpdated.addListener((tabId, update, tab) => {
    if (!update.url && !update.status) return
    if (tab.url.includes('https://www.deezer.com/')) {
      chrome.pageAction.show(tabId)
    } else {
      chrome.pageAction.hide(tabId)
    }
  })
  chrome.runtime.onMessage.addListener((message, sender) => {
    console.log('message received to background', message)
    if (typeof message !== 'object') return
    switch (message.type) {
      case 'STATUS_CHANGED':
        chrome.pageAction.setIcon({
          path: `icons/Icon${message.val ? 'Running' : 'Start'}.png`,
          tabId: sender.tab.id,
        })
        chrome.pageAction.setTitle({
          title: message.val ? 'Synchronisation active' : 'Click for start synchro',
          tabId: sender.tab.id,
        })
        isListening = message.val
        break
      case 'TRACK_CHANGED':
        fetch('https://twitch-api.purple-fox.fr/music/track', {
          method: 'POST',
          mode: 'no-cors',
          body: JSON.stringify(message.val),
        })
          .then(() => {
            console.log('PURPLE_ORWEL: Change track successful')
          })
          .catch((err) => {
            console.error('PURPLE_ORWEL: Change track error', err)
          })
        break
      case 'SET_TOKEN':
        token = message.value
        break
    }
  })
  chrome.runtime.onMessage.addListener((message, sender, cb) => {
    console.log('message received to background', message)
    if (typeof message !== 'object') return
    if (message.type === 'GET_STATUS') {
      cb(isListening)
    } else if (message.type === 'GET_IS_AUTHENTICATED') {
      cb(token !== null)
    }
  })
})
