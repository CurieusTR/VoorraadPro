'use client'

import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@/components/ui'
import { formatNumber, formatDate } from '@/lib/utils'
import { MOVEMENT_TYPE_LABELS, type StockMovement, type Product } from '@/lib/supabase/types'
import { History, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react'

interface MovementWithProduct extends StockMovement {
  product: Pick<Product, 'id' | 'name'> | null
}

interface RecentMovementsProps {
  movements: MovementWithProduct[]
}

const inTypes = ['purchase', 'adjustment_plus', 'transfer_in', 'return_customer', 'inventory_count']

export function RecentMovements({ movements }: RecentMovementsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-gray-500" />
          Recente mutaties
        </CardTitle>
        <Link href="/voorraad">
          <Button variant="ghost" size="sm">
            Bekijk alle
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {movements.length === 0 ? (
          <p className="text-sm text-gray-500 py-4 text-center">
            Nog geen mutaties
          </p>
        ) : (
          <div className="space-y-3">
            {movements.map((movement) => {
              const isIn = inTypes.includes(movement.movement_type)

              return (
                <div
                  key={movement.id}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-1.5 rounded-full ${
                        isIn ? 'bg-green-50' : 'bg-red-50'
                      }`}
                    >
                      {isIn ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {movement.product?.name || 'Onbekend product'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {MOVEMENT_TYPE_LABELS[movement.movement_type]} -{' '}
                        {formatDate(movement.movement_date)}
                      </p>
                    </div>
                  </div>
                  <Badge variant={isIn ? 'success' : 'error'}>
                    {isIn ? '+' : '-'}
                    {formatNumber(Number(movement.quantity))} {movement.unit}
                  </Badge>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
