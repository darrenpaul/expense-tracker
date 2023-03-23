<template>
  <svg
    :width="props.size"
    :height="props.size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.211 7.15505C10.07 7.04705 9.911 6.99805 9.755 6.99805C9.366 6.99805 9 7.30405 9 7.74705V16.248C9 16.693 9.367 16.998 9.755 16.998C9.912 16.998 10.071 16.948 10.212 16.839C11.766 15.636 14.411 13.587 15.71 12.581C15.894 12.439 16 12.221 16 11.989C16 11.759 15.893 11.54 15.709 11.398L10.211 7.15505ZM10.5 14.718V9.27205L14.022 11.991L10.5 14.718Z"
      :fill="props.fill"
    />
  </svg>
</template>

<script setup lang="ts">
import { ICON_PROPS } from '~~/props/icon'
const props = defineProps(ICON_PROPS)
</script>
