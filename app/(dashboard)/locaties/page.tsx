'use client'

import { useState, useEffect, useCallback } from 'react'
import { PageHeader } from '@/components/layout'
import { Button, Input, Card, CardContent, PageLoader, Badge } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks'
import { Plus, Pencil, Trash2, X, Check, MapPin, Star } from 'lucide-react'
import { toast } from 'sonner'

interface Location {
  id: string
  name: string
  description: string | null
  address: string | null
  is_default: boolean
  is_active: boolean
}

export default function LocatiesPage() {
  const { user } = useAuth()
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [mutationLoading, setMutationLoading] = useState(false)

  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newName, setNewName] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')

  const fetchLocations = useCallback(async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('is_default', { ascending: false })
        .order('name', { ascending: true })

      if (error) throw error
      setLocations(data || [])
    } catch (err) {
      console.error('Error fetching locations:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLocations()
  }, [fetchLocations])

  const handleAdd = async () => {
    if (!newName.trim() || !user) return

    setMutationLoading(true)
    try {
      const supabase = createClient()
      const { error } = await (supabase as any)
        .from('locations')
        .insert({
          name: newName.trim(),
          description: newDescription.trim() || null,
          user_id: user.id,
          is_default: locations.length === 0,
        })

      if (error) throw error

      toast.success('Locatie aangemaakt')
      setNewName('')
      setNewDescription('')
      setIsAdding(false)
      fetchLocations()
    } catch (err) {
      toast.error('Er is iets misgegaan')
    } finally {
      setMutationLoading(false)
    }
  }

  const handleEdit = async (id: string) => {
    if (!editName.trim()) return

    setMutationLoading(true)
    try {
      const supabase = createClient()
      const { error } = await (supabase as any)
        .from('locations')
        .update({
          name: editName.trim(),
          description: editDescription.trim() || null,
        })
        .eq('id', id)

      if (error) throw error

      toast.success('Locatie bijgewerkt')
      setEditingId(null)
      fetchLocations()
    } catch (err) {
      toast.error('Er is iets misgegaan')
    } finally {
      setMutationLoading(false)
    }
  }

  const handleSetDefault = async (id: string) => {
    setMutationLoading(true)
    try {
      const supabase = createClient()

      // Remove default from all
      await (supabase as any)
        .from('locations')
        .update({ is_default: false })
        .neq('id', id)

      // Set new default
      const { error } = await (supabase as any)
        .from('locations')
        .update({ is_default: true })
        .eq('id', id)

      if (error) throw error

      toast.success('Standaard locatie ingesteld')
      fetchLocations()
    } catch (err) {
      toast.error('Er is iets misgegaan')
    } finally {
      setMutationLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Weet je zeker dat je "${name}" wilt verwijderen?`)) return

    setMutationLoading(true)
    try {
      const supabase = createClient()
      const { error } = await (supabase as any)
        .from('locations')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Locatie verwijderd')
      fetchLocations()
    } catch (err) {
      toast.error('Er is iets misgegaan')
    } finally {
      setMutationLoading(false)
    }
  }

  if (loading) {
    return <PageLoader />
  }

  return (
    <div>
      <PageHeader
        title="Locaties"
        description={`${locations.length} locaties`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Locaties' },
        ]}
        actions={
          !isAdding && (
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nieuwe locatie
            </Button>
          )
        }
      />

      <div className="space-y-4">
        {/* Add form */}
        {isAdding && (
          <Card>
            <CardContent className="p-4 space-y-3">
              <Input
                placeholder="Naam locatie..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
              />
              <Input
                placeholder="Beschrijving (optioneel)..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={handleAdd} loading={mutationLoading}>
                  <Check className="h-4 w-4 mr-2" />
                  Toevoegen
                </Button>
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Annuleren
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Locations list */}
        {locations.length === 0 && !isAdding ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MapPin className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Geen locaties
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Voeg locaties toe om voorraad per locatie bij te houden.
              </p>
              <Button className="mt-4" onClick={() => setIsAdding(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Eerste locatie aanmaken
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <div className="divide-y divide-gray-200">
              {locations.map((location) => (
                <div key={location.id} className="p-4">
                  {editingId === location.id ? (
                    <div className="space-y-3">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        autoFocus
                      />
                      <Input
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="Beschrijving..."
                      />
                      <div className="flex gap-2">
                        <Button onClick={() => handleEdit(location.id)} loading={mutationLoading} size="sm">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{location.name}</span>
                            {location.is_default && (
                              <Badge className="bg-blue-100 text-blue-800">
                                <Star className="h-3 w-3 mr-1" />
                                Standaard
                              </Badge>
                            )}
                          </div>
                          {location.description && (
                            <p className="text-sm text-gray-500">{location.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!location.is_default && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSetDefault(location.id)}
                            title="Instellen als standaard"
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingId(location.id)
                            setEditName(location.name)
                            setEditDescription(location.description || '')
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(location.id, location.name)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
