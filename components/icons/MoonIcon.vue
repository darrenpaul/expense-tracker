<template>
  <svg
    :width="props.size"
    :height="props.size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 24C5.383 24 0 18.617 0 12C0 5.383 5.383 0 12 0C13.894 0 15.63 0.497 17.37 1.179C14.422 1.683 8 4.445 8 12C8 19.454 13.917 22.208 17.37 22.821C15.87 23.667 13.894 24 12 24Z"
      :fill="props.fill"
    />
  </svg>
</template>

<script setup lang="ts">
import { ICON_PROPS } from '~~/props/icon'
const props = defineProps(ICON_PROPS)
</script>
