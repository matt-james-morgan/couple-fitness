import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface WeightEntry {
  id: string
  date: string      // YYYY-MM-DD
  weight: number
  bodyFat?: number
}

type Row = {
  id: string
  person: string
  date: string
  weight: number
  body_fat: number | null
}

function rowToEntry(row: Row): WeightEntry {
  return {
    id: row.id,
    date: row.date,
    weight: row.weight,
    bodyFat: row.body_fat ?? undefined,
  }
}

export function useWeights(person: 'him' | 'her') {
  const [entries, setEntries] = useState<WeightEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    supabase
      .from('weights')
      .select('*')
      .eq('person', person)
      .order('date', { ascending: true })
      .then(({ data }) => {
        setEntries(data ? (data as Row[]).map(rowToEntry) : [])
        setLoading(false)
      })
  }, [person])

  async function addEntries(newEntries: Omit<WeightEntry, 'id'>[]) {
    const rows = newEntries.map(e => ({
      person,
      date: e.date,
      weight: e.weight,
      body_fat: e.bodyFat ?? null,
    }))
    const { data, error } = await supabase
      .from('weights')
      .upsert(rows, { onConflict: 'person,date' })
      .select()
    if (error) throw new Error(error.message)
    // Merge into local state and re-sort
    const incoming = (data as Row[]).map(rowToEntry)
    setEntries(prev => {
      const map = new Map(prev.map(e => [e.date, e]))
      for (const e of incoming) map.set(e.date, e)
      return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date))
    })
  }

  async function deleteEntry(id: string) {
    const { error } = await supabase.from('weights').delete().eq('id', id)
    if (error) throw new Error(error.message)
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  async function clearAll() {
    const { error } = await supabase.from('weights').delete().eq('person', person)
    if (error) throw new Error(error.message)
    setEntries([])
  }

  return { entries, loading, addEntries, deleteEntry, clearAll }
}
