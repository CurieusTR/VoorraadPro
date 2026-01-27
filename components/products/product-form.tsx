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
import { useProductMutations, useCategories } from '@/hooks'
import { UNITS, type Product } from '@/lib/supabase/types'
import { toast } from 'sonner'

const productSchema = z.object({
  name: z.string().min(1, 'Naam is verplicht'),
  sku: z.string().optional().default(''),
  barcode: z.string().optional().default(''),
  description: z.string().optional().default(''),
  category_id: z.string().optional().default(''),
  unit: z.string().min(1, 'Eenheid is verplicht'),
  purchase_price: z.union([z.coerce.number().min(0), z.literal('')]).transform(v => v === '' ? null : v).nullable(),
  selling_price: z.union([z.coerce.number().min(0), z.literal('')]).transform(v => v === '' ? null : v).nullable(),
  min_stock: z.coerce.number().min(0),
  max_stock: z.union([z.coerce.number().min(0), z.literal('')]).transform(v => v === '' ? null : v).nullable(),
  reorder_quantity: z.union([z.coerce.number().min(0), z.literal('')]).transform(v => v === '' ? null : v).nullable(),
  track_expiry: z.boolean(),
  default_shelf_life_days: z.union([z.coerce.number().min(0), z.literal('')]).transform(v => v === '' ? null : v).nullable(),
  notes: z.string().optional().default(''),
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductFormProps {
  product?: Product | null
  onSuccess?: () => void
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const router = useRouter()
  const { createProduct, updateProduct, loading } = useProductMutations()
  const { categories } = useCategories()
  const [showAdvanced, setShowAdvanced] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: product?.name || '',
      sku: product?.sku || '',
      barcode: product?.barcode || '',
      description: product?.description || '',
      category_id: product?.category_id || '',
      unit: product?.unit || 'stuk',
      purchase_price: product?.purchase_price || null,
      selling_price: product?.selling_price || null,
      min_stock: product?.min_stock || 0,
      max_stock: product?.max_stock || null,
      reorder_quantity: product?.reorder_quantity || null,
      track_expiry: product?.track_expiry || false,
      default_shelf_life_days: product?.default_shelf_life_days || null,
      notes: product?.notes || '',
    },
  })

  const purchasePrice = watch('purchase_price')
  const sellingPrice = watch('selling_price')
  const trackExpiry = watch('track_expiry')

  // Calculate margin
  const margin =
    purchasePrice && sellingPrice && purchasePrice > 0
      ? ((sellingPrice - purchasePrice) / purchasePrice) * 100
      : null

  const onSubmit = async (data: ProductFormData) => {
    try {
      // Clean up empty strings to null
      const cleanData = {
        ...data,
        sku: data.sku || null,
        barcode: data.barcode || null,
        description: data.description || null,
        category_id: data.category_id || null,
        notes: data.notes || null,
        purchase_price: data.purchase_price || null,
        selling_price: data.selling_price || null,
        max_stock: data.max_stock || null,
        reorder_quantity: data.reorder_quantity || null,
        default_shelf_life_days: data.default_shelf_life_days || null,
      }

      if (product) {
        await updateProduct(product.id, cleanData)
        toast.success('Product bijgewerkt')
      } else {
        await createProduct(cleanData)
        toast.success('Product aangemaakt')
      }

      onSuccess?.()
      router.push('/producten')
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Er is iets misgegaan'
      )
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basis informatie</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" required>
                Productnaam
              </Label>
              <Input
                id="name"
                {...register('name')}
                error={!!errors.name}
                placeholder="Bijv. Appels Jonagold"
                className="mt-1"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="category_id">Categorie</Label>
              <Select
                id="category_id"
                {...register('category_id')}
                className="mt-1"
              >
                <option value="">Geen categorie</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="sku">Artikelnummer (SKU)</Label>
              <Input
                id="sku"
                {...register('sku')}
                placeholder="Bijv. APP-001"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="barcode">Barcode (EAN)</Label>
              <Input
                id="barcode"
                {...register('barcode')}
                placeholder="Bijv. 5400141123456"
                className="mt-1"
              />
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

          <div>
            <Label htmlFor="description">Beschrijving</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Optionele beschrijving..."
              className="mt-1"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Prijzen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="purchase_price">Inkoopprijs</Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  €
                </span>
                <Input
                  id="purchase_price"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('purchase_price')}
                  className="pl-7"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="selling_price">Verkoopprijs</Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  €
                </span>
                <Input
                  id="selling_price"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('selling_price')}
                  className="pl-7"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <Label>Marge</Label>
              <div className="mt-1 h-10 flex items-center px-3 bg-gray-50 rounded-lg border border-gray-200">
                {margin !== null ? (
                  <span
                    className={
                      margin >= 0 ? 'text-green-600' : 'text-red-600'
                    }
                  >
                    {margin.toFixed(1)}%
                  </span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stock */}
      <Card>
        <CardHeader>
          <CardTitle>Voorraad instellingen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="min_stock">Minimum voorraad</Label>
              <Input
                id="min_stock"
                type="number"
                step="0.001"
                min="0"
                {...register('min_stock')}
                className="mt-1"
                placeholder="0"
              />
              <p className="mt-1 text-xs text-gray-500">
                Alert bij lagere voorraad
              </p>
            </div>

            <div>
              <Label htmlFor="max_stock">Maximum voorraad</Label>
              <Input
                id="max_stock"
                type="number"
                step="0.001"
                min="0"
                {...register('max_stock')}
                className="mt-1"
                placeholder="Optioneel"
              />
            </div>

            <div>
              <Label htmlFor="reorder_quantity">Bestelhoeveelheid</Label>
              <Input
                id="reorder_quantity"
                type="number"
                step="0.001"
                min="0"
                {...register('reorder_quantity')}
                className="mt-1"
                placeholder="Standaard bij bestelling"
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="track_expiry"
                {...register('track_expiry')}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="track_expiry" className="font-normal">
                Vervaldatum bijhouden
              </Label>
            </div>

            {trackExpiry && (
              <div className="mt-4">
                <Label htmlFor="default_shelf_life_days">
                  Standaard houdbaarheid (dagen)
                </Label>
                <Input
                  id="default_shelf_life_days"
                  type="number"
                  min="0"
                  {...register('default_shelf_life_days')}
                  className="mt-1 max-w-xs"
                  placeholder="Bijv. 7"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Notities</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            id="notes"
            {...register('notes')}
            placeholder="Interne notities over dit product..."
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Annuleren
        </Button>
        <Button type="submit" loading={loading}>
          {product ? 'Opslaan' : 'Product aanmaken'}
        </Button>
      </div>
    </form>
  )
}
