export type FilterValue = 'only' | 'no' | null

export interface SolveFilters {
  plusTwo: FilterValue
  DNF: FilterValue
}

export interface SolveSort {
  sortBy: 'date' | 'time'
  reverseOrder: boolean
}

export interface SolvePopup {
  type: 'confirm' | 'select' | null
  action: 'delete' | 'session' | 'event' | '+2' | 'DNF' | 'OK' | null
  solvesCount?: number
}
