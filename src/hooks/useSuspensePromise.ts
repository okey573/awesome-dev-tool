// @ts-ignore
export default function (promise: Promise) {
  if (promise.status === 'fulfilled') {
    return promise.value
  } else if (promise.status === 'rejected') {
    throw promise.reason
  } else if (promise.status === 'pending') {
    throw promise
  } else {
    promise.status = 'pending'
    promise.then(
      // @ts-ignore
      result => {
        promise.status = 'fulfilled'
        promise.value = result
      },
      // @ts-ignore
      reason => {
        promise.status = 'rejected'
        promise.reason = reason
      },
    )
    throw promise
  }
}
