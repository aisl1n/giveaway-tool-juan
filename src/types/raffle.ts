export interface DrawResult {
  id: string
  prizeLabel: string
  winnerName: string
  drawOrder: number
  drawnAt: number
}

export type DrawPhase = 'idle' | 'countdown' | 'rolling' | 'result'

export interface RaffleState {
  participantsNames: string
  prizes: string[]
  results: DrawResult[]
}

export interface RaffleActions {
  setParticipantsNames: (value: string) => void
  addPrize: () => void
  updatePrize: (index: number, value: string) => void
  removePrize: (index: number) => void
  drawNextWinner: () => DrawResult | null
  resetDraws: () => void
  clearAll: () => void
}

export type RaffleStore = RaffleState & RaffleActions
