'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/layout'
import { Button, Input, Label, Textarea, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks'
import { toast } from 'sonner'

export default function NieuweLeverancierPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    contact_person: '',
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    city: '',
    postal_code: '',
    btw_nummer: '',
    payment_terms: '30',
    notes: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await (supabase as any)
        .from('suppliers')
        .insert({
          ...formData,
          payment_terms: parseInt(formData.payment_terms) || 30,
          user_id: user.id,
        })

      if (error) throw error

      toast.success('Leverancier aangemaakt')
      router.push('/leveranciers')
    } catch (err) {
      toast.error('Er is iets misgegaan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Nieuwe leverancier"
        description="Voeg een nieuwe leverancier toe"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Leveranciers', href: '/leveranciers' },
          { label: 'Nieuwe leverancier' },
        ]}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Bedrijfsgegevens</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" required>Bedrijfsnaam</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="contact_person">Contactpersoon</Label>
                <Input
                  id="contact_person"
                  name="contact_person"
                  value={formData.contact_person}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefoon</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="+32 ..."
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Adres</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Straat en nummer</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="postal_code">Postcode</Label>
                <Input
                  id="postal_code"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="city">Stad</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Extra informatie</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="btw_nummer">BTW-nummer</Label>
                <Input
                  id="btw_nummer"
                  name="btw_nummer"
                  value={formData.btw_nummer}
                  onChange={handleChange}
                  placeholder="BE 0123.456.789"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="payment_terms">Betaaltermijn (dagen)</Label>
                <Input
                  id="payment_terms"
                  name="payment_terms"
                  type="number"
                  value={formData.payment_terms}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notities</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Annuleren
          </Button>
          <Button type="submit" loading={loading}>
            Leverancier aanmaken
          </Button>
        </div>
      </form>
    </div>
  )
}
