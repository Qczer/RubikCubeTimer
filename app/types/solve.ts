export interface Solve {
  id: number
  time: number
  scramble: string
  plusTwo?: boolean
  DNF?: boolean
}

export interface Average {
  time: number
  solves: Solve[]
}
