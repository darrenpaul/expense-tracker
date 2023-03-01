<template>
  <div class="notification" @click="onNotificationClick">
    <TransitionGroup name="slide-fade">
      <Bread
        v-for="(item, index) in notificationQueue"
        :id="item.id"
        :key="index"
        :title="item.title"
        :message="item.message"
        :type="item.type"
        :on-timer-finish="onTimerFinish"
      />
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import Bread from './Bread.vue'

const props = defineProps({
  notification: { type: Object, default: {} },
  duration: { type: Number, default: 5 },
})

const notificationQueue = ref([])

const makeUID = (length) => {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

const onTimerFinish = (id) => {
  notificationQueue.value = notificationQueue.value.filter(
    (lol) => lol.id !== id
  )
}

watch([props], () => {
  if (props.notification) {
    notificationQueue.value.push({
      id: makeUID(5),
      title: props.notification.title,
      message: props.notification.message,
      type: props.notification.type,
    })
  }
})
</script>

<style lang="scss">
@import './notification.scss';
</style>
