export type DonutInput = Record<string, number>

export interface DonutChartProps {
  data: DonutInput
  height?: number | string
  normalize?: boolean
}
