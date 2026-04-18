import { useState } from 'react'
import { X } from 'lucide-react'
import type { Recipe, Category } from '@/data/recipes'

type FormData = {
  emoji: string
  name: string
  category: Category
  prepTime: string
  baseServings: number
  kcal: number
  protein: number
  carbs: number
  fat: number
  ingredients: string
  steps: string
  hisNote: string
  herNote: string
}

const EMPTY: FormData = {
  emoji: '🍽️',
  name: '',
  category: 'lunch',
  prepTime: '',
  baseServings: 1,
  kcal: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  ingredients: '',
  steps: '',
  hisNote: '',
  herNote: '',
}

function toForm(r: Recipe): FormData {
  return {
    emoji: r.emoji,
    name: r.name,
    category: r.category,
    prepTime: r.prepTime,
    baseServings: r.baseServings,
    kcal: r.macros.kcal,
    protein: r.macros.protein,
    carbs: r.macros.carbs,
    fat: r.macros.fat,
    ingredients: r.ingredients.join('\n'),
    steps: r.steps.join('\n'),
    hisNote: r.hisNote ?? '',
    herNote: r.herNote ?? '',
  }
}

interface Props {
  recipe?: Recipe
  onSave: (data: Omit<Recipe, 'id'>) => Promise<void>
  onClose: () => void
}

export default function RecipeForm({ recipe, onSave, onClose }: Props) {
  const [form, setForm] = useState<FormData>(recipe ? toForm(recipe) : EMPTY)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    setErr(null)
    try {
      await onSave({
        emoji: form.emoji || '🍽️',
        name: form.name.trim(),
        category: form.category,
        tags: recipe?.tags ?? ['GF', 'DF', 'Both'],
        prepTime: form.prepTime,
        baseServings: form.baseServings,
        macros: { kcal: form.kcal, protein: form.protein, carbs: form.carbs, fat: form.fat },
        ingredients: form.ingredients.split('\n').map(s => s.trim()).filter(Boolean),
        steps: form.steps.split('\n').map(s => s.trim()).filter(Boolean),
        hisNote: form.hisNote.trim() || undefined,
        herNote: form.herNote.trim() || undefined,
        tip: recipe?.tip,
      })
      onClose()
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--card2)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '9px 12px',
    fontSize: 14,
    color: 'var(--text)',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.08em',
    color: 'var(--muted)',
    textTransform: 'uppercase',
    marginBottom: 5,
  }

  const macroFields: { key: 'kcal' | 'protein' | 'carbs' | 'fat'; label: string }[] = [
    { key: 'kcal', label: 'Kcal' },
    { key: 'protein', label: 'Protein' },
    { key: 'carbs', label: 'Carbs' },
    { key: 'fat', label: 'Fat' },
  ]

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.65)',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: 'var(--bg)',
        borderRadius: '20px 20px 0 0',
        maxHeight: '92dvh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px 12px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}>
          <div style={{ fontFamily: 'Bebas Neue', fontSize: 22, letterSpacing: '0.05em' }}>
            {recipe ? 'EDIT RECIPE' : 'ADD RECIPE'}
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ overflowY: 'auto', padding: '16px 20px', flex: 1 }}>

          {/* Emoji + Name */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 68, flexShrink: 0 }}>
              <label style={labelStyle}>Emoji</label>
              <input
                style={{ ...inputStyle, textAlign: 'center', fontSize: 22, padding: '6px 4px' }}
                value={form.emoji}
                onChange={e => set('emoji', e.target.value)}
                maxLength={2}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Name *</label>
              <input
                style={inputStyle}
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="Tuna Melt"
                required
              />
            </div>
          </div>

          {/* Category + Prep time */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Category</label>
              <select
                style={{ ...inputStyle, cursor: 'pointer' }}
                value={form.category}
                onChange={e => set('category', e.target.value as Category)}
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
                <option value="preworkout">Pre-Workout</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Prep Time</label>
              <input
                style={inputStyle}
                value={form.prepTime}
                onChange={e => set('prepTime', e.target.value)}
                placeholder="15 min"
              />
            </div>
          </div>

          {/* Base Servings */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Base Servings</label>
            <input
              style={{ ...inputStyle, width: 80 }}
              type="number"
              min={1}
              value={form.baseServings}
              onChange={e => set('baseServings', Number(e.target.value))}
            />
          </div>

          {/* Macros */}
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>
            Macros (per serving)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
            {macroFields.map(({ key, label }) => (
              <div key={key}>
                <label style={{ ...labelStyle, marginBottom: 4 }}>{label}</label>
                <input
                  style={{ ...inputStyle, padding: '9px 4px', textAlign: 'center' }}
                  type="number"
                  min={0}
                  value={form[key]}
                  onChange={e => set(key, Number(e.target.value))}
                />
              </div>
            ))}
          </div>

          {/* Ingredients */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Ingredients (one per line)</label>
            <textarea
              style={{ ...inputStyle, minHeight: 100, resize: 'vertical', lineHeight: 1.6 }}
              value={form.ingredients}
              onChange={e => set('ingredients', e.target.value)}
              placeholder={'1 can tuna\n2 slices bread\n14g cheese'}
            />
          </div>

          {/* Steps */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Steps (one per line)</label>
            <textarea
              style={{ ...inputStyle, minHeight: 80, resize: 'vertical', lineHeight: 1.6 }}
              value={form.steps}
              onChange={e => set('steps', e.target.value)}
              placeholder={'Mix tuna with mayo\nAssemble on bread\nGrill until cheese melts'}
            />
          </div>

          {/* His/Her notes */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>His Note (optional)</label>
            <input style={inputStyle} value={form.hisNote} onChange={e => set('hisNote', e.target.value)} placeholder="e.g. Add extra cheese" />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Her Note (optional)</label>
            <input style={inputStyle} value={form.herNote} onChange={e => set('herNote', e.target.value)} placeholder="e.g. Skip the cheese" />
          </div>

          {err && (
            <div style={{ color: 'var(--f)', fontSize: 13, marginBottom: 12 }}>{err}</div>
          )}

          <button
            type="submit"
            disabled={saving || !form.name.trim()}
            style={{
              width: '100%',
              padding: '14px',
              background: 'var(--m)',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              fontFamily: 'inherit',
              cursor: saving || !form.name.trim() ? 'not-allowed' : 'pointer',
              opacity: saving || !form.name.trim() ? 0.6 : 1,
              marginBottom: 32,
            }}
          >
            {saving ? 'Saving…' : recipe ? 'Save Changes' : 'Add Recipe'}
          </button>
        </form>
      </div>
    </div>
  )
}
