import { RUN_TIME_EVENT } from '@/enums.ts'
import { StyledConsole } from '@/utils/styled-console.ts'

// const storageKey = STORAGE_KEY.DISGUISE_REQUEST_RELATIONS
const eventKey = RUN_TIME_EVENT.DISGUISE_REQUEST
// const relations: DisguiseRequest.Relation = [{
//   real: 'locahost',
//   fake: 'http://sys-admin.vip.vip.com'
// }]
chrome.runtime.onMessage.addListener(async (message: RuntimeMessage) => {
  if (message.event !== eventKey) return
  console.log('接受到消息')
})


chrome.runtime.onInstalled.addListener(async function () {
  const existingRules = await chrome.declarativeNetRequest.getDynamicRules()
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: existingRules.map((rule) => rule.id),
    addRules: [
      {
        id: 1,
        action: {
          type: <chrome.declarativeNetRequest.RuleActionType>'modifyHeaders',
          requestHeaders: [
            {
              header: 'cookie',
              operation: <chrome.declarativeNetRequest.HeaderOperation>'set',
              value: 'JSESSIONID=DB91FA74BF267D7F7C81F8454EA04F88; userNickname=fangshu.li; userLoginName=fangshu.li; token=3552B4385A53B04816CEC9907F9513C4; undefined=3552B4385A53B04816CEC9907F9513C4;'
            }
          ]
        },
        condition: {
          initiatorDomains: ['localhost'],
          // regexFilter: 'https://vbpm-admin.vip.vip.com',
          resourceTypes: <chrome.declarativeNetRequest.ResourceType[]>['main_frame', 'xmlhttprequest']
        }
      }
    ]
  })
})

console.log('script %cdisguise-request', StyledConsole.COLOR_PRIMARY + StyledConsole.FONT_BOLD, 'loaded')
