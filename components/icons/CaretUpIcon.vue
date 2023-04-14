<template>
  <svg
    :width="props.size"
    :height="props.size"
    viewBox="0 0 10 7"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.843 5.789C9.951 5.93 10 6.089 10 6.245C10 6.634 9.694 7 9.251 7H0.75C0.305 7 0 6.633 0 6.245C0 6.088 0.0499999 5.929 0.159 5.788C1.362 4.234 3.411 1.589 4.417 0.29C4.559 0.106 4.777 0 5.009 0C5.239 0 5.458 0.107 5.6 0.291L9.843 5.789ZM2.279 5.5H7.725L5.007 1.978L2.279 5.5Z"
      :fill="props.fill"
    />
  </svg>
</template>

<script setup lang="ts">
import { ICON_PROPS } from '~~/props/icon'
const props = defineProps(ICON_PROPS)
</script>
