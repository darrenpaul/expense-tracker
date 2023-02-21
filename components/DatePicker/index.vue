<template>
  <div class="date-picker-container">
    <!-- DISPLAY DATES FROM & TO -->
    <div class="date-picker-button" @click="onModalOpen">
      <CalendarIcon />
      <div>
        <p>
          {{ displayDate() }}
        </p>
      </div>
    </div>

    <!-- CALENDAR MODAL -->
    <Modal :on-close="() => (showModal = false)" :is-open="showModal">
      <div class="date-picker-header">
        <button class="date-picker-month-button" @click="onPreviousMonthClick">
          <ArrowLeftIcon />
        </button>
        <div>
          <h3>{{ MONTHS_OF_YEAR[getMonth(parseDateFormat(activeDate))] }}</h3>
          <h3>{{ getYear(parseDateFormat(activeDate)) }}</h3>
        </div>
        <button class="date-picker-month-button" @click="onNextMonthClick">
          <ArrowRightIcon />
        </button>
      </div>

      <div class="date-picker-calendar-container">
        <div
          v-for="{ short, key } in DAYS_OF_WEEK"
          :key="key"
          class="date-picker-calendar-week-days"
        >
          <h3 class="">{{ short }}</h3>
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
      <button @click="onSetDate">{{ COMMON_COPY.setDate }}</button>
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
} from 'date-fns'
import {
  DAYS_OF_WEEK,
  MONTHS_OF_YEAR,
  DATE_FORMAT,
  parseDateFormat,
  formatDate,
  DATE_FORMAT_SHORT,
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

const today = format(new Date(), DATE_FORMAT)

const selectedDates = ref(props.date)
const activeDate = ref(today)
const showModal = ref(false)

const onModalOpen = (event: Event) => {
  event.preventDefault()
  showModal.value = true
}

const onDayClick = (day: Date) => {
  selectedDates.value = format(day, DATE_FORMAT)
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
  if (isSameDay(day, parseDateFormat(selectedDates.value))) {
    return 'date-picker-calendar-day-selected'
  }

  // HI-LIGHT THE TODAY DATE
  if (isToday(day)) {
    return 'font-bold'
  }
}

const onSetDate = (event: Event) => {
  event.preventDefault()
  showModal.value = false
  emit('onChange', selectedDates.value)
}

const calendarDays = computed(() => {
  const currentDate = parseDateFormat(activeDate.value)
  const startOfMonth = setDate(currentDate, 1)
  const endOfMonth = setDate(currentDate, getDaysInMonth(currentDate))

  const startDateRange = lastDayOfWeek(subDays(startOfMonth, 7), {
    weekStartsOn: 1,
  })

  const endDateRange = addDays(endOfMonth, 14)

  return eachDayOfInterval({
    start: startDateRange,
    end: endDateRange,
  }).splice(0, 42)
})

const displayDate = () => {
  return formatDate(new Date(selectedDates.value), DATE_FORMAT_SHORT)
}
</script>

<style lang="scss" scoped>
@import './datePicker.scss';
</style>
