'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  Menu,
} from 'lucide-react'

const mobileNavigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Producten', href: '/producten', icon: Package },
  { name: 'Voorraad', href: '/voorraad', icon: Boxes },
  { name: 'Bestellingen', href: '/bestellingen', icon: ShoppingCart },
  { name: 'Menu', href: '/menu', icon: Menu },
]

export function MobileNav() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    if (href === '/menu') return false
    return pathname.startsWith(href)
  }

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-50">
      <div className="flex justify-around">
        {mobileNavigation.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center py-2 px-3 min-w-[64px]',
                active ? 'text-blue-600' : 'text-gray-500'
              )}
            >
              <item.icon className={cn('h-6 w-6', active && 'text-blue-600')} />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
