'use client'

import Link from 'next/link'
import { Badge, Button } from '@/components/ui'
import { formatNumber, getStockStatus, getStockStatusColor } from '@/lib/utils'
import type { ProductWithCategory } from '@/lib/supabase/types'
import { Package, Plus, Minus } from 'lucide-react'

interface StockOverviewProps {
  products: ProductWithCategory[]
}

export function StockOverview({ products }: StockOverviewProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Geen producten
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Voeg eerst producten toe om voorraad te beheren.
        </p>
        <Link href="/producten/nieuw">
          <Button className="mt-4">Product toevoegen</Button>
        </Link>
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
                Min. voorraad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acties
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
              const statusLabel = {
                ok: 'OK',
                low: 'Laag',
                critical: 'Kritiek',
                out: 'Op',
              }[status]

              return (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Link
                      href={`/producten/${product.id}`}
                      className="text-sm font-medium text-gray-900 hover:text-blue-600"
                    >
                      {product.name}
                    </Link>
                    {product.sku && (
                      <p className="text-xs text-gray-500">{product.sku}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {product.category ? (
                      <span className="text-sm text-gray-600">
                        {product.category.name}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      {formatNumber(Number(product.current_stock))} {product.unit}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">
                      {formatNumber(Number(product.min_stock))} {product.unit}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={statusColor}>{statusLabel}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/voorraad/mutatie?product=${product.id}&type=purchase`}
                      >
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link
                        href={`/voorraad/mutatie?product=${product.id}&type=sale`}
                      >
                        <Button variant="outline" size="sm">
                          <Minus className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
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
            <div key={product.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Link
                  href={`/producten/${product.id}`}
                  className="text-sm font-medium text-gray-900"
                >
                  {product.name}
                </Link>
                <Badge className={statusColor}>
                  {formatNumber(Number(product.current_stock))} {product.unit}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Min: {formatNumber(Number(product.min_stock))} {product.unit}
                </span>
                <div className="flex gap-2">
                  <Link
                    href={`/voorraad/mutatie?product=${product.id}&type=purchase`}
                  >
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      IN
                    </Button>
                  </Link>
                  <Link
                    href={`/voorraad/mutatie?product=${product.id}&type=sale`}
                  >
                    <Button variant="outline" size="sm">
                      <Minus className="h-4 w-4 mr-1" />
                      UIT
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
