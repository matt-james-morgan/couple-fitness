import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppContext, useAppState } from '@/hooks/useAppStore'
import BottomNav from '@/components/BottomNav'
import Home from '@/pages/Home'
import Week from '@/pages/Week'
import Recipes from '@/pages/Recipes'
import Grocery from '@/pages/Grocery'
import Cycle from '@/pages/Cycle'
import Rules from '@/pages/Rules'
import Progress from '@/pages/Progress'

export default function App() {
  const store = useAppState()

  return (
    <AppContext.Provider value={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/week" element={<Week />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/grocery" element={<Grocery />} />
          <Route path="/cycle" element={<Cycle />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <BottomNav />
      </BrowserRouter>
    </AppContext.Provider>
  )
}
