namespace SyncCookie {
  interface Relation {
    key: string;
    from: string;
    to: string;
    open: boolean;
  }

  type StorageKey = 'SYNC_COOKIE_RELATIONS'

  type SyncCookieEventKey = 'EVENT_SYNC_COOKIE'

  interface SyncCookieMessage {
    event: SyncCookieEventKey,
    data: SyncCookie.Relation[]
  }
}
