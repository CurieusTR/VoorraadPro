'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle, Button, Select, PageLoader } from '@/components/ui'
import { useProducts } from '@/hooks'
import { formatNumber, formatCurrency } from '@/lib/utils'
import { Download, Package } from 'lucide-react'

export default function VoorraadRapportPage() {
  const { products, loading } = useProducts()
  const [categoryFilter, setCategoryFilter] = useState('')

  const filteredProducts = categoryFilter
    ? products.filter(p => p.category_id === categoryFilter)
    : products

  const totalValue = filteredProducts.reduce((sum, p) => {
    return sum + (Number(p.current_stock) * Number(p.purchase_price || 0))
  }, 0)

  const totalProducts = filteredProducts.length
  const lowStockCount = filteredProducts.filter(p => Number(p.current_stock) <= Number(p.min_stock)).length

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))]

  if (loading) {
    return <PageLoader />
  }

  return (
    <div>
      <PageHeader
        title="Voorraadrapport"
        description="Huidige voorraad met waarde per product"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Rapporten', href: '/rapporten' },
          { label: 'Voorraadrapport' },
        ]}
        actions={
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporteren
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Totale voorraadwaarde</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Aantal producten</p>
            <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Lage voorraad</p>
            <p className="text-2xl font-bold text-red-600">{lowStockCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="mb-4">
        <Select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-48"
        >
          <option value="">Alle categorieën</option>
          {categories.map((cat) => (
            <option key={cat?.id} value={cat?.id}>{cat?.name}</option>
          ))}
        </Select>
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categorie</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Voorraad</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Inkoopprijs</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Waarde</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <Package className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    Geen producten gevonden
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const value = Number(product.current_stock) * Number(product.purchase_price || 0)
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">{product.name}</span>
                        {product.sku && <span className="text-xs text-gray-500 ml-2">({product.sku})</span>}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {product.category?.name || '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={Number(product.current_stock) <= Number(product.min_stock) ? 'text-red-600 font-medium' : ''}>
                          {formatNumber(Number(product.current_stock))} {product.unit}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-500">
                        {product.purchase_price ? formatCurrency(Number(product.purchase_price)) : '-'}
                      </td>
                      <td className="px-6 py-4 text-right font-medium">
                        {formatCurrency(value)}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
            {filteredProducts.length > 0 && (
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={4} className="px-6 py-3 text-right font-medium text-gray-900">Totaal:</td>
                  <td className="px-6 py-3 text-right font-bold text-gray-900">{formatCurrency(totalValue)}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </Card>
    </div>
  )
}
