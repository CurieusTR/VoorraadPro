'use client'

import { PageHeader } from '@/components/layout'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Welkom bij VoorraadPro"
        description="Overzicht van je voorraad"
      />

      {/* Stats */}
      <StatsCards
        totalProducts={0}
        lowStockCount={0}
        todayIn={0}
        todayOut={0}
        totalValue={0}
      />

      {/* Quick Actions */}
      <div className="mt-6">
        <QuickActions />
      </div>

      {/* Content Grid */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Lage voorraad</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Geen producten met lage voorraad</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bijna verlopen</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Geen producten die binnenkort verlopen</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Movements */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Recente mutaties</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Nog geen mutaties geregistreerd</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
