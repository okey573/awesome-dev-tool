chrome.action.onClicked.addListener(function (tab) {
  const url = chrome.runtime.getURL('workbench.html')
  // TODO 优化：判断如果已存在打开的tab页，则不再重复打开而是定位到已打开的tab页
  chrome.tabs.create({ url })
})
