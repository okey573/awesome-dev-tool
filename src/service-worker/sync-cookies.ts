import { getDomain, removeFistDotHost } from '@/utils/index.ts'
import { StyledConsole } from '@/utils/styled-console.ts'
import { RUN_TIME_EVENT, STORAGE_KEY } from '@/enums.ts'
import { registerEvent } from '@/service-worker/runtime-message-center.ts'

const storageKey = STORAGE_KEY.SYNC_COOKIE_RELATIONS
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
  console.groupCollapsed(`copyCookies: %c${from} %c-> %c${to}`, StyledConsole.COLOR_INFO, StyledConsole.COLOR_TEXT, StyledConsole.COLOR_INFO)

  const cookies = await chrome.cookies.getAll({ domain: from })
  console.log(`%c${from}: `, StyledConsole.COLOR_PRIMARY, cookies)

  for (const cookie of cookies) {
    const setDetails = getSetCookieDetails(cookie, to)
    try {
      const result = await chrome.cookies.set(setDetails)
      if (result === null) throw chrome.runtime.lastError
      console.log(`%cSetCookie成功: %cname=${setDetails.name};%cvalue=${setDetails.value};`, StyledConsole.COLOR_SUCCESS, StyledConsole.COLOR_INFO, StyledConsole.COLOR_INFO)
    } catch (e) {
      console.warn('%cSetCookie出错', StyledConsole.COLOR_ERROR)
      console.table([e, setDetails])
    }
  }

  console.groupEnd()
}
const removeCookies = async (from: string, to: string) => {
  console.groupCollapsed(`removeCookies: %c${from} %c-> %c${to}`, StyledConsole.COLOR_INFO, StyledConsole.COLOR_TEXT, StyledConsole.COLOR_INFO)

  const fromCookies = await chrome.cookies.getAll({ domain: from })
  console.log(`%c${from}: `, StyledConsole.COLOR_PRIMARY, fromCookies)

  const toCookies = await chrome.cookies.getAll({ domain: to })
  console.log(`%c${to}: `, StyledConsole.COLOR_PRIMARY, toCookies)

  for (const cookie of toCookies) {
    const removeDetails = getRemoveCookieDetails(cookie, to)
    try {
      const result = await chrome.cookies.remove(removeDetails)
      if (result === null) throw chrome.runtime.lastError
      console.log(`%cRemoveCookie成功: %cname=${removeDetails.name};`, StyledConsole.COLOR_SUCCESS, StyledConsole.COLOR_INFO)
    } catch (e) {
      console.warn('%cRemoveCookie出错', StyledConsole.COLOR_ERROR)
      console.table([e, removeDetails])
    }
  }
  console.groupEnd()
}
const doSyncCookie = async (relations?: SyncCookie.Relation[]) => {
  if (!relations) {
    const { [storageKey]: initRelations } = await chrome.storage.local.get(storageKey)
    relations = initRelations || []
  }
  console.groupCollapsed(`sync-cookies %c @ ${new Date().toLocaleString()}`, StyledConsole.COLOR_TEXT)
  console.log('%c relations        :', StyledConsole.COLOR_BLUE_1, JSON.parse(JSON.stringify(relations)))
  console.log('%c lastSyncRelations:', StyledConsole.COLOR_BLUE_2, JSON.parse(JSON.stringify(lastSyncRelations)))

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

  console.groupEnd()
}
const syncCookie = async(message: RuntimeMessage) => {
  await doSyncCookie(message.data)
}

chrome.cookies.onChanged.addListener(async ({ cause, cookie, removed }) => {
  const { [storageKey]: storageRelations } = await chrome.storage.local.get(storageKey)
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

registerEvent(RUN_TIME_EVENT.SYNC_COOKIE, syncCookie)
doSyncCookie()

console.log('script %csync-cookies', StyledConsole.COLOR_PRIMARY + StyledConsole.FONT_BOLD, 'loaded')
