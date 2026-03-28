import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { getEligibleParticipants, normalizePrizes } from '../lib/raffle'
import type { DrawResult, RaffleStore } from '../types/raffle'

const initialState = {
  participantsText: '',
  prizes: ['Prêmio #1', 'Prêmio #2', 'Prêmio #3'],
  results: [] as DrawResult[],
}

export const useRaffleStore = create<RaffleStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      setParticipantsText: (value) => {
        set({ participantsText: value })
      },
      addPrize: () => {
        const { prizes } = get()
        set({ prizes: [...prizes, `Prêmio #${prizes.length + 1}`] })
      },
      updatePrize: (index, value) => {
        const { prizes } = get()
        const next = [...prizes]
        next[index] = value
        set({ prizes: next })
      },
      removePrize: (index) => {
        const { prizes } = get()
        if (prizes.length <= 1) {
          return
        }

        const nextPrizes = prizes.filter((_, itemIndex) => itemIndex !== index)
        const filteredPrizes = normalizePrizes(nextPrizes)

        // Reset draws when prize structure changes to avoid inconsistent mappings.
        set({
          prizes: filteredPrizes.length > 0 ? nextPrizes : ['Prêmio #1'],
          results: [],
        })
      },
      drawNextWinner: () => {
        const { participantsText, prizes, results } = get()
        const validPrizes = normalizePrizes(prizes)
        const eligible = getEligibleParticipants(participantsText, results)
        const nextPrizeIndex = validPrizes.length - 1 - results.length

        if (nextPrizeIndex < 0 || eligible.length === 0) {
          return null
        }

        const winner = eligible[Math.floor(Math.random() * eligible.length)]
        const result: DrawResult = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          prizeLabel: validPrizes[nextPrizeIndex],
          winnerName: winner,
          drawOrder: results.length + 1,
          drawnAt: Date.now(),
        }

        set({ results: [...results, result] })
        return result
      },
      resetDraws: () => {
        set({ results: [] })
      },
      clearAll: () => {
        set({ ...initialState })
      },
    }),
    {
      name: 'pt-premium-raffle',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        participantsText: state.participantsText,
        prizes: state.prizes,
        results: state.results,
      }),
    },
  ),
)
