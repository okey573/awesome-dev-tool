import './sync-cookies'

chrome.action.onClicked.addListener(async function () {
  const url = chrome.runtime.getURL('workbench.html')
  const windows = await chrome.windows.getAll({ populate: true })
  for (const window of windows) {
    const tabs = window.tabs || []
    for (const tab of tabs) {
      if (tab.url?.startsWith(url) && window.focused) {
        await chrome.tabs.update(tab.id!, { active: true })
        return
      }
    }
  }
  await chrome.tabs.create({ url })
})
