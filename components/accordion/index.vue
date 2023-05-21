<template>
  <div class="accordion-container">
    <div class="accordion-header" @click="isOpen = !isOpen">
      <h3>{{ props.title }}</h3>

      <ArrowDownIcon v-if="isOpen" />
      <ArrowUpIcon v-else />
    </div>
    <div v-if="isOpen" class="accordion-content-container"><slot /></div>
  </div>
</template>

<script setup lang="ts">
import ArrowUpIcon from '~~/components/icons/ArrowUpIcon.vue'
import ArrowDownIcon from '~~/components/icons/ArrowDownIcon.vue'

const props = defineProps({
  title: { type: String, default: '' },
})

const isOpen = ref(false)
</script>

<style lang="scss">
@import './accordion.scss';
</style>
