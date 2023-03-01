<template>
  <div v-if="props.isOpen" class="modal-container">
    <div class="modal-content">
      <slot></slot>
    </div>
    <div v-if="background === true" class="modal-background" @click="onClose" />
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['close'])
const props = defineProps({
  isOpen: { type: Boolean, default: false },
  background: { type: Boolean, default: true },
})

const onClose = () => {
  emit('close')
}
</script>

<style lang="scss" scoped>
@import './modal.scss';
</style>
