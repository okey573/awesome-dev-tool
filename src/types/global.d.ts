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

namespace DisguiseRequest {
  interface Relation {
    key: string;
    real: string;
    fake: string;
    open: boolean;
  }

  type DisguiseRequestEventKey = 'EVENT_DISGUISE_REQUEST'

  interface DisguiseRequestMessage {
    event: DisguiseRequestEventKey,
    data: any
  }
}
