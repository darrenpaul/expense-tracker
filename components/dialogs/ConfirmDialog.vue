<template>
  <Modal :is-open="props.show">
    <div>
      <div class="row centered">
        <WarningIcon :size="'54'" />
        <h2>{{ DIALOG_COPY.warning }}</h2>
      </div>
      <p>
        {{ message }}
      </p>
    </div>

    <div class="button-2-group">
      <button class="button-secondary" @click="onDecline">
        {{ DIALOG_COPY.no }}
      </button>
      <button class="button-warn" @click="onConfirm">
        {{ DIALOG_COPY.yes }}
      </button>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '~~/components/Modal/index.vue'
import { DIALOG_COPY } from '~~/constants/copy'
import WarningIcon from '~~/components/icons/WarningIcon.vue'

const emit = defineEmits(['closeModal', 'confirm'])

const props = defineProps({
  show: { type: Boolean, default: false },
  message: { type: String, default: DIALOG_COPY.defaultWarning },
})

const onDecline = () => {
  emit('closeModal')
}

const onConfirm = () => {
  emit('confirm')
}
</script>

<style lang="scss">
@import './dialogs.scss';
</style>
