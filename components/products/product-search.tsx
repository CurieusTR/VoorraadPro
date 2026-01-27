'use client'

import { useState, useEffect } from 'react'
import { Input, Select } from '@/components/ui'
import { Search, X } from 'lucide-react'
import { debounce } from '@/lib/utils'
import type { Category } from '@/lib/supabase/types'

interface ProductSearchProps {
  categories: Category[]
  onSearch: (search: string) => void
  onCategoryChange: (categoryId: string) => void
  onStockFilterChange: (filter: string) => void
}

export function ProductSearch({
  categories,
  onSearch,
  onCategoryChange,
  onStockFilterChange,
}: ProductSearchProps) {
  const [searchValue, setSearchValue] = useState('')

  // Debounce search
  useEffect(() => {
    const debouncedSearch = debounce((value: string) => {
      onSearch(value)
    }, 300)

    debouncedSearch(searchValue)
  }, [searchValue, onSearch])

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Zoek op naam, SKU of barcode..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchValue && (
          <button
            onClick={() => setSearchValue('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category Filter */}
      <Select
        onChange={(e) => onCategoryChange(e.target.value)}
        className="sm:w-48"
      >
        <option value="">Alle categorieën</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </Select>

      {/* Stock Filter */}
      <Select
        onChange={(e) => onStockFilterChange(e.target.value)}
        className="sm:w-40"
      >
        <option value="">Alle voorraad</option>
        <option value="low">Lage voorraad</option>
        <option value="out">Geen voorraad</option>
      </Select>
    </div>
  )
}
