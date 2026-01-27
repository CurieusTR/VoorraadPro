'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui'
import { formatCurrency, formatNumber, getStockStatus, getStockStatusColor } from '@/lib/utils'
import type { ProductWithCategory } from '@/lib/supabase/types'
import { Package, MoreVertical } from 'lucide-react'

interface ProductListProps {
  products: ProductWithCategory[]
  onEdit?: (product: ProductWithCategory) => void
  onDelete?: (product: ProductWithCategory) => void
}

export function ProductList({ products }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Geen producten</h3>
        <p className="mt-1 text-sm text-gray-500">
          Voeg je eerste product toe om te beginnen.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Voorraad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prijs
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Marge
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Acties</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => {
              const status = getStockStatus(
                Number(product.current_stock),
                Number(product.min_stock)
              )
              const statusColor = getStockStatusColor(status)

              return (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Link
                      href={`/producten/${product.id}`}
                      className="flex items-center"
                    >
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        {product.sku && (
                          <div className="text-sm text-gray-500">{product.sku}</div>
                        )}
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    {product.category ? (
                      <Badge
                        style={{
                          backgroundColor: product.category.color
                            ? `${product.category.color}20`
                            : undefined,
                          color: product.category.color || undefined,
                        }}
                      >
                        {product.category.name}
                      </Badge>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={statusColor}>
                      {formatNumber(Number(product.current_stock))} {product.unit}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {product.selling_price
                      ? formatCurrency(Number(product.selling_price))
                      : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {product.margin_percentage
                      ? `${formatNumber(Number(product.margin_percentage))}%`
                      : '-'}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <Link
                      href={`/producten/${product.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-gray-200">
        {products.map((product) => {
          const status = getStockStatus(
            Number(product.current_stock),
            Number(product.min_stock)
          )
          const statusColor = getStockStatusColor(status)

          return (
            <Link
              key={product.id}
              href={`/producten/${product.id}`}
              className="block p-4 hover:bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {product.name}
                  </p>
                  {product.sku && (
                    <p className="text-xs text-gray-500">{product.sku}</p>
                  )}
                </div>
                <Badge className={statusColor}>
                  {formatNumber(Number(product.current_stock))} {product.unit}
                </Badge>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                {product.category && (
                  <span
                    className="px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: product.category.color
                        ? `${product.category.color}20`
                        : '#f3f4f6',
                      color: product.category.color || '#6b7280',
                    }}
                  >
                    {product.category.name}
                  </span>
                )}
                {product.selling_price && (
                  <span>{formatCurrency(Number(product.selling_price))}</span>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
