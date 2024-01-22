import { format, isToday, isYesterday } from "date-fns"

export default function dateFormat(date: string | number | Date) {
  let day = "dd/MM/yyyy"
  let hours = "H:mm"
  const dateFormat = `${day} at ${hours}`

  const today = isToday(date)
  const yesterday = isYesterday(date)
  let readableDate = ""

  if (today) readableDate = "today"
  if (yesterday) readableDate = "yesterday"

  if (readableDate) {
    return `${readableDate} at ${format(date, hours)}`
  }

  return format(date, dateFormat)
}
