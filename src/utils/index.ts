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

export default {
  getHost,
  getHostname,
  getDomain,
  removeFistDotHost
}
