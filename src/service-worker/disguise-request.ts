import { EVENT_DISGUISE_REQUEST } from '@/constants.ts'

console.log('disguise-request')

chrome.runtime.onMessage.addListener(async (message: DisguiseRequest.DisguiseRequestMessage) => {
  if (message.event !== EVENT_DISGUISE_REQUEST) return
  console.log('接受到消息')
})
