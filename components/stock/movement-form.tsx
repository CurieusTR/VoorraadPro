'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Button,
  Input,
  Label,
  Select,
  Textarea,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui'
import { useStockMutations, useProducts, useSuppliers, useStockBatchMutations } from '@/hooks'
import { UNITS, MOVEMENT_TYPE_LABELS, type MovementType } from '@/lib/supabase/types'
import { toast } from 'sonner'

const movementSchema = z.object({
  product_id: z.string().min(1, 'Selecteer een product'),
  movement_type: z.enum([
    'purchase',
    'sale',
    'adjustment_plus',
    'adjustment_minus',
    'waste',
    'return_supplier',
    'return_customer',
  ] as const),
  quantity: z.coerce.number().positive('Hoeveelheid moet positief zijn'),
  unit: z.string().min(1, 'Eenheid is verplicht'),
  unit_price: z.coerce.number().min(0).optional().nullable(),
  supplier_id: z.string().optional().nullable(),
  expiry_date: z.string().optional().nullable(),
  batch_number: z.string().optional().nullable(),
  reference: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
})

type MovementFormData = z.infer<typeof movementSchema>

type FormMovementType = 'purchase' | 'sale' | 'adjustment_plus' | 'adjustment_minus' | 'waste' | 'return_supplier' | 'return_customer'

const MOVEMENT_TYPES: { value: FormMovementType; label: string; direction: 'in' | 'out' }[] = [
  { value: 'purchase', label: 'Inkoop', direction: 'in' },
  { value: 'sale', label: 'Verkoop', direction: 'out' },
  { value: 'adjustment_plus', label: 'Correctie +', direction: 'in' },
  { value: 'adjustment_minus', label: 'Correctie -', direction: 'out' },
  { value: 'waste', label: 'Afval/verspilling', direction: 'out' },
  { value: 'return_supplier', label: 'Retour naar leverancier', direction: 'out' },
  { value: 'return_customer', label: 'Retour van klant', direction: 'in' },
]

interface MovementFormProps {
  productId?: string
  defaultType?: MovementType
  onSuccess?: () => void
}

export function MovementForm({ productId, defaultType, onSuccess }: MovementFormProps) {
  const router = useRouter()

  const { createMovement, loading } = useStockMutations()
  const { products } = useProducts()
  const { suppliers } = useSuppliers()
  const { createBatch, reduceBatchQuantity, loading: batchLoading } = useStockBatchMutations()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<MovementFormData>({
    resolver: zodResolver(movementSchema) as any,
    defaultValues: {
      product_id: productId || '',
      movement_type: (defaultType as MovementFormData['movement_type']) || 'purchase',
      quantity: undefined,
      unit: 'stuk',
      unit_price: null,
      supplier_id: null,
      expiry_date: null,
      batch_number: null,
      reference: null,
      notes: null,
    },
  })

  const selectedProductId = watch('product_id')
  const selectedType = watch('movement_type')
  const quantity = watch('quantity')
  const unitPrice = watch('unit_price')

  // Set product from URL parameter when products are loaded
  useEffect(() => {
    if (productId && products.length > 0) {
      const product = products.find((p) => p.id === productId)
      if (product) {
        setValue('product_id', productId)
        setValue('unit', product.unit)
        // Set price based on movement type
        if (product.purchase_price && selectedType === 'purchase') {
          setValue('unit_price', Number(product.purchase_price))
        } else if (product.selling_price && selectedType === 'sale') {
          setValue('unit_price', Number(product.selling_price))
        }
      }
    }
  }, [productId, products, selectedType, setValue])

  // Update unit when product changes (manual selection)
  useEffect(() => {
    if (selectedProductId && products.length > 0) {
      const product = products.find((p) => p.id === selectedProductId)
      if (product) {
        setValue('unit', product.unit)
        if (product.purchase_price && selectedType === 'purchase') {
          setValue('unit_price', Number(product.purchase_price))
        } else if (product.selling_price && selectedType === 'sale') {
          setValue('unit_price', Number(product.selling_price))
        }
      }
    }
  }, [selectedProductId, selectedType, products, setValue])

  const totalPrice = quantity && unitPrice ? quantity * unitPrice : null

  const selectedProduct = products.find((p) => p.id === selectedProductId)
  const isIncoming = MOVEMENT_TYPES.find((t) => t.value === selectedType)?.direction === 'in'

  const onSubmit = async (data: MovementFormData) => {
    try {
      const movementDirection = MOVEMENT_TYPES.find((t) => t.value === data.movement_type)?.direction

      // Create the stock movement
      await createMovement({
        product_id: data.product_id,
        movement_type: data.movement_type,
        quantity: data.quantity,
        unit: data.unit,
        unit_price: data.unit_price || null,
        total_price: totalPrice,
        supplier_id: data.supplier_id || null,
        expiry_date: data.expiry_date || null,
        batch_number: data.batch_number || null,
        reference: data.reference || null,
        notes: data.notes || null,
      })

      // Handle batch tracking
      if (movementDirection === 'in' && data.movement_type === 'purchase') {
        // Create a new batch for incoming stock
        await createBatch({
          product_id: data.product_id,
          quantity: data.quantity,
          supplier_id: data.supplier_id || null,
          expiry_date: data.expiry_date || null,
          batch_number: data.batch_number || null,
          unit_price: data.unit_price || null,
          purchase_date: new Date().toISOString().split('T')[0],
        })
      } else if (movementDirection === 'out') {
        // Reduce from batches using FIFO
        await reduceBatchQuantity(data.product_id, data.quantity)
      }

      toast.success('Mutatie opgeslagen')
      onSuccess?.()
      router.push('/voorraad')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Er is iets misgegaan')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Movement Type */}
      <Card>
        <CardHeader>
          <CardTitle>Type mutatie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {MOVEMENT_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setValue('movement_type', type.value)}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                  selectedType === type.value
                    ? type.direction === 'in'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="block text-lg mb-1">
                  {type.direction === 'in' ? '+' : '-'}
                </span>
                {type.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Product & Quantity */}
      <Card>
        <CardHeader>
          <CardTitle>Product & hoeveelheid</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="product_id" required>
              Product
            </Label>
            <Select
              id="product_id"
              {...register('product_id')}
              error={!!errors.product_id}
              className="mt-1"
            >
              <option value="">Selecteer een product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} (voorraad: {product.current_stock} {product.unit})
                </option>
              ))}
            </Select>
            {errors.product_id && (
              <p className="mt-1 text-sm text-red-500">
                {errors.product_id.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity" required>
                Hoeveelheid
              </Label>
              <Input
                id="quantity"
                type="number"
                step="0.001"
                min="0.001"
                {...register('quantity')}
                error={!!errors.quantity}
                className="mt-1"
                placeholder="0"
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.quantity.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="unit" required>
                Eenheid
              </Label>
              <Select id="unit" {...register('unit')} className="mt-1">
                {UNITS.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {selectedProduct && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Huidige voorraad:{' '}
                <span className="font-medium text-gray-900">
                  {selectedProduct.current_stock} {selectedProduct.unit}
                </span>
              </p>
              {quantity && (
                <p className="text-sm text-gray-600 mt-1">
                  Na mutatie:{' '}
                  <span
                    className={`font-medium ${
                      isIncoming ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {isIncoming
                      ? Number(selectedProduct.current_stock) + Number(quantity)
                      : Number(selectedProduct.current_stock) - Number(quantity)}{' '}
                    {selectedProduct.unit}
                  </span>
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Supplier (only for purchase) */}
      {selectedType === 'purchase' && (
        <Card>
          <CardHeader>
            <CardTitle>Leverancier</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="supplier_id">Van welke leverancier?</Label>
              <Select
                id="supplier_id"
                {...register('supplier_id')}
                className="mt-1"
              >
                <option value="">Geen leverancier geselecteerd</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </Select>
              <p className="mt-1 text-sm text-gray-500">
                Selecteer de leverancier om batches per leverancier bij te houden
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Price & Details */}
      <Card>
        <CardHeader>
          <CardTitle>Prijs & details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="unit_price">Stukprijs</Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  €
                </span>
                <Input
                  id="unit_price"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('unit_price')}
                  className="pl-7"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <Label>Totaalprijs</Label>
              <div className="mt-1 h-10 flex items-center px-3 bg-gray-50 rounded-lg border border-gray-200">
                {totalPrice !== null ? (
                  <span className="font-medium">€ {totalPrice.toFixed(2)}</span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="reference">Referentie</Label>
              <Input
                id="reference"
                {...register('reference')}
                className="mt-1"
                placeholder="Factuur/bonnummer"
              />
            </div>
          </div>

          {(selectedProduct?.track_expiry || selectedType === 'purchase') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry_date">Vervaldatum</Label>
                <Input
                  id="expiry_date"
                  type="date"
                  {...register('expiry_date')}
                  className="mt-1"
                />
                {selectedType === 'purchase' && (
                  <p className="mt-1 text-sm text-gray-500">
                    Belangrijk voor FIFO: oudste batch wordt eerst verkocht
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="batch_number">Batchnummer</Label>
                <Input
                  id="batch_number"
                  {...register('batch_number')}
                  className="mt-1"
                  placeholder="Optioneel"
                />
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="notes">Notities</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              className="mt-1"
              rows={2}
              placeholder="Optionele notities..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Annuleren
        </Button>
        <Button type="submit" loading={loading || batchLoading}>
          Mutatie opslaan
        </Button>
      </div>
    </form>
  )
}
