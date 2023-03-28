<template>
  <svg
    :width="props.size"
    :height="props.size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.8572 22.2857L14.8572 12L14.8572 1.71428"
      :stroke="props.fill"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M9.71425 16.5714L5.14282 12.2857L9.71425 8.00001"
      :stroke="props.fill"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M12 22.745C6.07655 22.745 1.25497 17.926 1.25497 12C1.25497 6.07404 6.07405 1.25497 12 1.25497C17.926 1.25497 22.745 6.07655 22.745 12C22.745 17.9234 17.926 22.745 12 22.745ZM12 24C18.6287 24 24 18.6287 24 12C24 5.37126 18.6287 1.3063e-06 12 7.26801e-07C5.37126 1.47298e-07 3.40445e-06 5.37126 2.82495e-06 12C2.24544e-06 18.6287 5.37377 24 12 24Z"
      :fill="props.fill"
    />
  </svg>
</template>

<script setup lang="ts">
import { ICON_PROPS } from '~~/props/icon'
const props = defineProps(ICON_PROPS)
</script>
