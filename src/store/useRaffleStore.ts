import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import {
  DEFAULT_PRIZE_COUNT,
  EMPTY_LIST_LENGTH,
  MINIMUM_PRIZE_COUNT,
  NO_AVAILABLE_PRIZE_INDEX,
  RANDOM_ID_RADIX,
  RANDOM_ID_SLICE_START,
  STORAGE_KEY,
} from '../constants/raffle'
import { getEligibleParticipants, normalizePrizes } from '../lib/raffle'
import type { DrawResult, RaffleStore } from '../types/raffle'

const buildDefaultPrizes = () => Array.from({ length: DEFAULT_PRIZE_COUNT }, () => '')

const createInitialState = () => ({
  participantsNames: '',
  prizes: buildDefaultPrizes(),
  results: [] as DrawResult[],
})

const createDrawId = () =>
  `${Date.now()}-${Math.random().toString(RANDOM_ID_RADIX).slice(RANDOM_ID_SLICE_START)}`

const pickRandomItem = <T>(items: T[]) => items[Math.floor(Math.random() * items.length)]

export const useRaffleStore = create<RaffleStore>()(
  persist(
    (set, get) => ({
      ...createInitialState(),
      setParticipantsNames: (value) => {
        set({ participantsNames: value })
      },
      addPrize: () => {
        const { prizes } = get()
        set({ prizes: [...prizes, ''] })
      },
      updatePrize: (index, value) => {
        const { prizes } = get()
        const next = [...prizes]
        next[index] = value
        set({ prizes: next })
      },
      removePrize: (index) => {
        const { prizes } = get()
        if (prizes.length <= MINIMUM_PRIZE_COUNT) {
          return
        }

        const nextPrizes = prizes.filter((_, itemIndex) => itemIndex !== index)

        set({
          prizes: nextPrizes.length > EMPTY_LIST_LENGTH ? nextPrizes : [''],
          results: [],
        })
      },
      drawNextWinner: () => {
        const { participantsNames, prizes, results } = get()
        const validPrizes = normalizePrizes(prizes)
        const eligible = getEligibleParticipants(participantsNames, results)
        const nextPrizeIndex = validPrizes.length - 1 - results.length

        if (
          nextPrizeIndex <= NO_AVAILABLE_PRIZE_INDEX ||
          eligible.length === EMPTY_LIST_LENGTH
        ) {
          return null
        }

        const winner = pickRandomItem(eligible)
        const result: DrawResult = {
          id: createDrawId(),
          prizeLabel: validPrizes[nextPrizeIndex],
          winnerName: winner,
          drawOrder: results.length + 1,
          drawnAt: new Date().toLocaleString('pt-BR', {
            timeZone: 'America/Sao_Paulo',
          }),
        }

        set({ results: [...results, result] })
        return result
      },
      resetDraws: () => {
        set({ results: [] })
      },
      clearAll: () => {
        set(createInitialState())
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        participantsNames: state.participantsNames,
        prizes: state.prizes,
        results: state.results,
      }),
    },
  ),
)
