'use client'

import { Badge } from '@/components/ui'
import { formatNumber, formatDate } from '@/lib/utils'
import { MOVEMENT_TYPE_LABELS, type StockMovementWithProduct } from '@/lib/supabase/types'
import { getMovementDirection } from '@/hooks'
import { TrendingUp, TrendingDown, History } from 'lucide-react'

interface MovementHistoryProps {
  movements: StockMovementWithProduct[]
}

export function MovementHistory({ movements }: MovementHistoryProps) {
  if (movements.length === 0) {
    return (
      <div className="text-center py-12">
        <History className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Geen mutaties
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Er zijn nog geen voorraadmutaties geregistreerd.
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
                Datum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hoeveelheid
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prijs
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Leverancier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Referentie
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {movements.map((movement) => {
              const isIn = getMovementDirection(movement.movement_type) === 'in'

              return (
                <tr key={movement.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(movement.movement_date, 'long')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {movement.product?.name || 'Onbekend'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={isIn ? 'success' : 'error'}>
                      {MOVEMENT_TYPE_LABELS[movement.movement_type]}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {isIn ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          isIn ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {isIn ? '+' : '-'}
                        {formatNumber(Number(movement.quantity))} {movement.unit}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {movement.total_price
                      ? `€ ${formatNumber(Number(movement.total_price))}`
                      : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {(movement as any).supplier?.name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {movement.reference || '-'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-gray-200">
        {movements.map((movement) => {
          const isIn = getMovementDirection(movement.movement_type) === 'in'

          return (
            <div key={movement.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isIn ? (
                    <div className="p-1.5 rounded-full bg-green-50">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                  ) : (
                    <div className="p-1.5 rounded-full bg-red-50">
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {movement.product?.name || 'Onbekend'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(movement.movement_date)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-medium ${
                      isIn ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {isIn ? '+' : '-'}
                    {formatNumber(Number(movement.quantity))} {movement.unit}
                  </p>
                  <Badge variant={isIn ? 'success' : 'error'} className="mt-1">
                    {MOVEMENT_TYPE_LABELS[movement.movement_type]}
                  </Badge>
                </div>
              </div>
              {(movement as any).supplier?.name && (
                <p className="mt-2 text-xs text-gray-500">
                  Leverancier: {(movement as any).supplier.name}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
