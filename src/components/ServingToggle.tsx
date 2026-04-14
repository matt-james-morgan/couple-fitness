import { useAppStore, type Servings } from '@/hooks/useAppStore'

const OPTIONS: Servings[] = [1, 2, 3, 4, 6, 8]

export default function ServingToggle() {
  const { servings, setServings } = useAppStore()

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>Servings</span>
      <div style={{ display: 'flex', gap: 4 }}>
        {OPTIONS.map(n => (
          <button
            key={n}
            onClick={() => setServings(n)}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: '1px solid',
              borderColor: servings === n ? 'var(--m)' : 'var(--border)',
              background: servings === n ? 'var(--m-dim)' : 'transparent',
              color: servings === n ? 'var(--m)' : 'var(--muted)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}
