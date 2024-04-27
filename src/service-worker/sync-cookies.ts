import { getHost, logLastError } from '@/util.ts'

console.log('sync-cookies')
const StorageKey: SyncCookie.StorageKey = 'SYNC_COOKIE_RELATIONS'

const copyCookies = async (from: string, to: string) => {
  console.info(`copyCookies: from [${from}] to [${to}]`)
  const cookies = await chrome.cookies.getAll({
    domain: from
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
    const url = (secure ? 'https://' : 'http://') + to
    const setDetails = {
      url,
      domain: to,
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

const removeCookies = async (from: string, to: string) => {
  console.info(`removeCookies: from [${from}] to [${to}]`)
  const toCookies = await chrome.cookies.getAll({
    domain: to
  })
  console.log(`获取到${to}域下的cookies:\n`)
  console.log(toCookies)

  const fromCookies = await chrome.cookies.getAll({
    domain: from
  })
  console.log(`获取到${from}域下的cookies:\n`)
  console.log(fromCookies)

  toCookies.forEach((cookie) => {
    const {
      name,
      secure,
      storeId,
    } = cookie
    const url = (secure ? 'https://' : 'http://') + to
    const removeDetails = {
      url,
      name,
      storeId,
    }
    if (fromCookies.some(c => c.name === cookie.name)) {
      chrome.cookies.remove(removeDetails, function (cookie) {
        if (!cookie) {
          logLastError('RemoveCookie出错', () => console.log('setDetails: \n', removeDetails))
        }
      })
    }
  })
}

let lastSyncRelations: SyncCookie.Relation[] = []
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
    const { from, to, open } = relation
    const fromHost = getHost(from)
    const toHost = getHost(to)

    const oldRelationIndex = lastSyncRelations.findIndex(item => getHost(item.from) === fromHost && getHost(item.to) === toHost)
    if (oldRelationIndex < 0) {
      // 场景1：之前没有这一对代表新增，执行copy
      open && copyCookies(fromHost, toHost)
      continue
    }
    const [oldRelation] = lastSyncRelations.splice(oldRelationIndex, 1)
    const { open: oldOpen } = oldRelation

    // 场景2：open状态也没有修改，跳过本次遍历
    if (open === oldOpen) continue

    // 场景3：修改了open状态，根据最新状态执行 copy or clear
    if (open) {
      copyCookies(fromHost, toHost)
    } else {
      removeCookies(fromHost, toHost)
    }
  }

  // 场景4: 经过上面的遍历 lastSyncRelations 中剩下的全是 relation 中不存在的，执行remove
  for (const relation of lastSyncRelations!) {
    const { from, to, open } = relation
    const fromHost = getHost(from)
    const toHost = getHost(to)
    // 如果原本就没打开 则跳过
    if (!open) continue
    removeCookies(fromHost, toHost)
  }

  lastSyncRelations = JSON.parse(JSON.stringify(relations))
}
chrome.runtime.onMessage.addListener((message: SyncCookieMessage) => {
  const EVENT: EventSyncCookie = 'SYNC_COOKIE'
  if (message.event !== EVENT) return
  console.log('接受到同步cookie消息')
  syncCookie(message.data)
})

syncCookie()
