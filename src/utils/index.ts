export const getHost = (s: string) => {
  if (s.startsWith('https://') || s.startsWith('http://')) {
    return new URL(s).host
  }
  return new URL('http://' + s).host
}

export const getHostname = (s: string) => {
  if (s.startsWith('https://') || s.startsWith('http://')) {
    return new URL(s).hostname
  }
  return new URL('http://' + s).hostname
}

export const getDomain = getHostname

export const removeFistDotHost = (s: string) => {
  const matchResult = s.match(/^\.(.+$)/)
  if (matchResult === null) {
    return s
  } else {
    return matchResult![1] as string
  }
}

export const getCurrentWindowTabs: () => Promise<chrome.tabs.Tab[]> = () => {
  return chrome.tabs.query({
    currentWindow: true,
    url: ['*://*/*']
  })
}

export const typeOf: (v: any) => string = (v: any) => {
  return Object.prototype.toString.call(v).match(/\[object (.*?)\]/)![1].toLowerCase()
}

export const isObject = (v: any) => {
  return typeOf(v) === 'object'
}

export default {
  getHost,
  getHostname,
  getDomain,
  removeFistDotHost,
  getCurrentWindowTabs,
  typeOf,
  isObject
}
