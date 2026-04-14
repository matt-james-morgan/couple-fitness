import { createContext, useContext, useState } from 'react'

export type Person = 'him' | 'her'
export type Servings = 1 | 2 | 3 | 4 | 6 | 8

interface AppStore {
  person: Person
  servings: Servings
  setPerson: (p: Person) => void
  setServings: (s: Servings) => void
}

export const AppContext = createContext<AppStore>({
  person: 'him',
  servings: 2,
  setPerson: () => {},
  setServings: () => {},
})

export function useAppStore() {
  return useContext(AppContext)
}

export function useAppState(): AppStore {
  const [person, setPerson] = useState<Person>('him')
  const [servings, setServings] = useState<Servings>(2)
  return { person, servings, setPerson, setServings }
}
