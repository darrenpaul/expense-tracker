export interface IChartEmphasisOptions {
  itemStyle: {
    shadowBlur: number
    shadowOffsetX: number
    shadowColor: string
    borderColor: string
  }
  label: {
    show: boolean
    fontSize: number
    fontWeight: string
  }
}

export const chartEmphasisOptions: IChartEmphasisOptions = {
  itemStyle: {
    shadowBlur: 10,
    shadowOffsetX: 0,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    borderColor: '#fff',
  },
  label: {
    show: false,
    fontSize: 14,
    fontWeight: 'bold',
  },
}
