export const shortAddr = (address: string): string => {
  return address.slice(0, 6) + "..." + address.slice(address.length - 4)
}

export const timeDiff = (timestamp: number): string => {
  const c = Date.now()
  const d = c - timestamp

  const year = new Date(0).setUTCFullYear(1971)
  const day = new Date(0).setUTCDate(2)
  const hour = new Date(0).setUTCHours(1)
  const minute = new Date(0).setUTCMinutes(0)

  return (
    d > year ? `${Math.floor(d / year)} year${Math.floor(d / year) > 1 ? 's' : ''}` :
      d > day ? `${Math.floor(d / day)} day${Math.floor(d / day) > 1 ? 's' : ''}` :
        d > hour ? `${Math.floor(d / hour)} hour${Math.floor(d / hour) > 1 ? 's' : ''}` :
          d > minute ? `${Math.floor(d / minute)} minute${Math.floor(d / minute) > 1 ? 's' : ''}` : `${d / 1000} seconds`
  )

}

