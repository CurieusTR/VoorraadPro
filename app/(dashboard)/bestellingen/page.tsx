'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { PageHeader } from '@/components/layout'
import { Button, Card, CardContent, PageLoader, Badge, Select } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'
import { formatDate, formatCurrency } from '@/lib/utils'
import { Plus, ShoppingCart, Truck, Calendar, Package } from 'lucide-react'

interface Order {
  id: string
  status: string
  order_date: string
  expected_date: string | null
  total_amount: number
  supplier: {
    id: string
    name: string
  } | null
}

const STATUS_LABELS: Record<string, string> = {
  draft: 'Concept',
  sent: 'Verzonden',
  confirmed: 'Bevestigd',
  partial: 'Gedeeltelijk',
  received: 'Ontvangen',
  cancelled: 'Geannuleerd',
}

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  sent: 'bg-blue-100 text-blue-800',
  confirmed: 'bg-indigo-100 text-indigo-800',
  partial: 'bg-yellow-100 text-yellow-800',
  received: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function BestellingenPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')

  const fetchOrders = useCallback(async () => {
    try {
      const supabase = createClient()
      let query = supabase
        .from('purchase_orders')
        .select(`
          id,
          status,
          order_date,
          expected_date,
          total_amount,
          supplier:suppliers(id, name)
        `)
        .order('order_date', { ascending: false })

      if (statusFilter) {
        query = query.eq('status', statusFilter)
      }

      const { data, error } = await query

      if (error) throw error
      setOrders(data || [])
    } catch (err) {
      console.error('Error fetching orders:', err)
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  if (loading) {
    return <PageLoader />
  }

  return (
    <div>
      <PageHeader
        title="Bestellingen"
        description={`${orders.length} bestellingen`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Bestellingen' },
        ]}
        actions={
          <Link href="/bestellingen/nieuw">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nieuwe bestelling
            </Button>
          </Link>
        }
      />

      {/* Filter */}
      <div className="mb-6">
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-48"
        >
          <option value="">Alle statussen</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </Select>
      </div>

      {/* Orders list */}
      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {statusFilter ? 'Geen bestellingen gevonden' : 'Nog geen bestellingen'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {statusFilter ? 'Probeer een andere filter' : 'Plaats je eerste bestelling bij een leverancier.'}
            </p>
            {!statusFilter && (
              <Link href="/bestellingen/nieuw">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Bestelling plaatsen
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} href={`/bestellingen/${order.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Package className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">
                            {order.supplier?.name || 'Onbekende leverancier'}
                          </h3>
                          <Badge className={STATUS_COLORS[order.status]}>
                            {STATUS_LABELS[order.status] || order.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(new Date(order.order_date))}
                          </span>
                          {order.expected_date && (
                            <span className="flex items-center gap-1">
                              <Truck className="h-4 w-4" />
                              Verwacht: {formatDate(new Date(order.expected_date))}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(Number(order.total_amount))}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
