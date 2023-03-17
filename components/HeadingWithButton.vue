<template>
  <div class="row between items-center my-4">
    <h2>{{ props.heading }}</h2>
    <button class="button-secondary" @click="() => $emit('onClick')">
      {{ props.buttonText }}
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  heading: { type: String, default: '' },
  buttonText: { type: String, default: '' },
})

const emit = defineEmits(['onClick'])
</script>
