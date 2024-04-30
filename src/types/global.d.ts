interface RuntimeMessage {
  event: RUN_TIME_EVENT,
  data: any
}

type RuntimeMessageHandler = (e: RuntimeMessage) => void

interface GroupedTab {
  name: string,
  tabs: chrome.tabs.Tab[]
}

type GroupedTabs = Array<GroupedTab>

declare namespace SyncCookie {
  interface Relation {
    key: string;
    from: string;
    to: string;
    open: boolean;
  }
}

declare namespace DisguiseRequest {
  interface Relation {
    key: string;
    real: string;
    fake: string;
    open: boolean;
  }
}
