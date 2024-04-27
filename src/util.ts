export const getHost = (s: string) => {
  if (s.startsWith('https://') || s.startsWith('http://')) {
    return new URL(s).host
  }
  return new URL('http://' + s).host
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