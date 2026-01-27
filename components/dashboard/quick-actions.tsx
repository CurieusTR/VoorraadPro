'use client'

import Link from 'next/link'
import { Card } from '@/components/ui'
import { Plus, Minus, Package, FileText, Clipboard, Upload } from 'lucide-react'

const actions = [
  {
    name: 'Inkoop',
    description: 'Voorraad toevoegen',
    href: '/voorraad/mutatie?type=purchase',
    icon: Plus,
    color: 'text-green-600 bg-green-50 hover:bg-green-100',
  },
  {
    name: 'Verkoop',
    description: 'Voorraad afboeken',
    href: '/voorraad/mutatie?type=sale',
    icon: Minus,
    color: 'text-red-600 bg-red-50 hover:bg-red-100',
  },
  {
    name: 'Nieuw product',
    description: 'Product toevoegen',
    href: '/producten/nieuw',
    icon: Package,
    color: 'text-blue-600 bg-blue-50 hover:bg-blue-100',
  },
  {
    name: 'Voorraadtelling',
    description: 'Start telling',
    href: '/voorraad/telling',
    icon: Clipboard,
    color: 'text-purple-600 bg-purple-50 hover:bg-purple-100',
  },
  {
    name: 'Rapporten',
    description: 'Bekijk overzichten',
    href: '/rapporten',
    icon: FileText,
    color: 'text-orange-600 bg-orange-50 hover:bg-orange-100',
  },
  {
    name: 'Import',
    description: 'CSV/Excel import',
    href: '/import',
    icon: Upload,
    color: 'text-gray-600 bg-gray-50 hover:bg-gray-100',
  },
]

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {actions.map((action) => (
        <Link key={action.name} href={action.href}>
          <Card
            className={`p-4 cursor-pointer transition-colors ${action.color} border-0`}
          >
            <action.icon className="h-6 w-6 mb-2" />
            <p className="font-medium text-sm">{action.name}</p>
            <p className="text-xs opacity-75">{action.description}</p>
          </Card>
        </Link>
      ))}
    </div>
  )
}
