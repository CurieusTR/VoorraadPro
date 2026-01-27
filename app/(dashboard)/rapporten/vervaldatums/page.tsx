'use client'

import { PageHeader } from '@/components/layout'
import { Card, CardContent, Button, PageLoader, Badge } from '@/components/ui'
import { useProducts } from '@/hooks'
import { formatDate } from '@/lib/utils'
import { Download, AlertTriangle, Clock, CheckCircle } from 'lucide-react'

export default function VervaldatumsRapportPage() {
  const { products, loading } = useProducts()

  // For now, show products that track expiry
  // In a full implementation, this would come from stock_batches table
  const expiryProducts = products.filter(p => p.track_expiry)

  // Mock data for demonstration - in production this would come from batches
  const mockBatches = expiryProducts.map(p => ({
    product: p,
    batches: p.default_shelf_life_days ? [
      {
        id: `${p.id}-1`,
        batch_number: 'BATCH-001',
        quantity: Number(p.current_stock) * 0.6,
        expiry_date: new Date(Date.now() + (p.default_shelf_life_days * 0.3) * 24 * 60 * 60 * 1000),
      },
      {
        id: `${p.id}-2`,
        batch_number: 'BATCH-002',
        quantity: Number(p.current_stock) * 0.4,
        expiry_date: new Date(Date.now() + (p.default_shelf_life_days * 0.8) * 24 * 60 * 60 * 1000),
      }
    ] : []
  })).filter(p => p.batches.length > 0)

  const getExpiryStatus = (date: Date) => {
    const now = new Date()
    const daysUntil = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntil < 0) return { status: 'expired', label: 'Verlopen', color: 'bg-red-100 text-red-800', icon: AlertTriangle }
    if (daysUntil <= 3) return { status: 'critical', label: `${daysUntil} dagen`, color: 'bg-red-100 text-red-800', icon: AlertTriangle }
    if (daysUntil <= 7) return { status: 'warning', label: `${daysUntil} dagen`, color: 'bg-yellow-100 text-yellow-800', icon: Clock }
    return { status: 'ok', label: `${daysUntil} dagen`, color: 'bg-green-100 text-green-800', icon: CheckCircle }
  }

  if (loading) {
    return <PageLoader />
  }

  return (
    <div>
      <PageHeader
        title="Vervaldatums"
        description="Producten die binnenkort verlopen"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Rapporten', href: '/rapporten' },
          { label: 'Vervaldatums' },
        ]}
        actions={
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporteren
          </Button>
        }
      />

      {expiryProducts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Clock className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Geen producten met vervaldatum tracking
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Schakel vervaldatum tracking in bij producten om ze hier te zien.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {mockBatches.map(({ product, batches }) => (
            <Card key={product.id}>
              <CardContent className="p-0">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500">
                    Houdbaarheid: {product.default_shelf_life_days} dagen
                  </p>
                </div>
                <div className="divide-y divide-gray-200">
                  {batches.map(batch => {
                    const expiry = getExpiryStatus(batch.expiry_date)
                    const Icon = expiry.icon
                    return (
                      <div key={batch.id} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Icon className={`h-5 w-5 ${
                            expiry.status === 'expired' || expiry.status === 'critical' ? 'text-red-500' :
                            expiry.status === 'warning' ? 'text-yellow-500' : 'text-green-500'
                          }`} />
                          <div>
                            <p className="font-medium text-gray-900">{batch.batch_number}</p>
                            <p className="text-sm text-gray-500">
                              {batch.quantity.toFixed(1)} {product.unit}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={expiry.color}>{expiry.label}</Badge>
                          <p className="text-sm text-gray-500 mt-1">
                            {formatDate(batch.expiry_date)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="mt-6 bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Om vervaldatums per batch bij te houden, voer bij elke inkoop de vervaldatum in.
            Het systeem houdt dan automatisch bij welke batches als eerste verwerkt moeten worden (FIFO).
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
