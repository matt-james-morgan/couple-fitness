import { useState } from 'react'
import { X } from 'lucide-react'
import type { Recipe, Category } from '@/data/recipes'

// Number fields stored as strings to avoid leading-zero issues
type FormData = {
  emoji: string
  name: string
  category: Category
  prepTime: string
  baseServings: string
  kcal: string
  protein: string
  carbs: string
  fat: string
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
  baseServings: '1',
  kcal: '',
  protein: '',
  carbs: '',
  fat: '',
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
    baseServings: String(r.baseServings),
    kcal: String(r.macros.kcal),
    protein: String(r.macros.protein),
    carbs: String(r.macros.carbs),
    fat: String(r.macros.fat),
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
        baseServings: parseInt(form.baseServings) || 1,
        macros: {
          kcal: parseInt(form.kcal) || 0,
          protein: parseInt(form.protein) || 0,
          carbs: parseInt(form.carbs) || 0,
          fat: parseInt(form.fat) || 0,
        },
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

  const input: React.CSSProperties = {
    width: '100%',
    background: 'var(--card2)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '12px 14px',
    fontSize: 16,
    color: 'var(--text)',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
    WebkitAppearance: 'none',
  }

  const lbl: React.CSSProperties = {
    display: 'block',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.08em',
    color: 'var(--muted)',
    textTransform: 'uppercase',
    marginBottom: 6,
  }

  const macroFields: { key: 'kcal' | 'protein' | 'carbs' | 'fat'; label: string }[] = [
    { key: 'kcal', label: 'Calories' },
    { key: 'protein', label: 'Protein g' },
    { key: 'carbs', label: 'Carbs g' },
    { key: 'fat', label: 'Fat g' },
  ]

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: 'var(--bg)',
        borderRadius: '20px 20px 0 0',
        maxHeight: '95dvh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Handle bar */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 0' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border2)' }} />
        </div>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 20px 14px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}>
          <div style={{ fontFamily: 'Bebas Neue', fontSize: 24, letterSpacing: '0.05em' }}>
            {recipe ? 'EDIT RECIPE' : 'ADD RECIPE'}
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'var(--card2)', border: 'none', cursor: 'pointer',
              color: 'var(--muted)', padding: 8, borderRadius: 8, display: 'flex',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable form body */}
        <form onSubmit={handleSubmit} style={{ overflowY: 'auto', padding: '20px 20px 0', flex: 1 }}>

          {/* Emoji + Name */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 64, flexShrink: 0 }}>
              <label style={lbl}>Icon</label>
              <input
                style={{ ...input, textAlign: 'center', fontSize: 24, padding: '10px 4px' }}
                value={form.emoji}
                onChange={e => set('emoji', e.target.value)}
                maxLength={2}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={lbl}>Name *</label>
              <input
                style={input}
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="Tuna Melt"
                autoComplete="off"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div style={{ marginBottom: 16 }}>
            <label style={lbl}>Category</label>
            <select
              style={{ ...input, cursor: 'pointer' }}
              value={form.category}
              onChange={e => set('category', e.target.value as Category)}
            >
              <option value="breakfast">🌅 Breakfast</option>
              <option value="lunch">☀️ Lunch</option>
              <option value="dinner">🌙 Dinner</option>
              <option value="snack">🍎 Snack</option>
              <option value="preworkout">⚡ Pre-Workout</option>
            </select>
          </div>

          {/* Prep time + Servings */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <div style={{ flex: 2 }}>
              <label style={lbl}>Prep Time</label>
              <input
                style={input}
                value={form.prepTime}
                onChange={e => set('prepTime', e.target.value)}
                placeholder="15 min"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={lbl}>Servings</label>
              <input
                style={{ ...input, textAlign: 'center' }}
                inputMode="numeric"
                pattern="[0-9]*"
                value={form.baseServings}
                onChange={e => set('baseServings', e.target.value.replace(/\D/g, ''))}
                placeholder="1"
              />
            </div>
          </div>

          {/* Macros — 2×2 grid */}
          <div style={{ marginBottom: 16 }}>
            <label style={lbl}>Macros per serving</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {macroFields.map(({ key, label }) => (
                <div key={key}>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>{label}</div>
                  <input
                    style={{ ...input, textAlign: 'center', padding: '12px 8px' }}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={form[key]}
                    onChange={e => set(key, e.target.value.replace(/\D/g, ''))}
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Ingredients */}
          <div style={{ marginBottom: 16 }}>
            <label style={lbl}>Ingredients — one per line</label>
            <textarea
              style={{ ...input, minHeight: 110, resize: 'vertical', lineHeight: 1.7 }}
              value={form.ingredients}
              onChange={e => set('ingredients', e.target.value)}
              placeholder={'1 can tuna\n2 slices bread\n14g cheese'}
            />
          </div>

          {/* Steps */}
          <div style={{ marginBottom: 16 }}>
            <label style={lbl}>Steps — one per line <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
            <textarea
              style={{ ...input, minHeight: 90, resize: 'vertical', lineHeight: 1.7 }}
              value={form.steps}
              onChange={e => set('steps', e.target.value)}
              placeholder={'Mix tuna with mayo\nAssemble on bread\nGrill until cheese melts'}
            />
          </div>

          {/* His/Her notes */}
          <div style={{ marginBottom: 16 }}>
            <label style={lbl}>His Note <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
            <input style={input} value={form.hisNote} onChange={e => set('hisNote', e.target.value)} placeholder="e.g. Add extra cheese" />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={lbl}>Her Note <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
            <input style={input} value={form.herNote} onChange={e => set('herNote', e.target.value)} placeholder="e.g. Skip the cheese" />
          </div>

          {err && (
            <div style={{ color: 'var(--f)', fontSize: 13, marginBottom: 12 }}>{err}</div>
          )}

          {/* Submit */}
          <div style={{ position: 'sticky', bottom: 0, background: 'var(--bg)', paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))', paddingTop: 12 }}>
            <button
              type="submit"
              disabled={saving || !form.name.trim()}
              style={{
                width: '100%',
                padding: '15px',
                background: 'var(--m)',
                color: '#000',
                border: 'none',
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 800,
                fontFamily: 'inherit',
                cursor: saving || !form.name.trim() ? 'not-allowed' : 'pointer',
                opacity: saving || !form.name.trim() ? 0.5 : 1,
              }}
            >
              {saving ? 'Saving…' : recipe ? 'Save Changes' : 'Add Recipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
