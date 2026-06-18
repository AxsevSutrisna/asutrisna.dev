export const normalizeEducation = (edu) => {
  return {
    ...edu,
    start_month: edu.start_month ? parseInt(edu.start_month) : null,
    start_year: edu.start_year ? parseInt(edu.start_year) : null,
    end_month: edu.end_month ? parseInt(edu.end_month) : null,
    end_year: edu.end_year ? parseInt(edu.end_year) : null,
    is_current: edu.is_current ?? false,
  }
}

export const compareEducationTimeline = (a, b) => {
  if (a.is_current && !b.is_current) return -1
  if (!a.is_current && b.is_current) return 1

  if (a.is_current && b.is_current) {
    if (a.start_year !== b.start_year) {
      return (b.start_year || 0) - (a.start_year || 0)
    }
    return (b.start_month || 0) - (a.start_month || 0)
  }

  if (a.end_year !== b.end_year) {
    return (b.end_year || 0) - (a.end_year || 0)
  }

  if (a.end_month !== b.end_month) {
    return (b.end_month || 0) - (a.end_month || 0)
  }

  if (a.start_year !== b.start_year) {
    return (b.start_year || 0) - (a.start_year || 0)
  }

  return (b.start_month || 0) - (a.start_month || 0)
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const formatDateRange = (startMonth, startYear, endMonth, endYear, isCurrent) => {
  const formatMonthYear = (m, y) => {
    if (!y) return ''
    if (!m) return y.toString()
    return `${MONTHS[m - 1]} ${y}`
  }

  const start = formatMonthYear(startMonth, startYear)
  const end = isCurrent ? 'Present' : formatMonthYear(endMonth, endYear)

  if (!start && !end) return ''
  if (!end) return start
  return `${start} - ${end}`
}
