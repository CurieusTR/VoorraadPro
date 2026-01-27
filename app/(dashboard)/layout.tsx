'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Sidebar, Header, MobileNav } from '@/components/layout'
import { Toaster } from 'sonner'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />

      {/* Desktop Sidebar */}
      <Sidebar onLogout={handleLogout} />

      {/* Mobile Header */}
      <Header onLogout={handleLogout} />

      {/* Main content */}
      <main className="lg:pl-64">
        <div className="px-4 py-6 sm:px-6 lg:px-8 pb-20 lg:pb-6">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <MobileNav />
    </div>
  )
}
