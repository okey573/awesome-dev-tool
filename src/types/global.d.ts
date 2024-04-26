namespace SyncCookie {
  interface Relation {
    key: string;
    local: string;
    remote: string;
    open: boolean;
  }

  type StorageKey = 'SYNC_COOKIE_RELATIONS'
}
