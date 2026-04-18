import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Recipe } from '@/data/recipes'

type Row = {
  id: string
  emoji: string
  name: string
  category: string
  tags: string[]
  prep_time: string
  kcal: number
  protein: number
  carbs: number
  fat: number
  base_servings: number
  ingredients: string[]
  steps: string[]
  his_note: string | null
  her_note: string | null
  tip: { label: string; text: string; gender: 'm' | 'f' } | null
}

function rowToRecipe(row: Row): Recipe {
  return {
    id: row.id,
    emoji: row.emoji,
    name: row.name,
    category: row.category as Recipe['category'],
    tags: row.tags,
    prepTime: row.prep_time,
    macros: { kcal: row.kcal, protein: row.protein, carbs: row.carbs, fat: row.fat },
    baseServings: row.base_servings,
    ingredients: row.ingredients,
    steps: row.steps,
    hisNote: row.his_note ?? undefined,
    herNote: row.her_note ?? undefined,
    tip: row.tip ?? undefined,
  }
}

function recipeToRow(recipe: Recipe): Row {
  return {
    id: recipe.id,
    emoji: recipe.emoji,
    name: recipe.name,
    category: recipe.category,
    tags: recipe.tags,
    prep_time: recipe.prepTime,
    kcal: recipe.macros.kcal,
    protein: recipe.macros.protein,
    carbs: recipe.macros.carbs,
    fat: recipe.macros.fat,
    base_servings: recipe.baseServings,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    his_note: recipe.hisNote ?? null,
    her_note: recipe.herNote ?? null,
    tip: recipe.tip ?? null,
  }
}

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('recipes')
      .select('*')
      .order('category')
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setRecipes((data as Row[]).map(rowToRecipe))
        setLoading(false)
      })
  }, [])

  async function addRecipe(data: Omit<Recipe, 'id'>) {
    const recipe: Recipe = { ...data, id: crypto.randomUUID() }
    const { error } = await supabase.from('recipes').insert(recipeToRow(recipe))
    if (error) throw new Error(error.message)
    setRecipes(prev => [...prev, recipe])
  }

  async function updateRecipe(id: string, data: Omit<Recipe, 'id'>) {
    const recipe: Recipe = { ...data, id }
    const { error } = await supabase.from('recipes').update(recipeToRow(recipe)).eq('id', id)
    if (error) throw new Error(error.message)
    setRecipes(prev => prev.map(r => r.id === id ? recipe : r))
  }

  async function deleteRecipe(id: string) {
    const { error } = await supabase.from('recipes').delete().eq('id', id)
    if (error) throw new Error(error.message)
    setRecipes(prev => prev.filter(r => r.id !== id))
  }

  return { recipes, loading, error, addRecipe, updateRecipe, deleteRecipe }
}
