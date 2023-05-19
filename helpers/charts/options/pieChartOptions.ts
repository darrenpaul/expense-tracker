import { chartEmphasisOptions } from './emphasisOptions'

export interface IPieChartOptions {
  chartType: string
  title: {
    text: string
    left: string
  }
  tooltip: {
    trigger: string
    valueFormatter: Function
  }
  legend: {
    type: string
    left: string
    bottom: string
  }
  series?: Array<Object>
}

export const pieChartBaseOptions: IPieChartOptions = {
  title: {
    text: '',
    left: 'center',
  },
  chartType: 'pie',
  tooltip: {
    trigger: 'item',
    valueFormatter: (value: number) => value,
  },
  legend: {
    type: 'scroll',
    left: 'center',
    bottom: '2%',
  },
}

export const createPieSeriesObject = (data: any) => {
  return {
    type: 'pie',
    radius: ['65%', '80%'],
    avoidLabelOverlap: false,
    itemStyle: {
      borderRadius: 2,
      borderColor: '#fff',
      borderWidth: 1,
    },
    emphasis: chartEmphasisOptions,
    label: {
      show: false,
    },
    center: ['50%', '45%'],
    data,
  }
}
