'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/layout'
import { Button, Input, Card, CardContent, PageLoader } from '@/components/ui'
import { useCategories, useCategoryMutations } from '@/hooks'
import { Plus, Pencil, Trash2, X, Check, Tags } from 'lucide-react'
import { toast } from 'sonner'

const COLORS = [
  { name: 'Grijs', value: '#6B7280' },
  { name: 'Rood', value: '#EF4444' },
  { name: 'Oranje', value: '#F97316' },
  { name: 'Geel', value: '#EAB308' },
  { name: 'Groen', value: '#22C55E' },
  { name: 'Blauw', value: '#3B82F6' },
  { name: 'Paars', value: '#8B5CF6' },
  { name: 'Roze', value: '#EC4899' },
]

export default function CategorieenPage() {
  const { categories, loading, refetch } = useCategories()
  const { createCategory, updateCategory, deleteCategory, loading: mutationLoading } = useCategoryMutations()

  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(COLORS[0].value)
  const [editName, setEditName] = useState('')
  const [editColor, setEditColor] = useState('')

  const handleAdd = async () => {
    if (!newName.trim()) {
      toast.error('Vul een naam in')
      return
    }

    try {
      await createCategory({
        name: newName.trim(),
        color: newColor,
      })
      toast.success('Categorie aangemaakt')
      setNewName('')
      setNewColor(COLORS[0].value)
      setIsAdding(false)
      refetch()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Er is iets misgegaan')
    }
  }

  const handleEdit = async (id: string) => {
    if (!editName.trim()) {
      toast.error('Vul een naam in')
      return
    }

    try {
      await updateCategory(id, {
        name: editName.trim(),
        color: editColor,
      })
      toast.success('Categorie bijgewerkt')
      setEditingId(null)
      refetch()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Er is iets misgegaan')
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Weet je zeker dat je "${name}" wilt verwijderen?`)) {
      return
    }

    try {
      await deleteCategory(id)
      toast.success('Categorie verwijderd')
      refetch()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Er is iets misgegaan')
    }
  }

  const startEdit = (category: { id: string; name: string; color: string | null }) => {
    setEditingId(category.id)
    setEditName(category.name)
    setEditColor(category.color || COLORS[0].value)
  }

  if (loading) {
    return <PageLoader />
  }

  return (
    <div>
      <PageHeader
        title="Categorieën"
        description={`${categories.length} categorieën`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Categorieën' },
        ]}
        actions={
          !isAdding && (
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nieuwe categorie
            </Button>
          )
        }
      />

      <div className="space-y-4">
        {/* Add new category form */}
        {isAdding && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Naam categorie..."
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    autoFocus
                  />
                </div>
                <div className="flex gap-1">
                  {COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setNewColor(color.value)}
                      className={`w-6 h-6 rounded-full border-2 ${
                        newColor === color.value ? 'border-gray-900' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
                <Button onClick={handleAdd} loading={mutationLoading} size="sm">
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsAdding(false)
                    setNewName('')
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Categories list */}
        {categories.length === 0 && !isAdding ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Tags className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Geen categorieën
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Maak categorieën aan om je producten te organiseren.
              </p>
              <Button className="mt-4" onClick={() => setIsAdding(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Eerste categorie aanmaken
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <div className="divide-y divide-gray-200">
              {categories.map((category) => (
                <div key={category.id} className="p-4">
                  {editingId === category.id ? (
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleEdit(category.id)}
                          autoFocus
                        />
                      </div>
                      <div className="flex gap-1">
                        {COLORS.map((color) => (
                          <button
                            key={color.value}
                            type="button"
                            onClick={() => setEditColor(color.value)}
                            className={`w-6 h-6 rounded-full border-2 ${
                              editColor === color.value ? 'border-gray-900' : 'border-transparent'
                            }`}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                          />
                        ))}
                      </div>
                      <Button onClick={() => handleEdit(category.id)} loading={mutationLoading} size="sm">
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingId(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color || COLORS[0].value }}
                        />
                        <span className="font-medium text-gray-900">{category.name}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEdit(category)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(category.id, category.name)}
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
