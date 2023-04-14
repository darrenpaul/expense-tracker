<template>
  <div class="dropdown-button-container">
    <button :class="[buttonStyle]" @click="emit('toggleIsOpen', !props.isOpen)">
      <div class="flex items-center justify-between">
        {{ buttonText }}

        <CaretDownIcon v-if="isOpen" :size="'10'" />
        <CaretUpIcon v-else :size="'10'" />
      </div>
    </button>

    <div v-if="props.isOpen" class="dropdown-button-content">
      <slot name="dropdownButtons"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import CaretUpIcon from '~~/components/icons/CaretUpIcon.vue'
import CaretDownIcon from '~~/components/icons/CaretDownIcon.vue'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  buttonText: { type: String, default: '' },
  buttonStyle: { type: String, default: 'button-small' },
})

const emit = defineEmits(['toggleIsOpen'])

const isActive = ref(props.isOpen)

const router = useRouter()
router.beforeEach(() => {
  isActive.value = false
})
</script>

<style lang="scss" scoped>
@import './dropdownButton.scss';
</style>
