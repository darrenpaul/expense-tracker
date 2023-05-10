<template>
  <div class="date-picker-container">
    <!-- DISPLAY DATES FROM & TO -->
    <div class="input date-picker-button" @click="onModalOpen">
      <CalendarIcon />
      <p>
        {{ displayDate() }}
      </p>
    </div>

    <!-- CALENDAR MODAL -->
    <Modal
      :is-open="showModal"
      :background="false"
      @close="() => (showModal = false)"
    >
      <div class="date-picker-header">
        <button class="date-picker-month-button" @click="onPreviousMonthClick">
          <ArrowLeftIcon />
        </button>

        <h3>{{ MONTHS_OF_YEAR[getMonth(parseDateFormat(activeDate))] }}</h3>
        <h3>{{ getYear(parseDateFormat(activeDate)) }}</h3>

        <button class="date-picker-month-button" @click="onNextMonthClick">
          <ArrowRightIcon />
        </button>
      </div>

      <div class="date-picker-calendar-container">
        <div
          v-for="{ short, key } in DAYS_OF_WEEK"
          :key="`datePicker-${key}`"
          class="date-picker-calendar-week-days"
        >
          <h3>{{ short }}</h3>
        </div>

        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          :class="['date-picker-calendar-day', dayStyle(day)]"
          @click="() => onDayClick(day)"
        >
          <p>
            {{ getDate(day) }}
          </p>
        </div>
      </div>

      <div class="button-2-group">
        <button class="button-secondary" @click="onCancel">
          {{ COMMON_COPY.cancel }}
        </button>
        <button class="button" @click="onSetDate">
          {{ COMMON_COPY.setDate }}
        </button>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import {
  addMonths,
  eachDayOfInterval,
  getDate,
  getDaysInMonth,
  getMonth,
  getYear,
  isSameDay,
  isToday,
  subMonths,
  format,
  subDays,
  addDays,
  setDate,
  lastDayOfWeek,
  getTime,
} from 'date-fns'
import {
  DAYS_OF_WEEK,
  MONTHS_OF_YEAR,
  DATE_FORMAT,
  parseDateFormat,
  formatDate,
  DATE_FORMAT_SHORT,
  TIME_FORMAT,
  DATE_TIME_FORMAT,
} from '~~/helpers/dateTimeHelper'
import { COMMON_COPY } from '~~/constants/copy'
import ArrowLeftIcon from '~~/components/icons/ArrowLeftIcon.vue'
import ArrowRightIcon from '~~/components/icons/ArrowRightIcon.vue'
import Modal from '~~/components/Modal/index.vue'
import CalendarIcon from '~~/components/icons/CalendarIcon.vue'

const emit = defineEmits(['onChange'])

const props = defineProps({
  date: { type: String, default: format(new Date(), DATE_FORMAT) },
})

const selectedDay = ref(props.date)
const activeDate = ref(format(new Date(props.date), DATE_FORMAT))
const showModal = ref(false)

const onModalOpen = (event: Event) => {
  event.preventDefault()
  showModal.value = true
}

const onCancel = (event: Event) => {
  event.preventDefault()
  showModal.value = false
  selectedDay.value = props.date
}

const onDayClick = (day: Date) => {
  selectedDay.value = format(day, DATE_FORMAT)
}

const onPreviousMonthClick = (event: Event) => {
  event.preventDefault()
  parseDateFormat(activeDate.value)
  activeDate.value = format(
    subMonths(parseDateFormat(activeDate.value), 1),
    DATE_FORMAT
  )
}

const onNextMonthClick = (event: Event) => {
  event.preventDefault()
  parseDateFormat(activeDate.value)
  activeDate.value = format(
    addMonths(parseDateFormat(activeDate.value), 1),
    DATE_FORMAT
  )
}

const dayStyle = (day: Date) => {
  // HI-LIGHT SELECTED DATE
  if (isToday(day) && isSameDay(day, parseDateFormat(selectedDay.value))) {
    return 'font-bold date-picker-calendar-day-selected'
  }

  if (isSameDay(day, new Date(props.date))) {
    return 'date-picker-calendar-day-selected'
  }

  // HI-LIGHT THE TODAY DATE
  if (isToday(day)) {
    return 'font-bold'
  }
  // HI-LIGHT SELECTED DATE
  if (isSameDay(day, parseDateFormat(selectedDay.value))) {
    return 'date-picker-calendar-day-selected'
  }
}

const onSetDate = (event: Event) => {
  event.preventDefault()
  showModal.value = false
  const dateTimeNow = new Date()
  const selectedDateObj = new Date(selectedDay.value)
  const dateString = format(selectedDateObj, DATE_FORMAT)
  const timeString = format(dateTimeNow, TIME_FORMAT)

  const dateTime = format(
    new Date(`${dateString} ${timeString}`),
    DATE_TIME_FORMAT
  )
  emit('onChange', dateTime)
}

const calendarDays = computed(() => {
  const currentDate = parseDateFormat(activeDate.value)
  const startOfMonth = setDate(currentDate, 1)
  const endOfMonth = setDate(currentDate, getDaysInMonth(currentDate))

  const startDateRange = lastDayOfWeek(subDays(startOfMonth, 6), {
    weekStartsOn: 1,
  })

  const endDateRange = addDays(endOfMonth, 14)

  return eachDayOfInterval({
    start: startDateRange,
    end: endDateRange,
  }).splice(0, 42)
})

const displayDate = () => {
  return formatDate(new Date(selectedDay.value), DATE_FORMAT_SHORT)
}
</script>

<style lang="scss">
@import './datePicker.scss';
</style>
