import { StyledConsole } from '@/utils/styled-console.ts'
import { RUN_TIME_EVENT } from '@/enums.ts'
import { getCurrentWindowTabs, getDomain } from '@/utils'
import { registerEvent } from '@/service-worker/runtime-message-center.ts'


const doGroupTabs = async (tabs: chrome.tabs.Tab[]) => {
  const collator = new Intl.Collator()
  tabs.sort((a, b) => collator.compare(a.title!, b.title!))

  const groupedTabs: GroupedTabs = tabs.reduce((previousValue: GroupedTabs, currentValue) => {
    if (!currentValue.url || !/https?:\/\//.test(currentValue.url)) return previousValue
    const domain = getDomain(currentValue.url)
    const index = previousValue.findIndex(item => item.name === domain)
    if (index > -1) {
      previousValue[index].tabs.push(currentValue)
      return previousValue
    } else {
      return [
        ...previousValue,
        {
          name: domain,
          tabs: [currentValue]
        } as GroupedTab
      ]
    }
  }, [] as GroupedTabs)

  for (const groupedTab of groupedTabs) {
    const group = await chrome.tabs.group({ tabIds: groupedTab.tabs.map(t => t.id!) })
    await chrome.tabGroups.update(group, { title: getDomain(groupedTab.name), collapsed: true })
  }
}

const doUnGroupTabs = async (tabs: chrome.tabs.Tab[]) => {
  await chrome.tabs.ungroup(tabs.map(tab => tab.id!))
}

const changeGroupTabs = async () => {
  const tabs = await getCurrentWindowTabs()
  if (tabs.some(tab => tab.groupId !== -1)) {
    await doUnGroupTabs(tabs)
  } else {
    await doGroupTabs(tabs)
  }
}

const groupTabs = async () => {
  await doGroupTabs(await getCurrentWindowTabs())
}

const unGroupTabs = async () => {
  await doUnGroupTabs(await getCurrentWindowTabs())
}

registerEvent(RUN_TIME_EVENT.CHANGE_GROUP_TABS, changeGroupTabs)
registerEvent(RUN_TIME_EVENT.GROUP_TABS, groupTabs)
registerEvent(RUN_TIME_EVENT.UNGROUP_TABS, unGroupTabs)

console.log('script %ctab-groups-manager', StyledConsole.COLOR_PRIMARY + StyledConsole.FONT_BOLD, 'loaded')
