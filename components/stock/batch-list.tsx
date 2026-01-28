'use client'

import { useStockBatches } from '@/hooks'
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'
import { formatDistanceToNow, differenceInDays, parseISO } from 'date-fns'
import { nl } from 'date-fns/locale'

interface BatchListProps {
  productId: string
  productName?: string
  productUnit?: string
}

export function BatchList({ productId, productName, productUnit = 'stuk' }: BatchListProps) {
  const { batches, loading, error } = useStockBatches(productId)

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex justify-center">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-red-500">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (batches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Batch overzicht</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm">
            Geen batches gevonden. Batches worden automatisch aangemaakt bij inkoop.
          </p>
        </CardContent>
      </Card>
    )
  }

  const totalQuantity = batches.reduce((sum, b) => sum + Number(b.quantity), 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">
            Batch overzicht {productName && `- ${productName}`}
          </CardTitle>
          <Badge variant="default">
            Totaal: {totalQuantity} {productUnit}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {batches.map((batch, index) => {
            const daysUntilExpiry = batch.expiry_date
              ? differenceInDays(parseISO(batch.expiry_date), new Date())
              : null

            let expiryStatus: 'ok' | 'warning' | 'critical' = 'ok'
            if (daysUntilExpiry !== null) {
              if (daysUntilExpiry < 0) expiryStatus = 'critical'
              else if (daysUntilExpiry <= 3) expiryStatus = 'warning'
            }

            return (
              <div
                key={batch.id}
                className={`p-4 rounded-lg border-2 ${
                  index === 0
                    ? 'border-blue-200 bg-blue-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg">
                        {batch.quantity} {productUnit}
                      </span>
                      {index === 0 && (
                        <Badge variant="default" className="bg-blue-600">
                          Eerst verkopen (FIFO)
                        </Badge>
                      )}
                    </div>

                    <div className="mt-2 space-y-1 text-sm">
                      {batch.supplier && (
                        <p className="text-gray-600">
                          <span className="font-medium">Leverancier:</span>{' '}
                          {batch.supplier.name}
                        </p>
                      )}

                      {batch.unit_price && (
                        <p className="text-gray-600">
                          <span className="font-medium">Inkoopprijs:</span>{' '}
                          €{Number(batch.unit_price).toFixed(2)} / {productUnit}
                        </p>
                      )}

                      {batch.purchase_date && (
                        <p className="text-gray-600">
                          <span className="font-medium">Ingekocht:</span>{' '}
                          {new Date(batch.purchase_date).toLocaleDateString('nl-NL')}
                        </p>
                      )}

                      {batch.batch_number && (
                        <p className="text-gray-600">
                          <span className="font-medium">Batch:</span>{' '}
                          {batch.batch_number}
                        </p>
                      )}
                    </div>
                  </div>

                  {batch.expiry_date && (
                    <div className="text-right">
                      <Badge
                        variant={
                          expiryStatus === 'critical'
                            ? 'error'
                            : expiryStatus === 'warning'
                            ? 'warning'
                            : 'default'
                        }
                      >
                        {expiryStatus === 'critical' ? (
                          'Verlopen!'
                        ) : daysUntilExpiry === 0 ? (
                          'Verloopt vandaag'
                        ) : daysUntilExpiry === 1 ? (
                          'Verloopt morgen'
                        ) : (
                          `Nog ${daysUntilExpiry} dagen`
                        )}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(batch.expiry_date).toLocaleDateString('nl-NL')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            <strong>FIFO (First In, First Out):</strong> Bij verkoop wordt automatisch
            de oudste batch eerst afgeboekt. Dit zorgt voor minimale verspilling.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
