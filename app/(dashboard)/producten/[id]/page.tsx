'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/layout'
import { ProductForm } from '@/components/products'
import { BatchList } from '@/components/stock'
import { Button, PageLoader, Card, CardContent, Badge } from '@/components/ui'
import { useProduct, useProductMutations } from '@/hooks'
import { formatCurrency, formatNumber, getStockStatus, getStockStatusColor } from '@/lib/utils'
import { toast } from 'sonner'
import { Trash2, Package, TrendingUp, TrendingDown } from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

export default function ProductDetailPage({ params }: Props) {
  const { id } = use(params)
  const router = useRouter()
  const { product, loading, error } = useProduct(id)
  const { deleteProduct, loading: deleting } = useProductMutations()

  const handleDelete = async () => {
    if (!product) return

    if (!confirm(`Weet je zeker dat je "${product.name}" wilt verwijderen?`)) {
      return
    }

    try {
      await deleteProduct(product.id)
      toast.success('Product verwijderd')
      router.push('/producten')
    } catch (err) {
      toast.error('Kon product niet verwijderen')
    }
  }

  if (loading) {
    return <PageLoader />
  }

  if (error || !product) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Product niet gevonden
        </h3>
        <p className="mt-1 text-sm text-gray-500">{error}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push('/producten')}
        >
          Terug naar producten
        </Button>
      </div>
    )
  }

  const status = getStockStatus(
    Number(product.current_stock),
    Number(product.min_stock)
  )
  const statusColor = getStockStatusColor(status)

  return (
    <div>
      <PageHeader
        title={product.name}
        description={product.sku || undefined}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Producten', href: '/producten' },
          { label: product.name },
        ]}
        actions={
          <Button
            variant="destructive"
            onClick={handleDelete}
            loading={deleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Verwijderen
          </Button>
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${statusColor}`}>
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Voorraad</p>
              <p className="text-lg font-semibold">
                {formatNumber(Number(product.current_stock))} {product.unit}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-50 text-yellow-600">
              <TrendingDown className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Min. voorraad</p>
              <p className="text-lg font-semibold">
                {formatNumber(Number(product.min_stock))} {product.unit}
              </p>
            </div>
          </div>
        </Card>

        {product.purchase_price && (
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Inkoopprijs</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(Number(product.purchase_price))}
                </p>
              </div>
            </div>
          </Card>
        )}

        {product.selling_price && (
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50 text-green-600">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Verkoopprijs</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(Number(product.selling_price))}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Batch Overview */}
      <div className="mb-6">
        <BatchList
          productId={product.id}
          productName={product.name}
          productUnit={product.unit}
        />
      </div>

      {/* Edit Form */}
      <ProductForm product={product} />
    </div>
  )
}
