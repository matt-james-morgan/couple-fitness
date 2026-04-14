import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/hooks/useAppStore'
import PersonSwitcher from '@/components/PersonSwitcher'

const HIM = {
  kcal: 2400, protein: 185, carbs: 270, fat: 60,
  current: 205, goal: 180, unit: 'lbs',
  phase: 'Cut',
}
const HER = {
  kcal: 1900, protein: 140, carbs: 200, fat: 60,
  current: 198, goal: 168, unit: 'lbs',
  phase: 'Cut',
}

const quickLinks = [
  { label: 'Training Week', emoji: '📅', to: '/week' },
  { label: 'Recipes', emoji: '🍳', to: '/recipes' },
  { label: 'Grocery List', emoji: '🛒', to: '/grocery' },
  { label: 'Progress', emoji: '📈', to: '/progress' },
  { label: 'Cycle Guide', emoji: '🌙', to: '/cycle' },
  { label: 'Rules', emoji: '📋', to: '/rules' },
]

export default function Home() {
  const { person } = useAppStore()
  const stats = person === 'him' ? HIM : HER
  const navigate = useNavigate()
  const accent = person === 'him' ? 'var(--m)' : 'var(--f)'
  const accentDim = person === 'him' ? 'var(--m-dim)' : 'var(--f-dim)'

  const lostSoFar = stats.current - stats.goal

  return (
    <div style={{ padding: '24px 16px 16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: 'Bebas Neue', fontSize: 28, letterSpacing: '0.05em', lineHeight: 1 }}>
            COUPLE FITNESS
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Fat Loss Plan · 2025</div>
        </div>
        <PersonSwitcher />
      </div>

      {/* Stats card */}
      <div style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: 18,
        marginBottom: 16,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Daily Target</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: accent, lineHeight: 1.1 }}>{stats.kcal.toLocaleString()}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>calories</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Goal</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>{stats.goal} <span style={{ fontSize: 14 }}>{stats.unit}</span></div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>from {stats.current} {stats.unit}</div>
          </div>
        </div>

        {/* Macro pills */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { label: 'Protein', val: `${stats.protein}g`, color: accent },
            { label: 'Carbs', val: `${stats.carbs}g`, color: 'var(--warm)' },
            { label: 'Fat', val: `${stats.fat}g`, color: '#a78bfa' },
          ].map(m => (
            <div key={m.label} style={{
              flex: 1,
              background: 'var(--card2)',
              borderRadius: 10,
              padding: '8px 6px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: m.color }}>{m.val}</div>
              <div style={{ fontSize: 10, color: 'var(--muted)' }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 10 }}>
        Quick Access
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        {quickLinks.map(link => (
          <button
            key={link.to}
            onClick={() => navigate(link.to)}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: '14px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'border-color 0.15s',
            }}
          >
            <span style={{ fontSize: 22 }}>{link.emoji}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{link.label}</span>
          </button>
        ))}
      </div>

      {/* Phase badge */}
      <div style={{
        background: accentDim,
        border: `1px solid ${accent}`,
        borderRadius: 12,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <span style={{ fontSize: 24 }}>🔥</span>
        <div>
          <div style={{ fontWeight: 700, color: accent, fontSize: 14 }}>Active Phase: {stats.phase}</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>
            Target: lose {lostSoFar} lbs · high protein, moderate deficit
          </div>
        </div>
      </div>
    </div>
  )
}
