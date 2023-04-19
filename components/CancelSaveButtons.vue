<template>
  <!-- BUTTONS -->
  <div class="button-2-group">
    <button type="button" class="button-secondary" @click="onCancel">
      {{ COMMON_COPY.cancel }}
    </button>

    <button type="button" class="button" @click="onSave">
      {{ COMMON_COPY.save }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { COMMON_COPY } from '~~/constants/copy'

const emit = defineEmits(['onCancel', 'onSave'])

const onCancel = () => {
  emit('onCancel')
}

const onSave = (event: Event) => {
  event.preventDefault()

  emit('onSave')
}
</script>
