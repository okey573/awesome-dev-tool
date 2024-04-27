export const getHost = (s: string) => {
  if (s.startsWith('https://') || s.startsWith('http://')) {
    return new URL(s).host
  }
  return new URL('http://' + s).host
}

export const removeFistDotHost = (s: string) => {
  const matchResult = s.match(/^\.(.+$)/)
  if (matchResult === null) {
    return s
  } else {
    return matchResult![1] as string
  }
}

export const logLastError = (message: string, additionalLogger: () => void) => {
  console.group(message)
  console.error(chrome.runtime.lastError?.message)
  additionalLogger?.()
  console.groupEnd()
}

export default {
  getHost
}