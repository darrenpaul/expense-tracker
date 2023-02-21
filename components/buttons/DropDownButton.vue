<template>
  <div class="dropdown-button-container">
    <button :class="[buttonStyle]" @click="() => (isActive = !isActive)">
      <slot name="buttonIcon"></slot>
      {{ buttonText }}
    </button>

    <div v-if="isActive" class="dropdown-button-content">
      <slot name="dropdownButtons"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useContext } from 'unctx/index'

const props = defineProps({
  buttonText: { type: String, default: '' },
  buttonStyle: { type: String, default: '' },
})

const isActive = ref(false)

const router = useRouter()
router.beforeEach(() => {
  isActive.value = false
})
</script>

<style lang="scss" scoped>
@import './dropdownButton.scss';
</style>
