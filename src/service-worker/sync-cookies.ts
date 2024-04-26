console.log('sync-cookies')
const StorageKey = 'SYNC_COOKIE_RELATIONS' as SyncCookie.StorageKey

const syncCookie = async (relations?: SyncCookie.Relation[]) => {
  if (!relations) {
    const { [StorageKey]: initRelations } = await chrome.storage.local.get(StorageKey)
    relations = initRelations
  }
  console.log(relations)
  // TODO 待实现具体的同步逻辑
}
chrome.runtime.onMessage.addListener((message: SyncCookieMessage) => {
  const EVENT: EventSyncCookie = 'SYNC_COOKIE'
  if (message.event !== EVENT) return
  console.log('接受到同步cookie消息')
  syncCookie(message.data)
})

syncCookie()
