'use client'

import { PageHeader } from '@/components/layout'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui'
import Link from 'next/link'
import {
  Package,
  TrendingUp,
  Wallet,
  Clock,
  FileText,
  Download,
} from 'lucide-react'

const reports = [
  {
    title: 'Voorraadrapport',
    description: 'Huidige voorraad met waarde per product',
    href: '/rapporten/voorraad',
    icon: Package,
    color: 'text-blue-600 bg-blue-50',
  },
  {
    title: 'Mutatieoverzicht',
    description: 'Alle voorraadmutaties in een periode',
    href: '/rapporten/mutaties',
    icon: TrendingUp,
    color: 'text-green-600 bg-green-50',
  },
  {
    title: 'Voorraadwaardering',
    description: 'Totale voorraadwaarde (inkoopprijs)',
    href: '/rapporten/waardering',
    icon: Wallet,
    color: 'text-purple-600 bg-purple-50',
  },
  {
    title: 'Vervaldatums',
    description: 'Producten die binnenkort verlopen',
    href: '/rapporten/vervaldatums',
    icon: Clock,
    color: 'text-orange-600 bg-orange-50',
  },
]

export default function RapportenPage() {
  return (
    <div>
      <PageHeader
        title="Rapporten"
        description="Bekijk en exporteer overzichten"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Rapporten' },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report) => (
          <Link key={report.title} href={report.href}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg ${report.color}`}>
                    <report.icon className="h-6 w-6" />
                  </div>
                  <Download className="h-5 w-5 text-gray-400" />
                </div>
                <CardTitle className="mt-4">{report.title}</CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
