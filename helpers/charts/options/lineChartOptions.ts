export interface ILineChartOptions {
  title: {
    text: string
    left: string
  }
  yAxis: {
    type: string
    axisTick: {
      show: boolean
    }
    splitLine: {
      show: boolean
    }
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
  grid: {
    left: string
    right: string
    bottom: string
    containLabel: boolean
  }
  series?: Array<Object>
}

export const lineChartBaseOptions: ILineChartOptions = {
  title: {
    text: '',
    left: 'center',
  },
  yAxis: {
    type: 'value',
    axisTick: {
      show: true,
    },
    splitLine: {
      show: true,
    },
  },
  tooltip: {
    trigger: 'axis',
    valueFormatter: (value: number) => value,
    position: { left: 'center', top: 'center' },
  },
  legend: {
    type: 'scroll',
    left: 'center',
    bottom: '2%',
  },
  grid: {
    left: '2%',
    right: '8%',
    bottom: '12%',
    containLabel: true,
  },
}

interface ICreateLineSeriesObject {
  name?: string
  data: Array<any>
  lineStyle?: { width: number; type: string }
  markLine?: {
    symbol: string
    symbolSize: number
    data: [
      {
        name: string
        xAxis: number
        label: {
          formatter: Function
        }
        symbol: string
      }
    ]
  }
}

export const createLineSeriesObject = ({
  name = '',
  data = [],
  lineStyle = { width: 3, type: 'solid' },
  markLine = undefined,
}: ICreateLineSeriesObject) => {
  return {
    name,
    data,
    type: 'line',
    lineStyle,
    markLine,
    showSymbol: false,
  }
}

export const createLineXAxisObject = (data: any, type = 'category') => {
  return {
    type,
    boundaryGap: false,
    axisLine: {
      show: false,
    },
    splitLine: {
      show: true,
    },
    data,
  }
}
