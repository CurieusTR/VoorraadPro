'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/layout'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  Button,
  Input,
  Label,
  Select,
} from '@/components/ui'
import { createClient } from '@/lib/supabase/client'
import { BUSINESS_TYPES } from '@/lib/supabase/types'
import { toast } from 'sonner'
import { Save } from 'lucide-react'

export default function InstellingenPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState({
    business_name: '',
    business_type: 'handelaar',
    owner_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    btw_nummer: '',
  })

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data } = await (supabase as any)
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (data) {
          setProfile({
            business_name: data.business_name || '',
            business_type: data.business_type || 'handelaar',
            owner_name: data.owner_name || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            city: data.city || '',
            postal_code: data.postal_code || '',
            btw_nummer: data.btw_nummer || '',
          })
        }
      }
      setLoading(false)
    }

    fetchProfile()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Niet ingelogd')

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('user_profiles')
        .update(profile)
        .eq('id', user.id)

      if (error) throw error

      toast.success('Instellingen opgeslagen')
    } catch (err) {
      toast.error('Kon instellingen niet opslaan')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="animate-pulse">Laden...</div>
  }

  return (
    <div>
      <PageHeader
        title="Instellingen"
        description="Beheer je bedrijfsgegevens"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Instellingen' },
        ]}
      />

      <div className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Bedrijfsgegevens</CardTitle>
            <CardDescription>
              Deze gegevens worden gebruikt op rapporten en documenten
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="business_name">Bedrijfsnaam</Label>
                <Input
                  id="business_name"
                  value={profile.business_name}
                  onChange={(e) =>
                    setProfile({ ...profile, business_name: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="business_type">Type bedrijf</Label>
                <Select
                  id="business_type"
                  value={profile.business_type}
                  onChange={(e) =>
                    setProfile({ ...profile, business_type: e.target.value })
                  }
                  className="mt-1"
                >
                  {BUSINESS_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="owner_name">Eigenaar / contactpersoon</Label>
                <Input
                  id="owner_name"
                  value={profile.owner_name}
                  onChange={(e) =>
                    setProfile({ ...profile, owner_name: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="btw_nummer">BTW-nummer</Label>
                <Input
                  id="btw_nummer"
                  value={profile.btw_nummer}
                  onChange={(e) =>
                    setProfile({ ...profile, btw_nummer: e.target.value })
                  }
                  className="mt-1"
                  placeholder="BE0123456789"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contactgegevens</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">E-mailadres</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phone">Telefoonnummer</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Adres</Label>
              <Input
                id="address"
                value={profile.address}
                onChange={(e) =>
                  setProfile({ ...profile, address: e.target.value })
                }
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="postal_code">Postcode</Label>
                <Input
                  id="postal_code"
                  value={profile.postal_code}
                  onChange={(e) =>
                    setProfile({ ...profile, postal_code: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="city">Plaats</Label>
                <Input
                  id="city"
                  value={profile.city}
                  onChange={(e) =>
                    setProfile({ ...profile, city: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} loading={saving}>
            <Save className="h-4 w-4 mr-2" />
            Opslaan
          </Button>
        </div>
      </div>
    </div>
  )
}
