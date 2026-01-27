'use client'

import { Card } from '@/components/ui'
import { formatCurrency, formatNumber } from '@/lib/utils'
import {
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Wallet,
} from 'lucide-react'

interface StatsCardsProps {
  totalProducts: number
  lowStockCount: number
  todayIn: number
  todayOut: number
  totalValue: number
}

export function StatsCards({
  totalProducts,
  lowStockCount,
  todayIn,
  todayOut,
  totalValue,
}: StatsCardsProps) {
  const stats = [
    {
      name: 'Totaal producten',
      value: formatNumber(totalProducts, 0),
      icon: Package,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      name: 'Lage voorraad',
      value: formatNumber(lowStockCount, 0),
      icon: AlertTriangle,
      color: lowStockCount > 0 ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50',
    },
    {
      name: 'Vandaag IN',
      value: formatNumber(todayIn),
      icon: TrendingUp,
      color: 'text-green-600 bg-green-50',
    },
    {
      name: 'Vandaag UIT',
      value: formatNumber(todayOut),
      icon: TrendingDown,
      color: 'text-orange-600 bg-orange-50',
    },
    {
      name: 'Voorraadwaarde',
      value: formatCurrency(totalValue),
      icon: Wallet,
      color: 'text-purple-600 bg-purple-50',
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <Card key={stat.name} className="p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.name}</p>
              <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
