const PHASES = [
  {
    name: 'Menstrual',
    days: 'Days 1–5',
    emoji: '🌑',
    color: '#ff5252',
    training: 'Light movement, yoga, walks. Listen to your body.',
    nutrition: 'Slightly higher carbs for energy. Iron-rich foods. Avoid heavy deficit.',
    tips: [
      'Prioritize sleep and recovery',
      'Avoid HIIT or heavy lifting if cramping',
      'Hot water bottle + magnesium for cramps',
      'Stay hydrated — water retention is normal',
    ],
  },
  {
    name: 'Follicular',
    days: 'Days 6–13',
    emoji: '🌒',
    color: 'var(--warm)',
    training: 'Ramp up intensity. Best phase for strength PRs.',
    nutrition: 'Stick to plan. Energy is high — great time to push harder.',
    tips: [
      'Best time for progressive overload',
      'Motivation & coordination are peak',
      'Take advantage of high energy',
      'Add extra cardio if desired',
    ],
  },
  {
    name: 'Ovulatory',
    days: 'Days 14–16',
    emoji: '🌕',
    color: 'var(--m)',
    training: 'Peak performance. Go hard this week.',
    nutrition: 'Maintain macros. Focus on protein around workouts.',
    tips: [
      'Strength and endurance are highest',
      'Great time for personal records',
      'Social energy peaks — stay consistent',
      'Watch for higher body temp / extra sweating',
    ],
  },
  {
    name: 'Luteal',
    days: 'Days 17–28',
    emoji: '🌗',
    color: '#a78bfa',
    training: 'Moderate intensity. Deload if needed in final week.',
    nutrition: 'May need +100–200 kcal. Cravings are normal — plan for them.',
    tips: [
      'Bloating & water retention normal',
      'Cravings increase — pre-plan higher volume snacks',
      'Reduce high-impact training in final days',
      'Dark chocolate & complex carbs help mood',
    ],
  },
]

export default function Cycle() {
  return (
    <div style={{ padding: '24px 16px 16px' }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'Bebas Neue', fontSize: 26, letterSpacing: '0.05em' }}>CYCLE GUIDE</div>
        <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
          Training & nutrition adjusted for each phase
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {PHASES.map(phase => (
          <div key={phase.name} style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '14px 16px 12px',
              borderLeft: `4px solid ${phase.color}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 26 }}>{phase.emoji}</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: phase.color }}>{phase.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{phase.days}</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                <div style={{ background: 'var(--card2)', borderRadius: 8, padding: '8px 12px' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 3 }}>Training</div>
                  <div style={{ fontSize: 13, color: 'var(--text)' }}>{phase.training}</div>
                </div>
                <div style={{ background: 'var(--card2)', borderRadius: 8, padding: '8px 12px' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 3 }}>Nutrition</div>
                  <div style={{ fontSize: 13, color: 'var(--text)' }}>{phase.nutrition}</div>
                </div>
              </div>

              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>Tips</div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {phase.tips.map((tip, i) => (
                  <li key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--text)' }}>
                    <span style={{ color: phase.color }}>·</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
