'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { PageHeader } from '@/components/layout'
import { Button, Input, Card, CardContent, PageLoader, Badge } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'
import { Plus, Search, Truck, Phone, Mail, MapPin } from 'lucide-react'

interface Supplier {
  id: string
  name: string
  contact_person: string | null
  email: string | null
  phone: string | null
  city: string | null
  is_active: boolean
}

export default function LeveranciersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchSuppliers = useCallback(async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      setSuppliers(data || [])
    } catch (err) {
      console.error('Error fetching suppliers:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSuppliers()
  }, [fetchSuppliers])

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.contact_person?.toLowerCase().includes(search.toLowerCase()) ||
    s.city?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return <PageLoader />
  }

  return (
    <div>
      <PageHeader
        title="Leveranciers"
        description={`${suppliers.length} leveranciers`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Leveranciers' },
        ]}
        actions={
          <Link href="/leveranciers/nieuw">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nieuwe leverancier
            </Button>
          </Link>
        }
      />

      {/* Search */}
      {suppliers.length > 0 && (
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Zoek leverancier..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}

      {/* Suppliers list */}
      {filteredSuppliers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Truck className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {search ? 'Geen leveranciers gevonden' : 'Geen leveranciers'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {search ? 'Probeer een andere zoekterm' : 'Voeg leveranciers toe om bestellingen te plaatsen.'}
            </p>
            {!search && (
              <Link href="/leveranciers/nieuw">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Eerste leverancier aanmaken
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSuppliers.map((supplier) => (
            <Link key={supplier.id} href={`/leveranciers/${supplier.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Truck className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{supplier.name}</h3>
                        {supplier.contact_person && (
                          <p className="text-sm text-gray-500">{supplier.contact_person}</p>
                        )}
                      </div>
                    </div>
                    {!supplier.is_active && (
                      <Badge className="bg-gray-100 text-gray-600">Inactief</Badge>
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    {supplier.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-4 w-4" />
                        {supplier.phone}
                      </div>
                    )}
                    {supplier.email && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="h-4 w-4" />
                        {supplier.email}
                      </div>
                    )}
                    {supplier.city && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        {supplier.city}
                      </div>
                    )}
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
