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
    d > year ? `>${Math.floor(d / year)} year(s) ago` :
      d > day ? `>${Math.floor(d / day)} day(s) ago` :
        d > hour ? `>${Math.floor(d / hour)} hour(s) ago` :
          d > minute ? `>${Math.floor(d / minute)} minute(s) ago` : `${d / 1000} second(s) ago`
  )

}

