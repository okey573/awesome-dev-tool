import './sync-cookies'
import './disguise-request'
import './tab-groups-manager.ts'
import { registerEvent } from '@/service-worker/runtime-message-center.ts'
import { RUN_TIME_EVENT } from '@/enums.ts'

chrome.action.onClicked.addListener(async function () {
  // 点击事件
})

const openWorkbench = async () => {
  const url = chrome.runtime.getURL('workbench.html')
  // const windows = await chrome.windows.getAll({ populate: true })
  // for (const window of windows) {
  //   const tabs = window.tabs || []
  //   for (const tab of tabs) {
  //     if (tab.url?.startsWith(url) && window.focused) {
  //       await chrome.tabs.update(tab.id!, { active: true })
  //       return
  //     }
  //   }
  // }
  const tabs = await chrome.tabs.query({ currentWindow: true, url: chrome.runtime.getURL('workbench.html') })
  if (tabs.length) {
    await chrome.tabs.update(tabs[0].id!, { active: true })
  } else {
    await chrome.tabs.create({ url })
  }
}

chrome.runtime.onInstalled.addListener(() => {
  registerEvent(RUN_TIME_EVENT.OPEN_WORKBENCH, openWorkbench)
})
