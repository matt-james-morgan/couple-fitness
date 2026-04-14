import { useNavigate } from 'react-router-dom'

const RULES = [
  { emoji: '🥩', rule: 'Hit protein every day', detail: 'Him: 185g · Her: 140g. Non-negotiable.' },
  { emoji: '💧', rule: 'Drink 3L water daily', detail: 'More on training days. Sparkling counts.' },
  { emoji: '😴', rule: 'Sleep 7–9 hours', detail: 'Sleep is when fat loss actually happens.' },
  { emoji: '🚫', rule: 'No liquid calories', detail: 'No juice, soda, or creamy coffees.' },
  { emoji: '🍺', rule: 'Limit alcohol', detail: 'Max 1–2 drinks/week. No beer — vodka soda if needed.' },
  { emoji: '🍳', rule: 'Meal prep Sundays', detail: 'Cook grains, proteins, and snacks for the week.' },
  { emoji: '📱', rule: 'Track every day', detail: 'Log food even on bad days. Awareness is progress.' },
  { emoji: '⚖️', rule: 'Weigh in weekly', detail: 'Same time, same conditions. Friday morning.' },
  { emoji: '🏋️', rule: 'Hit all 5 workouts', detail: '2 misses max per month. Protect the streak.' },
  { emoji: '🥗', rule: 'Veggies at every meal', detail: 'At least 1 cup of greens per meal.' },
  { emoji: '🍫', rule: 'Plan your treats', detail: 'Pre-log cheat meals. No surprise binges.' },
  { emoji: '🤝', rule: 'Accountability partner', detail: 'Check in daily. Celebrate wins together.' },
]

const MILESTONES = [
  { weight: '-5 lbs', reward: 'New workout gear', done: true },
  { weight: '-10 lbs', reward: 'Spa / massage day', done: true },
  { weight: '-15 lbs', reward: 'New outfit shopping', done: false },
  { weight: '-20 lbs', reward: 'Weekend trip', done: false },
  { weight: 'Goal weight', reward: 'Big celebration vacation', done: false },
]

const MORE_LINKS = [
  { label: 'Cycle Guide', emoji: '🌙', to: '/cycle' },
  { label: 'Progress Charts', emoji: '📈', to: '/progress' },
]

export default function Rules() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '24px 16px 16px' }}>
      <div style={{ fontFamily: 'Bebas Neue', fontSize: 26, letterSpacing: '0.05em', marginBottom: 20 }}>RULES & MORE</div>

      {/* More pages */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {MORE_LINKS.map(link => (
          <button
            key={link.to}
            onClick={() => navigate(link.to)}
            style={{
              flex: 1,
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: '14px 10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 26 }}>{link.emoji}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{link.label}</span>
          </button>
        ))}
      </div>

      {/* Rules */}
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 12 }}>
        The Rules
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
        {RULES.map((r, i) => (
          <div key={i} style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '12px 14px',
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 22, lineHeight: 1.3 }}>{r.emoji}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{r.rule}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{r.detail}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Milestones */}
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 12 }}>
        Milestones 🏆
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {MILESTONES.map((m, i) => (
          <div key={i} style={{
            background: 'var(--card)',
            border: `1px solid ${m.done ? 'var(--m)' : 'var(--border)'}`,
            borderRadius: 12,
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: m.done ? 'var(--m)' : 'var(--card2)',
              border: `2px solid ${m.done ? 'var(--m)' : 'var(--border2)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: 13,
            }}>
              {m.done ? <span style={{ color: '#000', fontWeight: 700 }}>✓</span> : ''}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: m.done ? 'var(--m)' : 'var(--text)' }}>{m.weight}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{m.reward}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
