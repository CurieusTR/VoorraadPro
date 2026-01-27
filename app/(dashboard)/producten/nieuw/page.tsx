import { PageHeader } from '@/components/layout'
import { ProductForm } from '@/components/products'

export default function NieuwProductPage() {
  return (
    <div>
      <PageHeader
        title="Nieuw product"
        description="Voeg een nieuw product toe aan je voorraad"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Producten', href: '/producten' },
          { label: 'Nieuw product' },
        ]}
      />

      <ProductForm />
    </div>
  )
}
