import type { DrawResult } from '../types/raffle'

export const parseParticipants = (text: string): string[] => {
  const seen = new Set<string>()

  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((name) => {
      if (!name) {
        return false
      }

      const key = name.toLocaleLowerCase('pt-BR')
      if (seen.has(key)) {
        return false
      }

      seen.add(key)
      return true
    })
}

export const normalizePrizes = (prizes: string[]): string[] => {
  return prizes.map((item) => item.trim()).filter(Boolean)
}

export const getEligibleParticipants = (
  participantsNames: string,
  results: DrawResult[],
): string[] => {
  const allParticipants = parseParticipants(participantsNames)
  const drawnNames = new Set(
    results.map((result) => result.winnerName.toLocaleLowerCase('pt-BR')),
  )

  return allParticipants.filter(
    (name) => !drawnNames.has(name.toLocaleLowerCase('pt-BR')),
  )
}

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}
