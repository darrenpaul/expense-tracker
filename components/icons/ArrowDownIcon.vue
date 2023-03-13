<template>
  <svg
    :width="props.size"
    :height="props.size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 7.33L2.829 4.5L12.004 13.839L21.171 4.5L24 7.33L12.004 19.5L0 7.33Z"
      :fill="props.fill"
    />
  </svg>
</template>

<script setup lang="ts">
import { ICON_PROPS } from '~~/props/icon'
const props = defineProps(ICON_PROPS)
</script>
