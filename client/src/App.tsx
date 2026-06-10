import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import HomePage from '@/pages/HomePage'
import SearchPage from '@/pages/SearchPage'
import RestaurantDetailPage from '@/pages/RestaurantDetailPage'
import CurationPage from '@/pages/CurationPage'
import FavoritesPage from '@/pages/FavoritesPage'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="relative mx-auto max-w-[430px] min-h-svh bg-white shadow-xl overflow-hidden">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
            <Route path="/curation" element={<CurationPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
