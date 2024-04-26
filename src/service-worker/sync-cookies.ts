console.log('sync-cookies')
chrome.runtime.onMessage.addListener((message) => {
  console.log('监听到消息')
  console.log(message)
})
