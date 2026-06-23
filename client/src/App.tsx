import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import AppLayout from '@/components/layout/AppLayout'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import OfflineBanner from '@/components/common/OfflineBanner'
import HomePage from '@/pages/HomePage'
import SearchPage from '@/pages/SearchPage'
import RestaurantDetailPage from '@/pages/RestaurantDetailPage'
import CurationPage from '@/pages/CurationPage'
import FavoritesPage from '@/pages/FavoritesPage'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="relative mx-auto min-h-svh max-w-[430px] overflow-hidden bg-white shadow-xl">
          <OfflineBanner />
          <ErrorBoundary>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route
                  path="/restaurant/:id"
                  element={<RestaurantDetailPage />}
                />
                <Route path="/curation" element={<CurationPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
              </Route>
            </Routes>
          </ErrorBoundary>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
