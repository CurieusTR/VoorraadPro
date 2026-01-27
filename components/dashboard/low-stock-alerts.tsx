'use client'

import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@/components/ui'
import { formatNumber, getStockStatus, getStockStatusColor } from '@/lib/utils'
import type { Product } from '@/lib/supabase/types'
import { AlertTriangle, ArrowRight } from 'lucide-react'

interface LowStockAlertsProps {
  products: Product[]
}

export function LowStockAlerts({ products }: LowStockAlertsProps) {
  const sortedProducts = [...products]
    .sort((a, b) => Number(a.current_stock) - Number(b.current_stock))
    .slice(0, 5)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Lage voorraad
        </CardTitle>
        {products.length > 5 && (
          <Link href="/voorraad?filter=low">
            <Button variant="ghost" size="sm">
              Bekijk alle
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        )}
      </CardHeader>
      <CardContent>
        {sortedProducts.length === 0 ? (
          <p className="text-sm text-gray-500 py-4 text-center">
            Geen producten met lage voorraad
          </p>
        ) : (
          <div className="space-y-3">
            {sortedProducts.map((product) => {
              const status = getStockStatus(
                Number(product.current_stock),
                Number(product.min_stock)
              )
              const statusColor = getStockStatusColor(status)

              return (
                <Link
                  key={product.id}
                  href={`/producten/${product.id}`}
                  className="flex items-center justify-between py-2 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Min: {formatNumber(Number(product.min_stock))} {product.unit}
                    </p>
                  </div>
                  <Badge className={statusColor}>
                    {formatNumber(Number(product.current_stock))} {product.unit}
                  </Badge>
                </Link>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
