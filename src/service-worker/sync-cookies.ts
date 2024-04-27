import { getHost, logLastError } from '@/util.ts'

console.log('sync-cookies')
const StorageKey: SyncCookie.StorageKey = 'SYNC_COOKIE_RELATIONS'

const syncCookie = async (relations?: SyncCookie.Relation[]) => {
  if (!relations) {
    const { [StorageKey]: initRelations } = await chrome.storage.local.get(StorageKey)
    relations = initRelations || []
  }
  console.log(relations)
  /**
   * TODO:
   * 目前只实现了新增时的同步，关闭或者删除不会删除已同步的 cookie
   * 增加一个 lastSyncRelations
   * 比较 relations 和 lastSyncRelations 根据对应的对比结果做出动作
   */
  for (const relation of relations!) {
    const { from, to } = relation
    const fromDomain = getHost(from)
    const toDomain = getHost(to)
    const cookies = await chrome.cookies.getAll({
      domain: fromDomain
    })
    console.log(`获取到${from}域下的cookies:\n`)
    console.log(cookies)
    cookies.forEach((cookie) => {
      const {
        expirationDate,
        httpOnly,
        name,
        path,
        sameSite,
        secure,
        storeId,
        value
      } = cookie
      const url = (secure ? 'https://' : 'http://') + toDomain
      const setDetails = {
        url,
        domain: toDomain,
        expirationDate,
        httpOnly,
        name,
        path,
        sameSite,
        secure,
        storeId,
        value
      }
      /**
       * 备注： 一些 <cookie-name> 具有特殊的语义：
       *
       * __Secure- 前缀：以 __Secure- 为前缀的 cookie（连接符是前缀的一部分），必须与 secure 标志一同设置，同时必须应用于安全页面（HTTPS）。
       *
       * __Host- 前缀：以 __Host- 为前缀的 cookie，必须与 secure 标志一同设置，必须应用于安全页面（HTTPS），也禁止指定 domain 属性（也就不会发送给子域名），同时 path 属性的值必须为 /。
       */
      if (name.startsWith('__Secure-')) {
        setDetails.secure = true
        setDetails.url = setDetails.url.replace('http://', 'https://')
      }
      if (name.startsWith('__Host-')) {
        setDetails.secure = true
        setDetails.url = setDetails.url.replace('http://', 'https://')
        Reflect.deleteProperty(setDetails, 'domain')
        setDetails.path = '/'
      }
      chrome.cookies.set(setDetails, function (cookie) {
        if (!cookie) {
          logLastError('SetCookie出错', () => console.log('setDetails: \n', setDetails))
        }
      })
    })
  }
}
chrome.runtime.onMessage.addListener((message: SyncCookieMessage) => {
  const EVENT: EventSyncCookie = 'SYNC_COOKIE'
  if (message.event !== EVENT) return
  console.log('接受到同步cookie消息')
  syncCookie(message.data)
})

syncCookie()
