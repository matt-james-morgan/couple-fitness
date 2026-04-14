import { useState } from 'react'
import { ChevronDown, ChevronUp, Clock } from 'lucide-react'
import type { Recipe } from '@/data/recipes'
import { categoryMeta } from '@/data/recipes'
import { scaleIngredient } from '@/utils/scaling'
import { useAppStore } from '@/hooks/useAppStore'

interface Props {
  recipe: Recipe
}

export default function RecipeCard({ recipe }: Props) {
  const [open, setOpen] = useState(false)
  const { person, servings } = useAppStore()
  const multiplier = servings / recipe.baseServings
  const cat = categoryMeta[recipe.category]

  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      overflow: 'hidden',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '14px 16px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{ fontSize: 28, lineHeight: 1 }}>{recipe.emoji}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: 'var(--text)', fontWeight: 600, fontSize: 15 }}>{recipe.name}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, color: 'var(--muted)' }}>
              <Clock size={11} />
              {recipe.prepTime}
            </span>
            <span style={{ fontSize: 12, color: cat.color }}>{cat.emoji} {cat.label}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--m)' }}>{recipe.macros.kcal} kcal</span>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>{recipe.macros.protein}g protein</span>
        </div>
        <span style={{ color: 'var(--muted)', marginLeft: 4 }}>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>

      {open && (
        <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--border)' }}>
          {/* Macro pills */}
          <div style={{ display: 'flex', gap: 8, paddingTop: 12, marginBottom: 14 }}>
            {[
              { label: 'Protein', val: recipe.macros.protein, color: 'var(--m)' },
              { label: 'Carbs', val: recipe.macros.carbs, color: 'var(--warm)' },
              { label: 'Fat', val: recipe.macros.fat, color: 'var(--f)' },
            ].map(m => (
              <div key={m.label} style={{
                flex: 1,
                textAlign: 'center',
                background: 'var(--card2)',
                borderRadius: 8,
                padding: '6px 4px',
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: m.color }}>{m.val}g</div>
                <div style={{ fontSize: 10, color: 'var(--muted)' }}>{m.label}</div>
              </div>
            ))}
          </div>

          {/* Ingredients */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>
              Ingredients · {servings} serving{servings !== 1 ? 's' : ''}
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 5 }}>
              {recipe.ingredients.map((ing, i) => (
                <li key={i} style={{ display: 'flex', gap: 8, fontSize: 14, color: 'var(--text)' }}>
                  <span style={{ color: 'var(--m)', marginTop: 2 }}>·</span>
                  {scaleIngredient(ing, multiplier)}
                </li>
              ))}
            </ul>
          </div>

          {/* Steps */}
          <div style={{ marginBottom: recipe.hisNote || recipe.herNote || recipe.tip ? 12 : 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>
              Steps
            </div>
            <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recipe.steps.map((step, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, fontSize: 14 }}>
                  <span style={{
                    minWidth: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: 'var(--m-dim)',
                    color: 'var(--m)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                    flexShrink: 0,
                    marginTop: 1,
                  }}>{i + 1}</span>
                  <span style={{ color: 'var(--text)' }}>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Notes */}
          {(recipe.hisNote || recipe.herNote) && (
            <div style={{
              background: 'var(--card2)',
              borderRadius: 10,
              padding: '10px 12px',
              fontSize: 13,
              color: 'var(--muted)',
            }}>
              {person === 'him' && recipe.hisNote && (
                <span style={{ color: 'var(--m)' }}>♂ {recipe.hisNote}</span>
              )}
              {person === 'her' && recipe.herNote && (
                <span style={{ color: 'var(--f)' }}>♀ {recipe.herNote}</span>
              )}
            </div>
          )}

          {recipe.tip && (
            <div style={{
              marginTop: 8,
              background: recipe.tip.gender === 'm' ? 'var(--m-dim)' : 'var(--f-dim)',
              borderLeft: `3px solid ${recipe.tip.gender === 'm' ? 'var(--m)' : 'var(--f)'}`,
              borderRadius: '0 8px 8px 0',
              padding: '8px 12px',
              fontSize: 13,
            }}>
              <span style={{ fontWeight: 700, color: recipe.tip.gender === 'm' ? 'var(--m)' : 'var(--f)' }}>
                {recipe.tip.label}:{' '}
              </span>
              <span style={{ color: 'var(--text)' }}>{recipe.tip.text}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
