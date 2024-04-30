import { RUN_TIME_EVENT } from '@/enums.ts'
import { isObject } from '@/utils'
import { StyledConsole } from '@/utils/styled-console.ts'

type MessageCenterType = {
  [key in RUN_TIME_EVENT]: RuntimeMessageHandler[]
}

const MessageCenter: MessageCenterType = {} as MessageCenterType

export const registerEvent = function (event: RUN_TIME_EVENT, handler: RuntimeMessageHandler) {
  const events = MessageCenter[event]
  if (!events) {
    MessageCenter[event] = [handler]
  } else {
    MessageCenter[event].push(handler)
  }
  console.log(`registered event: %c${event} %c@ ${new Date().toLocaleString()}`, StyledConsole.COLOR_PRIMARY, StyledConsole.COLOR_TEXT)
}

export const listenEvent = function (message: RuntimeMessage) {
  const ev: RUN_TIME_EVENT = message.event
  const events: RuntimeMessageHandler[] = MessageCenter[ev]
  events.forEach((event: RuntimeMessageHandler) => event(message))
}

export const emitEvent = function (message: RuntimeMessage | RUN_TIME_EVENT) {
  if (isObject(message)) {
    chrome.runtime.sendMessage(message)
  } else {
    chrome.runtime.sendMessage({ event: message } as RuntimeMessage)
  }
}


chrome.runtime.onMessage.addListener(listenEvent)
