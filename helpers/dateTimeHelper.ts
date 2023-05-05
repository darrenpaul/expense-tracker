import {
  eachDayOfInterval,
  parse,
  format,
  eachMinuteOfInterval,
  getMinutes,
} from 'date-fns'

export const DATE_TIME_FORMAT = 'yyyy-MM-dd HH:mm:ss'
export const DATE_FORMAT = 'yyyy-MM-dd'
export const DATE_FORMAT_SHORT = 'dd MMM'
export const DISPLAY_DATE_FORMAT = 'dd MMM, yyyy'
export const TIME_FORMAT = 'HH:mm:ss'

export const INTERVAL_15_MINUTES = [0, 15, 30, 45]

export const DAYS_OF_WEEK = [
  {
    long: 'Sunday',
    short: 'Sun',
    key: 'sunday',
    index: 0,
  },
  {
    long: 'Monday',
    short: 'Mon',
    key: 'monday',
    index: 1,
  },
  {
    long: 'Tuesday',
    short: 'Tue',
    key: 'tuesday',
    index: 2,
  },
  {
    long: 'Wednesday',
    short: 'Wed',
    key: 'wednesday',
    index: 3,
  },
  {
    long: 'Thursday',
    short: 'Thu',
    key: 'thursday',
    index: 4,
  },
  {
    long: 'Friday',
    short: 'Fri',
    key: 'friday',
    index: 5,
  },
  {
    long: 'Saturday',
    short: 'Sat',
    key: 'saturday',
    index: 6,
  },
]

export const MONTHS_OF_YEAR = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const todayAsString = () => {
  return formatDate(new Date())
}

export const parseDateFormat = (
  stringDate: string,
  formatString = DATE_FORMAT
) => {
  return parse(stringDate, formatString, new Date())
}

export const formatDateTime = (dateTimeValue: Date) => {
  return format(dateTimeValue, DATE_TIME_FORMAT)
}

export const formatDate = (date: Date, dateFormat = DATE_FORMAT) => {
  return format(date, dateFormat)
}

export const formatDateToDisplay = (date: Date) => {
  return format(date, DISPLAY_DATE_FORMAT)
}

export const parseTime = (time: string) => {
  const [hour, minute] = time.split(':')
  return { hour, minute }
}

export const datesFromRange = ({
  startDate,
  endDate,
}: {
  startDate: string
  endDate: string
}) => {
  return eachDayOfInterval({
    start: new Date(startDate),
    end: new Date(endDate),
  })
}

export const checkTime = ({
  currentTime,
  startTime,
  endTime,
}: {
  currentTime: string
  startTime: string
  endTime: string
}) => {
  const current = currentTime.split(':')
  const start = startTime.split(':')
  const end = endTime.split(':')
  const currentHour = parseInt(current[0])
  const currentMinute = parseInt(current[1])
  const startHour = parseInt(start[0])
  const startMinute = parseInt(start[1])
  const endHour = parseInt(end[0])
  const endMinute = parseInt(end[1])

  if (
    currentHour < startHour ||
    (currentHour === startHour && currentMinute < startMinute)
  ) {
    return false
  } else if (
    currentHour > endHour ||
    (currentHour === endHour && currentMinute > endMinute)
  ) {
    return false
  }
  return true
}

export const addTimeToStringDate = (date: String, time = '00:00') => {
  return `${date} ${time}`
}

export const intervalsOf15Minutes = (start: string, end: string) => {
  return eachMinuteOfInterval({
    start: parseDateFormat(start, DATE_TIME_FORMAT),
    end: parseDateFormat(end, DATE_TIME_FORMAT),
  })
    .filter((dt) => getMinutes(dt) === 0 || getMinutes(dt) % 15 === 0)
    .map((dt) => formatDateTime(dt))
}
