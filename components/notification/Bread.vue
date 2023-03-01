<template>
  <div :class="['notification-card', notificationStyle]" @click="onNotificationClick">
    <p class="notification-message">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  id: { type: String, required: true },
  title: { type: String, default: '' },
  message: { type: String, default: '' },
  type: { type: String, default: 'info' },
  duration: { type: Number, default: 5 },
  onTimerEnd: { type: Function, default: () => { } },
  onTimerFinish: { type: Function, required: true }
})

const durationLeft = ref(props.duration)
const timer = ref(undefined)

const onNotificationClick = () => {
  props.onTimerEnd(false)
  props.onTimerFinish(props.id)
}

const notificationStyle = computed(() => {
  if (props.type === 'warn') return 'notification-warn'
  if (props.type === 'info') return 'notification-info'
  if (props.type === 'success') return 'notification-success'
  return 'notification-error'
})

const createTimer = () => {
  timer.value = setInterval(() => {
    durationLeft.value++
    if (durationLeft.value >= props.duration) {
      props.onTimerFinish(props.id)
    }
  }, 1000)
}

onMounted(() => {
  durationLeft.value = 0
  createTimer()
})
onUnmounted(() => {
  clearInterval(timer.value)
})
</script>

<style lang="scss">
@import './notification.scss';
</style>

