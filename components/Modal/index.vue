<template>
  <div v-if="props.isOpen" class="modal-container">
    <div class="modal-content">
      <slot></slot>
    </div>
    <div class="modal-background" @click="props.onClose"></div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  onClose: { type: Function, required: true },
  isOpen: { type: Boolean, default: false },
})
</script>

<style lang="scss" scoped>
@import './modal.scss';
</style>
