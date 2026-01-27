'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { PageHeader } from '@/components/layout'
import { Button, PageLoader } from '@/components/ui'
import { ProductList, ProductSearch } from '@/components/products'
import { useProducts, useCategories } from '@/hooks'
import { Plus } from 'lucide-react'

export default function ProductenPage() {
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [stockFilter, setStockFilter] = useState('')

  const { products, loading } = useProducts({
    search,
    categoryId: categoryId || undefined,
    lowStockOnly: stockFilter === 'low',
  })

  const { categories } = useCategories()

  const handleSearch = useCallback((value: string) => {
    setSearch(value)
  }, [])

  const handleCategoryChange = useCallback((value: string) => {
    setCategoryId(value)
  }, [])

  const handleStockFilterChange = useCallback((value: string) => {
    setStockFilter(value)
  }, [])

  // Filter out-of-stock products if needed
  const filteredProducts =
    stockFilter === 'out'
      ? products.filter((p) => Number(p.current_stock) <= 0)
      : products

  return (
    <div>
      <PageHeader
        title="Producten"
        description={`${filteredProducts.length} producten`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Producten' },
        ]}
        actions={
          <Link href="/producten/nieuw">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nieuw product
            </Button>
          </Link>
        }
      />

      {/* Search & Filters */}
      <div className="mb-6">
        <ProductSearch
          categories={categories}
          onSearch={handleSearch}
          onCategoryChange={handleCategoryChange}
          onStockFilterChange={handleStockFilterChange}
        />
      </div>

      {/* Product List */}
      {loading ? <PageLoader /> : <ProductList products={filteredProducts} />}
    </div>
  )
}
