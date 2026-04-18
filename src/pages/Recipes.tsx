import { useState } from 'react'
import { Plus } from 'lucide-react'
import { categoryMeta, type Category, type Recipe } from '@/data/recipes'
import { useRecipes } from '@/hooks/useRecipes'
import RecipeCard from '@/components/RecipeCard'
import RecipeForm from '@/components/RecipeForm'
import ServingToggle from '@/components/ServingToggle'
import PersonSwitcher from '@/components/PersonSwitcher'

const categories: Category[] = ['breakfast', 'lunch', 'dinner', 'snack', 'preworkout']

export default function Recipes() {
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all')
  const [search, setSearch] = useState('')
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null)
  const [showForm, setShowForm] = useState(false)
  const { recipes, loading, error, addRecipe, updateRecipe, deleteRecipe } = useRecipes()

  const filtered = recipes.filter(r => {
    const matchCat = activeCategory === 'all' || r.category === activeCategory
    const matchSearch = search === '' || r.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  function openAdd() {
    setEditingRecipe(null)
    setShowForm(true)
  }

  function openEdit(recipe: Recipe) {
    setEditingRecipe(recipe)
    setShowForm(true)
  }

  async function handleSave(data: Omit<Recipe, 'id'>) {
    if (editingRecipe) {
      await updateRecipe(editingRecipe.id, data)
    } else {
      await addRecipe(data)
    }
  }

  return (
    <div style={{ padding: '24px 16px 16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontFamily: 'Bebas Neue', fontSize: 26, letterSpacing: '0.05em' }}>RECIPES</div>
          <button
            onClick={openAdd}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '5px 10px', borderRadius: 20,
              background: 'var(--m-dim)', border: '1px solid var(--m)',
              color: 'var(--m)', fontSize: 12, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            <Plus size={13} /> Add
          </button>
        </div>
        <PersonSwitcher />
      </div>

      {/* Serving toggle */}
      <div style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: '10px 14px',
        marginBottom: 14,
      }}>
        <ServingToggle />
      </div>

      {/* Search */}
      <input
        type="search"
        placeholder="Search recipes..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: '100%',
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '10px 14px',
          fontSize: 14,
          color: 'var(--text)',
          fontFamily: 'inherit',
          marginBottom: 14,
          outline: 'none',
        }}
      />

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 16 }}>
        <button
          onClick={() => setActiveCategory('all')}
          style={{
            flexShrink: 0,
            padding: '6px 14px',
            borderRadius: 20,
            border: '1px solid',
            borderColor: activeCategory === 'all' ? 'var(--m)' : 'var(--border)',
            background: activeCategory === 'all' ? 'var(--m-dim)' : 'transparent',
            color: activeCategory === 'all' ? 'var(--m)' : 'var(--muted)',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          All ({recipes.length})
        </button>
        {categories.map(cat => {
          const meta = categoryMeta[cat]
          const count = recipes.filter(r => r.category === cat).length
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                flexShrink: 0,
                padding: '6px 14px',
                borderRadius: 20,
                border: '1px solid',
                borderColor: activeCategory === cat ? meta.color : 'var(--border)',
                background: activeCategory === cat ? `${meta.color}22` : 'transparent',
                color: activeCategory === cat ? meta.color : 'var(--muted)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {meta.emoji} {meta.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Recipe list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px 0' }}>Loading recipes…</div>
        ) : error ? (
          <div style={{ textAlign: 'center', color: 'var(--f)', padding: '40px 0' }}>Failed to load recipes</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px 0' }}>No recipes found</div>
        ) : (
          filtered.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onEdit={openEdit}
              onDelete={deleteRecipe}
            />
          ))
        )}
      </div>

      {showForm && (
        <RecipeForm
          recipe={editingRecipe ?? undefined}
          onSave={handleSave}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}
