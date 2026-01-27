'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/layout'
import { Button, Input, Label, Select, Card, CardContent, CardHeader, CardTitle, PageLoader } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'
import { useAuth, useProducts } from '@/hooks'
import { formatCurrency } from '@/lib/utils'
import { Plus, Trash2, ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'

interface Supplier {
  id: string
  name: string
}

interface OrderItem {
  product_id: string
  product_name: string
  quantity: number
  unit: string
  unit_price: number
}

export default function NieuweBestellingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { products, loading: productsLoading } = useProducts()

  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [supplierId, setSupplierId] = useState('')
  const [expectedDate, setExpectedDate] = useState('')
  const [reference, setReference] = useState('')
  const [items, setItems] = useState<OrderItem[]>([])

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('suppliers')
          .select('id, name')
          .eq('is_active', true)
          .order('name')

        if (error) throw error
        setSuppliers(data || [])
      } catch (err) {
        console.error('Error fetching suppliers:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSuppliers()
  }, [])

  const addItem = () => {
    setItems([
      ...items,
      {
        product_id: '',
        product_name: '',
        quantity: 1,
        unit: 'stuk',
        unit_price: 0,
      },
    ])
  }

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }

    // Auto-fill product details
    if (field === 'product_id') {
      const product = products.find(p => p.id === value)
      if (product) {
        newItems[index].product_name = product.name
        newItems[index].unit = product.unit
        newItems[index].unit_price = Number(product.purchase_price) || 0
      }
    }

    setItems(newItems)
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const total = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !supplierId || items.length === 0) {
      toast.error('Selecteer een leverancier en voeg producten toe')
      return
    }

    setSaving(true)
    try {
      const supabase = createClient()

      // Create order
      const { data: order, error: orderError } = await (supabase as any)
        .from('purchase_orders')
        .insert({
          user_id: user.id,
          supplier_id: supplierId,
          status: 'draft',
          order_date: new Date().toISOString().split('T')[0],
          expected_date: expectedDate || null,
          reference: reference || null,
          subtotal: total,
          total_amount: total,
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity_ordered: item.quantity,
        unit: item.unit,
        unit_price: item.unit_price,
        total_price: item.quantity * item.unit_price,
      }))

      const { error: itemsError } = await (supabase as any)
        .from('purchase_order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      toast.success('Bestelling aangemaakt')
      router.push('/bestellingen')
    } catch (err) {
      console.error('Error creating order:', err)
      toast.error('Er is iets misgegaan')
    } finally {
      setSaving(false)
    }
  }

  if (loading || productsLoading) {
    return <PageLoader />
  }

  return (
    <div>
      <PageHeader
        title="Nieuwe bestelling"
        description="Plaats een bestelling bij een leverancier"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Bestellingen', href: '/bestellingen' },
          { label: 'Nieuwe bestelling' },
        ]}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Leverancier</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="supplier" required>Leverancier</Label>
                <Select
                  id="supplier"
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  required
                  className="mt-1"
                >
                  <option value="">Selecteer leverancier</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="expectedDate">Verwachte leverdatum</Label>
                <Input
                  id="expectedDate"
                  type="date"
                  value={expectedDate}
                  onChange={(e) => setExpectedDate(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="reference">Referentie</Label>
              <Input
                id="reference"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Optioneel bestelnummer"
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Producten</CardTitle>
              <Button type="button" variant="outline" onClick={addItem}>
                <Plus className="h-4 w-4 mr-2" />
                Product toevoegen
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <p>Geen producten toegevoegd</p>
                <Button type="button" variant="outline" className="mt-2" onClick={addItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Product toevoegen
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="flex items-end gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <Label>Product</Label>
                      <Select
                        value={item.product_id}
                        onChange={(e) => updateItem(index, 'product_id', e.target.value)}
                        className="mt-1"
                      >
                        <option value="">Selecteer product</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </Select>
                    </div>
                    <div className="w-24">
                      <Label>Aantal</Label>
                      <Input
                        type="number"
                        min="0.001"
                        step="0.001"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                        className="mt-1"
                      />
                    </div>
                    <div className="w-24">
                      <Label>Eenheid</Label>
                      <Input
                        value={item.unit}
                        onChange={(e) => updateItem(index, 'unit', e.target.value)}
                        className="mt-1"
                        disabled
                      />
                    </div>
                    <div className="w-28">
                      <Label>Prijs/st</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unit_price}
                        onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                        className="mt-1"
                      />
                    </div>
                    <div className="w-28 text-right">
                      <Label>Totaal</Label>
                      <p className="mt-1 h-10 flex items-center justify-end font-medium">
                        {formatCurrency(item.quantity * item.unit_price)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <div className="flex justify-end pt-4 border-t">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Totaal</p>
                    <p className="text-2xl font-bold">{formatCurrency(total)}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Annuleren
          </Button>
          <Button type="submit" loading={saving} disabled={items.length === 0}>
            Bestelling aanmaken
          </Button>
        </div>
      </form>
    </div>
  )
}
