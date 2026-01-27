'use client'

import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@/components/ui'
import {
  formatNumber,
  formatRelativeDate,
  daysUntilExpiry,
  getExpiryStatus,
  getExpiryStatusColor,
} from '@/lib/utils'
import { Clock, ArrowRight } from 'lucide-react'

interface ExpiringBatch {
  id: string
  expiry_date: string | null
  quantity: number
  product: {
    id: string
    name: string
    unit: string
  } | null
}

interface ExpiringProductsProps {
  batches: ExpiringBatch[]
}

export function ExpiringProducts({ batches }: ExpiringProductsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-yellow-500" />
          Bijna verlopen
        </CardTitle>
        {batches.length > 0 && (
          <Link href="/rapporten/vervaldatums">
            <Button variant="ghost" size="sm">
              Bekijk alle
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        )}
      </CardHeader>
      <CardContent>
        {batches.length === 0 ? (
          <p className="text-sm text-gray-500 py-4 text-center">
            Geen producten die binnenkort verlopen
          </p>
        ) : (
          <div className="space-y-3">
            {batches.map((batch) => {
              if (!batch.expiry_date || !batch.product) return null

              const days = daysUntilExpiry(batch.expiry_date)
              const status = getExpiryStatus(days)
              const statusColor = getExpiryStatusColor(status)

              return (
                <Link
                  key={batch.id}
                  href={`/producten/${batch.product.id}`}
                  className="flex items-center justify-between py-2 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {batch.product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatNumber(Number(batch.quantity))} {batch.product.unit}
                    </p>
                  </div>
                  <Badge className={statusColor}>
                    {formatRelativeDate(batch.expiry_date)}
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
