<template>
  <svg
    :width="props.size"
    :height="props.size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11 11H3.75C3.336 11 3 11.336 3 11.75C3 12.164 3.336 12.5 3.75 12.5H11V19.75C11 20.164 11.336 20.5 11.75 20.5C12.164 20.5 12.5 20.164 12.5 19.75V12.5H19.75C20.164 12.5 20.5 12.164 20.5 11.75C20.5 11.336 20.164 11 19.75 11H12.5V3.75C12.5 3.336 12.164 3 11.75 3C11.336 3 11 3.336 11 3.75V11Z"
      :fill="props.fill"
    />
  </svg>
</template>

<script setup lang="ts">
import { ICON_PROPS } from '~~/props/icon'
const props = defineProps(ICON_PROPS)
</script>
