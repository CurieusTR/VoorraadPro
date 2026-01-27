'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Package,
  Boxes,
  Tags,
  MapPin,
  Truck,
  ShoppingCart,
  FileText,
  Upload,
  Settings,
  LogOut,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Producten', href: '/producten', icon: Package },
  { name: 'Categorieën', href: '/categorieen', icon: Tags },
  { name: 'Voorraad', href: '/voorraad', icon: Boxes },
  { name: 'Locaties', href: '/locaties', icon: MapPin },
  { name: 'Leveranciers', href: '/leveranciers', icon: Truck },
  { name: 'Bestellingen', href: '/bestellingen', icon: ShoppingCart },
  { name: 'Rapporten', href: '/rapporten', icon: FileText },
  { name: 'Import', href: '/import', icon: Upload },
]

const bottomNavigation = [
  { name: 'Instellingen', href: '/instellingen', icon: Settings },
]

interface SidebarProps {
  onLogout?: () => void
}

export function Sidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Boxes className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">VoorraadPro</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                active
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5',
                  active ? 'text-blue-600' : 'text-gray-400'
                )}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="px-3 py-4 border-t border-gray-200 space-y-1">
        {bottomNavigation.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                active
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5',
                  active ? 'text-blue-600' : 'text-gray-400'
                )}
              />
              {item.name}
            </Link>
          )
        })}

        {onLogout && (
          <button
            onClick={onLogout}
            className="flex w-full items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 text-gray-400" />
            Uitloggen
          </button>
        )}
      </div>
    </aside>
  )
}
