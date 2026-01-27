'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { PageHeader } from '@/components/layout'
import { MovementForm } from '@/components/stock'
import { Spinner } from '@/components/ui'

function MutatieContent() {
  const searchParams = useSearchParams()
  const productId = searchParams.get('product') || undefined
  const defaultType = searchParams.get('type') as 'purchase' | 'sale' | 'adjustment_plus' | 'adjustment_minus' | 'waste' | 'return_supplier' | 'return_customer' | undefined

  return (
    <div>
      <PageHeader
        title="Nieuwe mutatie"
        description="Registreer een voorraadmutatie"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Voorraad', href: '/voorraad' },
          { label: 'Nieuwe mutatie' },
        ]}
      />

      <MovementForm productId={productId} defaultType={defaultType} />
    </div>
  )
}

export default function MutatiePage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-12"><Spinner /></div>}>
      <MutatieContent />
    </Suspense>
  )
}
