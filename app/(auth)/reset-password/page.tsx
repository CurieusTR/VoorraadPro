'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button, Input, Label } from '@/components/ui'
import { toast } from 'sonner'
import { ArrowLeft, CheckCircle } from 'lucide-react'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password/confirm`,
      })

      if (error) {
        toast.error(error.message)
        return
      }

      setSent(true)
    } catch {
      toast.error('Er is iets misgegaan')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          E-mail verzonden
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          We hebben een link naar {email} gestuurd waarmee je je wachtwoord kunt
          resetten.
        </p>
        <Link
          href="/login"
          className="text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          Terug naar inloggen
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link
        href="/login"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Terug naar inloggen
      </Link>

      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Wachtwoord resetten
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Voer je e-mailadres in en we sturen je een link om je wachtwoord te
        resetten.
      </p>

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

        <Button type="submit" className="w-full" loading={loading}>
          Reset link versturen
        </Button>
      </form>
    </div>
  )
}
