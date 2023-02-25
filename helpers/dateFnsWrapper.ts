import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameWeek,
  isSameDay,
  startOfMonth,
  endOfMonth,
} from 'date-fns'

import { DATE_FORMAT, DATE_TIME_FORMAT } from '~~/helpers/dateTimeHelper'

export const PERIODS = {
  day: { displayName: 'Day', name: 'day' },
  week: { displayName: 'Week', name: 'week' },
  month: { displayName: 'Month', name: 'month' },
}

export const weekStartEnd = (date = new Date()) => {
  const start = startOfWeek(date, { weekStartsOn: 1 })
  const end = endOfWeek(date, { weekStartsOn: 1 })
  return { start, end }
}
export const monthStartEnd = (date = new Date()) => {
  const start = startOfMonth(date)
  const end = endOfMonth(date)
  return { start, end }
}

export const daysOfWeek = (date = new Date()) => {
  const { start, end } = weekStartEnd(date)
  const days = eachDayOfInterval({ start, end })
  return days
}

export const daysOfMonth = (date = new Date()) => {
  const { start, end } = monthStartEnd(date)
  const days = eachDayOfInterval({ start, end })
  return days
}

export const inSameWeek = (dayA: Date, dayB: Date) => {
  return isSameWeek(dayA, dayB, { weekStartsOn: 1 })
}
