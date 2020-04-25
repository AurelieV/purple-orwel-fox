chrome.runtime.onInstalled.addListener(function () {
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
  chrome.pageAction.onClicked.addListener((tab) => {
    console.log('send Message')
    chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE_STATUS' })
  })

  chrome.runtime.onMessage.addListener((message, sender) => {
    console.log('message received to background', message, sender.tab.id)
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
        break
    }
  })
})
