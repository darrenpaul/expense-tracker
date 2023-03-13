<template>
  <svg
    :width="props.size"
    :height="props.size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 16.67L2.829 19.5L12.004 10.161L21.171 19.5L24 16.67L12.004 4.5L0 16.67Z"
      :fill="props.fill"
    />
  </svg>
</template>

<script setup lang="ts">
import { ICON_PROPS } from '~~/props/icon'
const props = defineProps(ICON_PROPS)
</script>
