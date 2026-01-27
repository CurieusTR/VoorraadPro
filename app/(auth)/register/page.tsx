'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button, Input, Label, Select } from '@/components/ui'
import { BUSINESS_TYPES } from '@/lib/supabase/types'
import { toast } from 'sonner'

export default function RegisterPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    businessType: 'handelaar' as const,
    ownerName: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Wachtwoorden komen niet overeen')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Wachtwoord moet minimaal 6 tekens bevatten')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()

      // Create user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (authError) {
        toast.error(authError.message)
        return
      }

      if (!authData.user) {
        toast.error('Er is iets misgegaan bij het aanmaken van je account')
        return
      }

      // Create user profile
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: profileError } = await (supabase as any)
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          business_name: formData.businessName,
          business_type: formData.businessType,
          owner_name: formData.ownerName,
          email: formData.email,
        })

      if (profileError) {
        console.error('Profile creation error:', JSON.stringify(profileError, null, 2))
        console.error('Profile error message:', profileError.message)
        console.error('Profile error code:', profileError.code)
        // Continue anyway, profile can be created later
      }

      // Create default location
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any).from('locations').insert({
        user_id: authData.user.id,
        name: 'Hoofdlocatie',
        is_default: true,
      })

      toast.success('Account aangemaakt! Controleer je e-mail om te bevestigen.')
      router.push('/login')
    } catch {
      toast.error('Er is iets misgegaan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 text-center mb-6">
        Account aanmaken
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="businessName" required>
            Bedrijfsnaam
          </Label>
          <Input
            id="businessName"
            name="businessName"
            type="text"
            value={formData.businessName}
            onChange={handleChange}
            placeholder="Uw bedrijfsnaam"
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="businessType" required>
            Type bedrijf
          </Label>
          <Select
            id="businessType"
            name="businessType"
            value={formData.businessType}
            onChange={handleChange}
            required
            className="mt-1"
          >
            {BUSINESS_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="ownerName">Uw naam</Label>
          <Input
            id="ownerName"
            name="ownerName"
            type="text"
            value={formData.ownerName}
            onChange={handleChange}
            placeholder="Voornaam Achternaam"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="email" required>
            E-mailadres
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="naam@bedrijf.be"
            required
            autoComplete="email"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="password" required>
            Wachtwoord
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Minimaal 6 tekens"
            required
            autoComplete="new-password"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword" required>
            Wachtwoord bevestigen
          </Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Herhaal wachtwoord"
            required
            autoComplete="new-password"
            className="mt-1"
          />
        </div>

        <Button type="submit" className="w-full" loading={loading}>
          Account aanmaken
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Al een account?{' '}
        <Link
          href="/login"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Inloggen
        </Link>
      </p>
    </div>
  )
}
