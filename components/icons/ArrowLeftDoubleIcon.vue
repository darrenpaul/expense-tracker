<template>
  <svg
    :width="props.size"
    :height="props.size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 3.79496L2.995 0.814965L14.127 12L2.995 23.186L0 20.205L8.167 12L0 3.79496H0ZM18.04 12L9.873 20.205L12.868 23.185L24 12L12.868 0.813965L9.873 3.79396L18.04 12V12Z"
      :fill="fill"
    />
  </svg>
</template>

<script setup lang="ts">
import { ICON_PROPS } from '~~/props/icon'
const props = defineProps(ICON_PROPS)
</script>
