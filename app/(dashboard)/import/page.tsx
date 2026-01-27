'use client'

import { useState, useRef } from 'react'
import { PageHeader } from '@/components/layout'
import { Card, CardHeader, CardTitle, CardContent, CardDescription, Button, Input, Label } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks'
import { Upload, FileSpreadsheet, FileText, Check, AlertCircle, Download } from 'lucide-react'
import { toast } from 'sonner'

interface ImportRow {
  name: string
  sku?: string
  barcode?: string
  unit?: string
  purchase_price?: number
  selling_price?: number
  min_stock?: number
  category?: string
}

export default function ImportPage() {
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importing, setImporting] = useState(false)
  const [preview, setPreview] = useState<ImportRow[]>([])
  const [errors, setErrors] = useState<string[]>([])

  const parseCSV = (text: string): ImportRow[] => {
    const lines = text.trim().split('\n')
    if (lines.length < 2) return []

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    const rows: ImportRow[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      const row: any = {}

      headers.forEach((header, index) => {
        const value = values[index]
        if (header === 'name' || header === 'naam') row.name = value
        if (header === 'sku' || header === 'artikelnummer') row.sku = value
        if (header === 'barcode' || header === 'ean') row.barcode = value
        if (header === 'unit' || header === 'eenheid') row.unit = value || 'stuk'
        if (header === 'purchase_price' || header === 'inkoopprijs') row.purchase_price = parseFloat(value) || undefined
        if (header === 'selling_price' || header === 'verkoopprijs') row.selling_price = parseFloat(value) || undefined
        if (header === 'min_stock' || header === 'minimum') row.min_stock = parseFloat(value) || 0
        if (header === 'category' || header === 'categorie') row.category = value
      })

      if (row.name) rows.push(row)
    }

    return rows
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      const parsed = parseCSV(text)
      setPreview(parsed)
      setErrors([])

      // Validate
      const errs: string[] = []
      parsed.forEach((row, index) => {
        if (!row.name) errs.push(`Rij ${index + 2}: Naam ontbreekt`)
      })
      setErrors(errs)
    }
    reader.readAsText(file)
  }

  const handleImport = async () => {
    if (!user || preview.length === 0) return

    setImporting(true)
    try {
      const supabase = createClient()

      // Get or create categories
      const categoryMap = new Map<string, string>()
      const uniqueCategories = [...new Set(preview.map(r => r.category).filter(Boolean))]

      for (const catName of uniqueCategories) {
        // Check if exists
        const { data: existing } = await supabase
          .from('categories')
          .select('id')
          .eq('name', catName)
          .single()

        if (existing) {
          categoryMap.set(catName!, existing.id)
        } else {
          // Create category
          const { data: newCat } = await (supabase as any)
            .from('categories')
            .insert({ name: catName, user_id: user.id })
            .select()
            .single()

          if (newCat) categoryMap.set(catName!, newCat.id)
        }
      }

      // Import products
      const products = preview.map(row => ({
        name: row.name,
        sku: row.sku || null,
        barcode: row.barcode || null,
        unit: row.unit || 'stuk',
        purchase_price: row.purchase_price || null,
        selling_price: row.selling_price || null,
        min_stock: row.min_stock || 0,
        category_id: row.category ? categoryMap.get(row.category) || null : null,
        user_id: user.id,
      }))

      const { error } = await (supabase as any)
        .from('products')
        .insert(products)

      if (error) throw error

      toast.success(`${products.length} producten geïmporteerd`)
      setPreview([])
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err) {
      console.error('Import error:', err)
      toast.error('Er is iets misgegaan bij het importeren')
    } finally {
      setImporting(false)
    }
  }

  const downloadTemplate = () => {
    const template = 'naam,sku,barcode,eenheid,inkoopprijs,verkoopprijs,minimum,categorie\nAppels Jonagold,APP-001,5400141123456,kg,1.50,2.50,10,Fruit\nWortelen,WOR-001,,kg,0.80,1.50,5,Groenten'
    const blob = new Blob([template], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'producten_template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <PageHeader
        title="Import"
        description="Importeer producten via CSV"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Import' },
        ]}
      />

      <div className="space-y-6">
        {/* Upload */}
        <Card>
          <CardHeader>
            <div className="p-3 rounded-lg bg-blue-50 text-blue-600 w-fit">
              <FileText className="h-6 w-6" />
            </div>
            <CardTitle className="mt-4">CSV import</CardTitle>
            <CardDescription>
              Importeer producten uit een CSV bestand
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-3" />
              <p className="text-sm text-gray-600 mb-2">
                Sleep een bestand hierheen of
              </p>
              <Input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
                id="csvFile"
              />
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                Selecteer bestand
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Template */}
        <Card>
          <CardHeader>
            <CardTitle>Template downloaden</CardTitle>
            <CardDescription>
              Download een template met de juiste kolomindeling
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              CSV template downloaden
            </Button>
            <p className="mt-3 text-sm text-gray-500">
              Kolommen: naam, sku, barcode, eenheid, inkoopprijs, verkoopprijs, minimum, categorie
            </p>
          </CardContent>
        </Card>

        {/* Preview */}
        {preview.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Voorbeeld ({preview.length} producten)</CardTitle>
                  {errors.length > 0 && (
                    <p className="text-sm text-red-600 mt-1">
                      <AlertCircle className="h-4 w-4 inline mr-1" />
                      {errors.length} fout(en) gevonden
                    </p>
                  )}
                </div>
                <Button onClick={handleImport} loading={importing} disabled={errors.length > 0}>
                  <Check className="h-4 w-4 mr-2" />
                  Importeren
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {errors.length > 0 && (
                <div className="mb-4 p-3 bg-red-50 rounded-lg text-sm text-red-700">
                  {errors.map((err, i) => (
                    <p key={i}>{err}</p>
                  ))}
                </div>
              )}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Naam</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">SKU</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Eenheid</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Inkoopprijs</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Categorie</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {preview.slice(0, 10).map((row, i) => (
                      <tr key={i}>
                        <td className="px-4 py-2 text-sm">{row.name}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">{row.sku || '-'}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">{row.unit || 'stuk'}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">{row.purchase_price ? `€${row.purchase_price}` : '-'}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">{row.category || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {preview.length > 10 && (
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    En {preview.length - 10} meer...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
