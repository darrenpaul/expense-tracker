<template>
  <svg
    :width="props.size"
    :height="props.size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 0C5.373 0 0 5.373 0 12C0 18.627 5.373 24 12 24C18.627 24 24 18.627 24 12C24 5.373 18.627 0 12 0ZM19.753 18.305C19.492 17.719 18.964 17.314 17.882 17.064C15.589 16.535 13.454 16.071 14.489 14.119C17.634 8.177 15.322 5 12 5C8.612 5 6.356 8.299 9.511 14.119C10.577 16.083 8.363 16.546 6.118 17.064C5.034 17.314 4.51 17.722 4.251 18.31C2.846 16.587 2 14.391 2 12C2 6.486 6.486 2 12 2C17.514 2 22 6.486 22 12C22 14.389 21.155 16.583 19.753 18.305Z"
      :fill="props.fill"
    />
  </svg>
</template>

<script setup lang="ts">
import { ICON_PROPS } from '~~/props/icon'
const props = defineProps(ICON_PROPS)
</script>
