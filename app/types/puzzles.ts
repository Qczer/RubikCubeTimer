const puzzles = {
  '222': '2x2',
  '333': '3x3',
  '444': '4x4',
  '555': '5x5',
  '666': '6x6',
  '777': '7x7',
  'sq1': 'Square-1',
  'clock': 'Clock',
  'skewb': 'Skewb',
  'minx': 'Megaminx',
  'pyram': 'Pyraminx',
  '333bld': '3x3 Blindfolded',
  '333oh': '3x3 One-Handed'
}

export const twistyPlayerPuzzles = {
  '222': '2x2x2',
  '333': '3x3x3',
  '444': '4x4x4',
  '555': '5x5x5',
  '666': '6x6x6',
  '777': '7x7x7',
  'sq1': 'square1',
  'clock': 'clock',
  'skewb': 'skewb',
  'minx': 'megaminx',
  'pyram': 'pyraminx',
  '333bld': '3x3x3',
  '333oh': '3x3x3'
}

export type scramblePuzzles =
  | '222'
  | '333'
  | '444'
  | '555'
  | '666'
  | '777'
  | 'sq1'
  | 'clock'
  | 'skewb'
  | 'minx'
  | 'pyram'

export const getScrambleType = (puzzle: PuzzleKey): scramblePuzzles => {
  if (puzzle === '333oh' || puzzle === '333bld') return '333'
  else return puzzle
}

export default puzzles
export type PuzzleKey = keyof typeof puzzles
export type TwistyPuzzleIDs =
  (typeof twistyPlayerPuzzles)[keyof typeof twistyPlayerPuzzles]
