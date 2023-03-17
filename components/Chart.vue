<template>
  <div>
    <div
      ref="chartElement"
      :style="{ width: props.width, height: props.height }"
    />
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { useUserSettings } from '~~/stores/userSettings'
import { sleep } from '~~/helpers/delay'

const props = defineProps({
  width: { type: String, default: '100%' },
  height: { type: String, default: '80vh' },
  options: {
    type: Object,
    default: () => {},
  },
})

const userSettingStore = useUserSettings()

const chartElement = ref()
const myChart = shallowRef()

onMounted(() => {
  myChart.value = echarts.init(chartElement.value)
  myChart.value.setOption(props.options)
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})

watch(
  () => userSettingStore.sidePanelExpanded,
  async () => {
    await sleep(5)
    myChart.value.resize()
  }
)

watch(
  () => props.options,
  (newOptions, oldOptions) => {
    if (newOptions?.chartType !== oldOptions?.chartType) {
      myChart.value.clear()
    }
    myChart.value.setOption(props.options)
  }
)

const onResize = () => {
  myChart.value.resize()
}
</script>
