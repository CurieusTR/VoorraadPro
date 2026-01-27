'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PageHeader } from '@/components/layout'
import { Card } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'
import {
  MapPin,
  Truck,
  FileText,
  Upload,
  Settings,
  LogOut,
} from 'lucide-react'

const menuItems = [
  {
    name: 'Locaties',
    description: 'Beheer magazijnen',
    href: '/locaties',
    icon: MapPin,
    color: 'text-blue-600 bg-blue-50',
  },
  {
    name: 'Leveranciers',
    description: 'Beheer leveranciers',
    href: '/leveranciers',
    icon: Truck,
    color: 'text-green-600 bg-green-50',
  },
  {
    name: 'Rapporten',
    description: 'Bekijk overzichten',
    href: '/rapporten',
    icon: FileText,
    color: 'text-purple-600 bg-purple-50',
  },
  {
    name: 'Import',
    description: 'CSV/Excel import',
    href: '/import',
    icon: Upload,
    color: 'text-orange-600 bg-orange-50',
  },
  {
    name: 'Instellingen',
    description: 'Bedrijfsgegevens',
    href: '/instellingen',
    icon: Settings,
    color: 'text-gray-600 bg-gray-100',
  },
]

export default function MenuPage() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div>
      <PageHeader title="Menu" />

      <div className="space-y-3">
        {menuItems.map((item) => (
          <Link key={item.name} href={item.href}>
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${item.color}`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}

        <Card
          className="p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={handleLogout}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-red-50 text-red-600">
              <LogOut className="h-6 w-6" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Uitloggen</p>
              <p className="text-sm text-gray-500">Afmelden van je account</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
