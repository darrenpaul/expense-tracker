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
  chartType: 'pie',
  title: {
    text: '',
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
    valueFormatter: (value: number) => value,
  },
  legend: {
    type: 'scroll',
    left: 'center',
    bottom: '5%',
  },
}

export const createPieSeriesObject = (data: any) => {
  return {
    type: 'pie',
    radius: ['40%', '70%'],
    avoidLabelOverlap: false,
    itemStyle: {
      borderRadius: 5,
      borderColor: '#fff',
      borderWidth: 1,
    },
    emphasis: chartEmphasisOptions,
    label: {
      show: false,
    },
    data,
  }
}
