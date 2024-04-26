namespace SyncCookie {
  interface Relation {
    key: string;
    from: string;
    to: string;
    open: boolean;
  }

  type StorageKey = 'SYNC_COOKIE_RELATIONS'

}

type EventSyncCookie = 'SYNC_COOKIE'

interface SyncCookieMessage {
  event: EVENT_SYNC_COOKIE,
  data: SyncCookie.Relation[]
}
