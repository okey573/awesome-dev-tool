export const getHost = (s: string) => {
  if (s.startsWith('https://') || s.startsWith('http://')) {
    return new URL(s).host
  }
  return new URL('http://' + s).host
}

export default {
  getHost
}