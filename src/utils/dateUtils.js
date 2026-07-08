export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

export const formatDateRange = (
  startMonth,
  startYear,
  endMonth,
  endYear,
  isCurrent
) => {
  const formatMonthYear = (m, y) => {
    if (!y) return ""
    if (!m) return y.toString()
    return `${MONTHS_SHORT[m - 1] || "Jan"} ${y}`
  }

  const start = formatMonthYear(startMonth, startYear)
  const end = isCurrent ? "Present" : formatMonthYear(endMonth, endYear)

  if (!start && !end) return ""
  if (!end) return start
  return `${start} - ${end}`
}
