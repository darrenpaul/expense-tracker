<template>
  <svg
    :width="props.size"
    :height="props.size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 3C3.522 3 3 3.379 3 4V20C3 20.62 3.519 21 4 21H20C20.621 21 21 20.48 21 20V4C21 3.522 20.621 3 20 3H4ZM4.5 19.5V4.5H14V19.5H4.5ZM10.842 15.821C10.979 15.945 11.141 16 11.3 16C11.658 16 12 15.716 12 15.295V8.705C12 8.283 11.658 8 11.3 8C11.141 8 10.979 8.055 10.842 8.178C9.753 9.16 8.158 10.595 7.266 11.398C7.096 11.551 7 11.769 7 11.999C7 12.228 7.096 12.447 7.265 12.6C8.158 13.403 9.752 14.839 10.842 15.821Z"
      :fill="props.fill"
    />
  </svg>
</template>

<script setup lang="ts">
import { ICON_PROPS } from '~~/props/icon'
const props = defineProps(ICON_PROPS)
</script>
