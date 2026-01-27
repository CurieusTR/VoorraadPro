'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Menu,
  X,
  Boxes,
  LayoutDashboard,
  Package,
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
  { name: 'Voorraad', href: '/voorraad', icon: Boxes },
  { name: 'Locaties', href: '/locaties', icon: MapPin },
  { name: 'Leveranciers', href: '/leveranciers', icon: Truck },
  { name: 'Bestellingen', href: '/bestellingen', icon: ShoppingCart },
  { name: 'Rapporten', href: '/rapporten', icon: FileText },
  { name: 'Import', href: '/import', icon: Upload },
  { name: 'Instellingen', href: '/instellingen', icon: Settings },
]

interface HeaderProps {
  onLogout?: () => void
  businessName?: string
}

export function Header({ onLogout, businessName }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between h-14 px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Boxes className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">VoorraadPro</span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 text-gray-500 hover:text-gray-700"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black/20"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl">
            <div className="flex items-center justify-between h-14 px-4 border-b border-gray-200">
              <span className="font-semibold text-gray-900">
                {businessName || 'Menu'}
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="px-2 py-4 space-y-1">
              {navigation.map((item) => {
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center px-3 py-3 text-base font-medium rounded-lg transition-colors',
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
                  onClick={() => {
                    setMobileMenuOpen(false)
                    onLogout()
                  }}
                  className="flex w-full items-center px-3 py-3 text-base font-medium rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <LogOut className="mr-3 h-5 w-5 text-gray-400" />
                  Uitloggen
                </button>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
