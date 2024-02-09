import { format, isToday, isYesterday } from "date-fns"

export default function formatDate(date: string | number | Date) {
  let dayFormat = "dd/MM/yyyy"
  let hoursFormat = "H:mm"

  const today = isToday(date)
  const yesterday = isYesterday(date)
  let readableDay = ""

  if (today) readableDay = "today"
  if (yesterday) readableDay = "yesterday"

  return `${readableDay ? readableDay : format(date, dayFormat)} at ${format(date, hoursFormat)}`
}
