import { useAppStore } from '@/hooks/useAppStore'

export default function PersonSwitcher() {
  const { person, setPerson } = useAppStore()

  return (
    <div style={{
      display: 'flex',
      background: 'var(--card)',
      borderRadius: 10,
      padding: 3,
      gap: 3,
    }}>
      {(['him', 'her'] as const).map(p => (
        <button
          key={p}
          onClick={() => setPerson(p)}
          style={{
            flex: 1,
            padding: '6px 16px',
            borderRadius: 7,
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.03em',
            transition: 'all 0.15s',
            background: person === p
              ? (p === 'him' ? 'var(--m)' : 'var(--f)')
              : 'transparent',
            color: person === p ? '#000' : 'var(--muted)',
          }}
        >
          {p === 'him' ? '♂ Him' : '♀ Her'}
        </button>
      ))}
    </div>
  )
}
