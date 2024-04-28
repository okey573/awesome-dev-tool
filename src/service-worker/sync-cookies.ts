import { getDomain, removeFistDotHost } from '@/util.ts'
import { EVENT_SYNC_COOKIE } from '@/constants.ts'

console.log('sync-cookies')
const StorageKey: SyncCookie.StorageKey = 'SYNC_COOKIE_RELATIONS'

let lastSyncRelations: SyncCookie.Relation[] = []


const getSetCookieDetails = (cookie: chrome.cookies.Cookie, to: string) => {
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
  // 这里的 `to` 是通过参数传过来的，是 `hostname`（也就是 `domain` ）而不是真的 `host` 也就是没有端口号的
  const url = (secure ? 'https://' : 'http://') + to
  const setDetails: chrome.cookies.SetDetails = {
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
  return setDetails
}
const getRemoveCookieDetails = (cookie: chrome.cookies.Cookie, to: string) => {
  const {
    name,
    secure,
    storeId,
  } = cookie
  const url = (secure ? 'https://' : 'http://') + to
  const removeDetails: chrome.cookies.Details = {
    url,
    name,
    storeId
  }
  return removeDetails
}
const copyCookies = async (from: string, to: string) => {
  console.groupCollapsed(`copyCookies: from [${from}] to [${to}] start`)

  const cookies = await chrome.cookies.getAll({ domain: from })
  console.log(`获取到${from}域下的cookies:\n`, cookies)

  for (const cookie of cookies) {
    const setDetails = getSetCookieDetails(cookie, to)
    try {
      const result = await chrome.cookies.set(setDetails)
      if (result === null) throw chrome.runtime.lastError
    } catch (e) {
      console.warn('SetCookie出错')
      console.table([e, setDetails])
    }
  }

  console.log(`copyCookies: from [${from}] to [${to}] completed`)
  console.groupEnd()
}
const removeCookies = async (from: string, to: string) => {
  console.groupCollapsed(`removeCookies: from [${from}] to [${to}] start`)

  const fromCookies = await chrome.cookies.getAll({ domain: from })
  console.log(`获取到${from}域下的cookies:\n`, fromCookies)

  const toCookies = await chrome.cookies.getAll({ domain: to })
  console.log(`获取到${to}域下的cookies:\n`, toCookies)

  for (const cookie of toCookies) {
    const removeDetails = getRemoveCookieDetails(cookie, to)
    try {
      const result = await chrome.cookies.remove(removeDetails)
      if (result === null) throw chrome.runtime.lastError
    } catch (e) {
      console.warn('RemoveCookie出错')
      console.table([e, removeDetails])
    }
  }

  console.log(`removeCookies: from [${from}] to [${to}] completed`)
  console.groupEnd()
}

const syncCookie = async (relations?: SyncCookie.Relation[]) => {
  if (!relations) {
    const { [StorageKey]: initRelations } = await chrome.storage.local.get(StorageKey)
    relations = initRelations || []
  }
  console.groupCollapsed('开始同步 cookies')
  console.log('当前同步关系如下:\n', relations)

  for (const relation of relations!) {
    const { from, to, open } = relation
    const fromDomain = getDomain(from)
    const toDomain = getDomain(to)

    const oldRelationIndex = lastSyncRelations.findIndex(item => getDomain(item.from) === fromDomain && getDomain(item.to) === toDomain)
    if (oldRelationIndex < 0) {
      // 场景1：之前没有这一对代表新增，执行copy
      open && await copyCookies(fromDomain, toDomain)
      continue
    }
    const [oldRelation] = lastSyncRelations.splice(oldRelationIndex, 1)
    const { open: oldOpen } = oldRelation

    // 场景2：open状态也没有修改，跳过本次遍历
    if (open === oldOpen) continue

    // 场景3：修改了open状态，根据最新状态执行 copy or clear
    if (open) {
      await copyCookies(fromDomain, toDomain)
    } else {
      await removeCookies(fromDomain, toDomain)
    }
  }

  // 场景4: 经过上面的遍历 lastSyncRelations 中剩下的全是 relation 中不存在的，执行remove
  for (const relation of lastSyncRelations!) {
    const { from, to, open } = relation
    const fromDomain = getDomain(from)
    const toDomain = getDomain(to)
    // 如果原本就没打开 则跳过
    if (!open) continue
    await removeCookies(fromDomain, toDomain)
  }

  lastSyncRelations = JSON.parse(JSON.stringify(relations))

  console.log('同步 cookies 完成')
  console.groupEnd()
}

chrome.runtime.onMessage.addListener(async (message: SyncCookie.SyncCookieMessage) => {
  if (message.event !== EVENT_SYNC_COOKIE) return
  console.groupCollapsed('接受到同步 cookies 消息 at ', new Date().toLocaleString())

  await syncCookie(message.data)

  console.log('消息处理完成')
  console.groupEnd()
})
chrome.cookies.onChanged.addListener(async ({ cause, cookie, removed }) => {
  const { [StorageKey]: storageRelations } = await chrome.storage.local.get(StorageKey)
  const relations = storageRelations || [] as SyncCookie.Relation[]
  const affectedRelations: SyncCookie.Relation[] = relations.filter((relation: SyncCookie.Relation) => {
    const changedCookieDomain = removeFistDotHost(cookie.domain)!
    const relationFromDomain = removeFistDotHost(getDomain(relation.from))!
    return changedCookieDomain === relationFromDomain && relation.open
  })
  if (!affectedRelations.length) return

  console.groupCollapsed(`监听到 cookie 发生变化: cause = ${cause}, removed = ${removed}, name = ${cookie.name}, domain = ${cookie.domain}, value = ${cookie.value}`)
  console.table({ cause, cookie, removed, affectedRelations })

  if (cause === 'overwrite') {
    console.log('cause = overwrite , 此次无需处理')
    console.groupEnd()
    return
  }

  for (const relation of affectedRelations) {
    if (removed) {
      const removeDetails = getRemoveCookieDetails(cookie, getDomain(relation.to))
      try {
        const result = await chrome.cookies.remove(removeDetails)
        if (result === null) throw chrome.runtime.lastError
      } catch (e) {
        console.warn('RemoveCookie出错')
        console.table([e, removeDetails])
      }
    } else {
      const setDetails = getSetCookieDetails(cookie, getDomain(relation.to))
      try {
        const result = await chrome.cookies.set(setDetails)
        if (result === null) throw chrome.runtime.lastError
      } catch (e) {
        console.warn('SetCookie出错')
        console.table([e, setDetails])
      }
    }
  }

  console.log('cookie 变化事件处理完成')
  console.groupEnd()
})

syncCookie()
