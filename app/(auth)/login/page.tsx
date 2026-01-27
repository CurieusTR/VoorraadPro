'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button, Input, Label, Spinner } from '@/components/ui'
import { toast } from 'sonner'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.message === 'Invalid login credentials') {
          toast.error('Ongeldige inloggegevens')
        } else {
          toast.error(error.message)
        }
        return
      }

      toast.success('Welkom terug!')
      router.push(redirect)
      router.refresh()
    } catch {
      toast.error('Er is iets misgegaan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 text-center mb-6">
        Inloggen
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">E-mailadres</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="naam@bedrijf.be"
            required
            autoComplete="email"
            className="mt-1"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Wachtwoord</Label>
            <Link
              href="/reset-password"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Wachtwoord vergeten?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
            autoComplete="current-password"
            className="mt-1"
          />
        </div>

        <Button type="submit" className="w-full" loading={loading}>
          Inloggen
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Nog geen account?{' '}
        <Link
          href="/register"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Registreren
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex justify-center"><Spinner /></div>}>
      <LoginForm />
    </Suspense>
  )
}
