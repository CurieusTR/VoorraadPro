'use client'

import { PageHeader } from '@/components/layout'
import { Card, CardContent, Button, PageLoader } from '@/components/ui'
import { useProducts, useCategories } from '@/hooks'
import { formatCurrency } from '@/lib/utils'
import { Download, TrendingUp, Package, Tags } from 'lucide-react'

export default function WaarderingRapportPage() {
  const { products, loading: productsLoading } = useProducts()
  const { categories, loading: categoriesLoading } = useCategories()

  const loading = productsLoading || categoriesLoading

  // Calculate total value
  const totalValue = products.reduce((sum, p) => {
    return sum + (Number(p.current_stock) * Number(p.purchase_price || 0))
  }, 0)

  // Calculate value by category
  const valueByCategory = categories.map(cat => {
    const categoryProducts = products.filter(p => p.category_id === cat.id)
    const value = categoryProducts.reduce((sum, p) => {
      return sum + (Number(p.current_stock) * Number(p.purchase_price || 0))
    }, 0)
    return {
      ...cat,
      productCount: categoryProducts.length,
      value,
      percentage: totalValue > 0 ? (value / totalValue) * 100 : 0
    }
  }).sort((a, b) => b.value - a.value)

  // Products without category
  const uncategorizedProducts = products.filter(p => !p.category_id)
  const uncategorizedValue = uncategorizedProducts.reduce((sum, p) => {
    return sum + (Number(p.current_stock) * Number(p.purchase_price || 0))
  }, 0)

  // Top 5 most valuable products
  const topProducts = [...products]
    .map(p => ({
      ...p,
      value: Number(p.current_stock) * Number(p.purchase_price || 0)
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  if (loading) {
    return <PageLoader />
  }

  return (
    <div>
      <PageHeader
        title="Voorraadwaardering"
        description="Totale voorraadwaarde (inkoopprijs)"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Rapporten', href: '/rapporten' },
          { label: 'Voorraadwaardering' },
        ]}
        actions={
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporteren
          </Button>
        }
      />

      {/* Total Value Card */}
      <Card className="mb-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <TrendingUp className="h-12 w-12 opacity-80" />
            <div>
              <p className="text-blue-100">Totale voorraadwaarde</p>
              <p className="text-4xl font-bold">{formatCurrency(totalValue)}</p>
              <p className="text-blue-100 text-sm mt-1">{products.length} producten</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Value by Category */}
        <Card>
          <CardContent className="p-0">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Tags className="h-5 w-5 text-gray-400" />
                Waarde per categorie
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {valueByCategory.map(cat => (
                <div key={cat.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: cat.color || '#6B7280' }}
                    />
                    <div>
                      <p className="font-medium text-gray-900">{cat.name}</p>
                      <p className="text-sm text-gray-500">{cat.productCount} producten</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(cat.value)}</p>
                    <p className="text-sm text-gray-500">{cat.percentage.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
              {uncategorizedProducts.length > 0 && (
                <div className="p-4 flex items-center justify-between bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Zonder categorie</p>
                      <p className="text-sm text-gray-500">{uncategorizedProducts.length} producten</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(uncategorizedValue)}</p>
                    <p className="text-sm text-gray-500">
                      {totalValue > 0 ? ((uncategorizedValue / totalValue) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                </div>
              )}
              {valueByCategory.length === 0 && uncategorizedProducts.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  Geen categorieën gevonden
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardContent className="p-0">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Package className="h-5 w-5 text-gray-400" />
                Top 5 meest waardevolle producten
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {topProducts.map((product, index) => (
                <div key={product.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-medium flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        {product.current_stock} {product.unit} x {formatCurrency(Number(product.purchase_price || 0))}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium text-gray-900">{formatCurrency(product.value)}</p>
                </div>
              ))}
              {topProducts.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  Geen producten gevonden
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
