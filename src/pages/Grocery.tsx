import { useState } from 'react'

interface GroceryItem {
  name: string
  qty: string
}

interface GroceryCategory {
  name: string
  emoji: string
  items: GroceryItem[]
}

const GROCERY: GroceryCategory[] = [
  {
    name: 'Meat & Protein',
    emoji: '🥩',
    items: [
      { name: 'Chicken breast', qty: '5 lbs' },
      { name: 'Lean ground beef (93%)', qty: '3 lbs' },
      { name: 'Salmon fillets', qty: '1.5 lbs' },
      { name: 'Shrimp (frozen)', qty: '2 lbs' },
      { name: 'Eggs', qty: '2 dozen' },
      { name: 'Turkey deli slices', qty: '1 lb' },
      { name: 'Greek yogurt (plain 0%)', qty: '2 × 32oz' },
      { name: 'Cottage cheese (low fat)', qty: '2 × 16oz' },
    ],
  },
  {
    name: 'Grains & Pantry',
    emoji: '🌾',
    items: [
      { name: 'White rice', qty: '5 lbs' },
      { name: 'Oats (rolled)', qty: '42oz canister' },
      { name: 'Whole wheat wraps', qty: '1 pack (10)' },
      { name: 'Rice cakes', qty: '1 bag' },
      { name: 'Pasta (whole wheat)', qty: '2 × 16oz' },
      { name: 'Panko breadcrumbs', qty: '8oz' },
      { name: 'Almond flour', qty: '16oz' },
    ],
  },
  {
    name: 'Dairy & Dairy-Free',
    emoji: '🥛',
    items: [
      { name: 'Almond milk (unsweetened)', qty: '2 × 64oz' },
      { name: 'Cheddar cheese (light)', qty: '8oz block' },
      { name: 'Parmesan (shredded)', qty: '5oz bag' },
      { name: 'Feta cheese', qty: '6oz' },
      { name: 'Protein powder (vanilla)', qty: '2 lbs' },
    ],
  },
  {
    name: 'Produce',
    emoji: '🥦',
    items: [
      { name: 'Broccoli', qty: '2 heads' },
      { name: 'Spinach (baby)', qty: '10oz bag' },
      { name: 'Kale', qty: '1 bunch' },
      { name: 'Mixed greens', qty: '5oz bag' },
      { name: 'Bell peppers (assorted)', qty: '6' },
      { name: 'Zucchini', qty: '3' },
      { name: 'Asparagus', qty: '1 bunch' },
      { name: 'Cherry tomatoes', qty: '1 pint' },
      { name: 'Avocado', qty: '4' },
      { name: 'Banana', qty: '6' },
      { name: 'Berries (frozen)', qty: '2 lbs' },
      { name: 'Lemon', qty: '4' },
      { name: 'Garlic', qty: '1 head' },
      { name: 'Onion (yellow)', qty: '3' },
      { name: 'Sweet potato', qty: '4' },
    ],
  },
  {
    name: 'Sauces & Condiments',
    emoji: '🫙',
    items: [
      { name: 'Olive oil', qty: '1 bottle' },
      { name: 'Coconut oil', qty: '14oz jar' },
      { name: 'Low-sodium soy sauce', qty: '10oz' },
      { name: 'Hot sauce (Frank\'s)', qty: '1 bottle' },
      { name: 'Dijon mustard', qty: '1 jar' },
      { name: 'Apple cider vinegar', qty: '16oz' },
      { name: 'Salsa', qty: '16oz jar' },
      { name: 'Tahini', qty: '1 jar' },
      { name: 'Peanut butter (natural)', qty: '16oz' },
    ],
  },
  {
    name: 'Spices',
    emoji: '🌿',
    items: [
      { name: 'Paprika / smoked paprika', qty: '' },
      { name: 'Cumin', qty: '' },
      { name: 'Chili powder', qty: '' },
      { name: 'Garlic powder', qty: '' },
      { name: 'Onion powder', qty: '' },
      { name: 'Italian seasoning', qty: '' },
      { name: 'Cinnamon', qty: '' },
      { name: 'Salt & black pepper', qty: '' },
    ],
  },
  {
    name: 'Drinks & Snacks',
    emoji: '🥤',
    items: [
      { name: 'Coffee / espresso pods', qty: '1 pack' },
      { name: 'Green tea bags', qty: '1 box' },
      { name: 'Sparkling water', qty: '12 pack' },
      { name: 'Protein bars (low sugar)', qty: '6' },
      { name: 'Mixed nuts', qty: '12oz' },
      { name: 'Dark chocolate (85%)', qty: '2 bars' },
    ],
  },
]

export default function Grocery() {
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [expanded, setExpanded] = useState<Set<string>>(new Set(GROCERY.map(c => c.name)))

  function toggle(key: string) {
    setChecked(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  function toggleSection(name: string) {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })
  }

  const totalItems = GROCERY.reduce((s, c) => s + c.items.length, 0)
  const checkedCount = checked.size

  return (
    <div style={{ padding: '24px 16px 16px' }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: 'Bebas Neue', fontSize: 26, letterSpacing: '0.05em' }}>GROCERY LIST</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
          ~$180–220 CAD/week · {checkedCount}/{totalItems} items
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, marginBottom: 20, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${(checkedCount / totalItems) * 100}%`,
          background: 'var(--m)',
          borderRadius: 2,
          transition: 'width 0.3s',
        }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {GROCERY.map(cat => (
          <div key={cat.name} style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            overflow: 'hidden',
          }}>
            <button
              onClick={() => toggleSection(cat.name)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: 20 }}>{cat.emoji}</span>
              <span style={{ flex: 1, fontWeight: 700, fontSize: 15, color: 'var(--text)', textAlign: 'left' }}>{cat.name}</span>
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                {cat.items.filter(item => checked.has(`${cat.name}:${item.name}`)).length}/{cat.items.length}
              </span>
            </button>

            {expanded.has(cat.name) && (
              <div style={{ borderTop: '1px solid var(--border)', padding: '4px 0 8px' }}>
                {cat.items.map(item => {
                  const key = `${cat.name}:${item.name}`
                  const isChecked = checked.has(key)
                  return (
                    <button
                      key={key}
                      onClick={() => toggle(key)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '8px 16px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{
                        width: 20,
                        height: 20,
                        borderRadius: 6,
                        border: `2px solid ${isChecked ? 'var(--m)' : 'var(--border2)'}`,
                        background: isChecked ? 'var(--m)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.15s',
                      }}>
                        {isChecked && <span style={{ color: '#000', fontSize: 12, fontWeight: 700 }}>✓</span>}
                      </div>
                      <span style={{
                        flex: 1,
                        fontSize: 14,
                        color: isChecked ? 'var(--muted)' : 'var(--text)',
                        textDecoration: isChecked ? 'line-through' : 'none',
                        transition: 'all 0.15s',
                      }}>
                        {item.name}
                      </span>
                      {item.qty && (
                        <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>{item.qty}</span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {checkedCount > 0 && (
        <button
          onClick={() => setChecked(new Set())}
          style={{
            marginTop: 16,
            width: '100%',
            padding: '12px',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 10,
            color: 'var(--muted)',
            fontSize: 14,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Clear all checked
        </button>
      )}
    </div>
  )
}
