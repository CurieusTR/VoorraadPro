'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PageHeader } from '@/components/layout'
import { Button, PageLoader, Select } from '@/components/ui'
import { StockOverview } from '@/components/stock'
import { MovementHistory } from '@/components/stock'
import { useProducts, useStockMovements } from '@/hooks'
import { Plus, History, Package } from 'lucide-react'

type ViewMode = 'overview' | 'history'

export default function VoorraadPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('overview')
  const [stockFilter, setStockFilter] = useState('')

  const { products, loading: productsLoading } = useProducts()
  const { movements, loading: movementsLoading } = useStockMovements({ limit: 50 })

  const loading = viewMode === 'overview' ? productsLoading : movementsLoading

  // Filter products
  const filteredProducts =
    stockFilter === 'low'
      ? products.filter((p) => Number(p.current_stock) <= Number(p.min_stock))
      : stockFilter === 'out'
      ? products.filter((p) => Number(p.current_stock) <= 0)
      : products

  return (
    <div>
      <PageHeader
        title="Voorraad"
        description={
          viewMode === 'overview'
            ? `${filteredProducts.length} producten`
            : `${movements.length} mutaties`
        }
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Voorraad' },
        ]}
        actions={
          <Link href="/voorraad/mutatie">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nieuwe mutatie
            </Button>
          </Link>
        }
      />

      {/* View Toggle & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex rounded-lg border border-gray-200 bg-white p-1">
          <button
            onClick={() => setViewMode('overview')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              viewMode === 'overview'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Package className="h-4 w-4" />
            Overzicht
          </button>
          <button
            onClick={() => setViewMode('history')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              viewMode === 'history'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <History className="h-4 w-4" />
            Geschiedenis
          </button>
        </div>

        {viewMode === 'overview' && (
          <Select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="sm:w-48"
          >
            <option value="">Alle producten</option>
            <option value="low">Lage voorraad</option>
            <option value="out">Geen voorraad</option>
          </Select>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <PageLoader />
      ) : viewMode === 'overview' ? (
        <StockOverview products={filteredProducts} />
      ) : (
        <MovementHistory movements={movements} />
      )}
    </div>
  )
}
