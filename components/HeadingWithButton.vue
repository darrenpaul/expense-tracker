<template>
  <div class="row between items-center my-4">
    <h2>{{ props.heading }}</h2>

    <div class="flex flex-col md:flex-row gap-4">
      <slot></slot>

      <button class="button-secondary" @click="() => $emit('onClick')">
        {{ props.buttonText }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  heading: { type: String, default: '' },
  buttonText: { type: String, default: '' },
})

const emit = defineEmits(['onClick'])
</script>
