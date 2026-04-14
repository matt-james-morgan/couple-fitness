import { NavLink, useLocation } from 'react-router-dom'
import { Home, Calendar, BookOpen, ShoppingCart, MoreHorizontal } from 'lucide-react'

const nav = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/week', icon: Calendar, label: 'Week' },
  { to: '/recipes', icon: BookOpen, label: 'Recipes' },
  { to: '/grocery', icon: ShoppingCart, label: 'Grocery' },
  { to: '/rules', icon: MoreHorizontal, label: 'More' },
]

export default function BottomNav() {
  const location = useLocation()
  const morePaths = ['/cycle', '/rules', '/progress']
  const moreActive = morePaths.includes(location.pathname)

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 600,
      background: 'var(--surface)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      zIndex: 100,
    }}>
      {nav.map(({ to, icon: Icon, label }) => {
        const isMore = label === 'More'
        return (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={({ isActive }) => ({
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              padding: '10px 0 8px',
              textDecoration: 'none',
              color: (isActive && !isMore) || (isMore && moreActive) ? 'var(--m)' : 'var(--muted)',
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: '0.02em',
              transition: 'color 0.15s',
            })}
          >
            <Icon size={20} strokeWidth={1.8} />
            {label}
          </NavLink>
        )
      })}
    </nav>
  )
}
