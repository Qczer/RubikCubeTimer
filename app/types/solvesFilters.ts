export type FilterValue = 'only' | 'no' | null

export interface SolveFilters {
  plusTwo: FilterValue
  DNF: FilterValue
}

export interface SolveSort {
  sortBy: 'date' | 'time'
  reverseOrder: boolean
}
