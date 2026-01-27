'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/layout'
import { Card, CardContent, Button, Select, Input, Label, PageLoader } from '@/components/ui'
import { useStockMovements } from '@/hooks'
import { formatNumber, formatCurrency, formatDate } from '@/lib/utils'
import { MOVEMENT_TYPE_LABELS } from '@/lib/supabase/types'
import { Download, ArrowUpCircle, ArrowDownCircle } from 'lucide-react'

export default function MutatieRapportPage() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  const { movements, loading } = useStockMovements({
    startDate: startDate ? new Date(startDate) : undefined,
    endDate: endDate ? new Date(endDate) : undefined,
    movementType: typeFilter as any || undefined,
  })

  const incomingTypes = ['purchase', 'adjustment_plus', 'transfer_in', 'return_customer', 'inventory_count']

  const totalIn = movements
    .filter(m => incomingTypes.includes(m.movement_type))
    .reduce((sum, m) => sum + Number(m.total_price || 0), 0)

  const totalOut = movements
    .filter(m => !incomingTypes.includes(m.movement_type))
    .reduce((sum, m) => sum + Number(m.total_price || 0), 0)

  if (loading) {
    return <PageLoader />
  }

  return (
    <div>
      <PageHeader
        title="Mutatieoverzicht"
        description="Alle voorraadmutaties in een periode"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Rapporten', href: '/rapporten' },
          { label: 'Mutatieoverzicht' },
        ]}
        actions={
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporteren
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Aantal mutaties</p>
            <p className="text-2xl font-bold text-gray-900">{movements.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <ArrowUpCircle className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Totaal IN</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(totalIn)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <ArrowDownCircle className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-sm text-gray-500">Totaal UIT</p>
              <p className="text-xl font-bold text-red-600">{formatCurrency(totalOut)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Van datum</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Tot datum</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Type mutatie</Label>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="mt-1"
              >
                <option value="">Alle types</option>
                {Object.entries(MOVEMENT_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Datum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Hoeveelheid</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Waarde</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Referentie</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {movements.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Geen mutaties gevonden voor deze periode
                  </td>
                </tr>
              ) : (
                movements.map((movement) => {
                  const isIncoming = incomingTypes.includes(movement.movement_type)
                  return (
                    <tr key={movement.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(new Date(movement.movement_date))}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {movement.product?.name || 'Onbekend'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          isIncoming ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {isIncoming ? '+' : '-'} {MOVEMENT_TYPE_LABELS[movement.movement_type] || movement.movement_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={isIncoming ? 'text-green-600' : 'text-red-600'}>
                          {isIncoming ? '+' : '-'}{formatNumber(Number(movement.quantity))} {movement.unit}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-500">
                        {movement.total_price ? formatCurrency(Number(movement.total_price)) : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {movement.reference || '-'}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
