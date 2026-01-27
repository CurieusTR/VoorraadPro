'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './useAuth'
import type { Product, ProductWithCategory, InsertTables, UpdateTables } from '@/lib/supabase/types'

interface UseProductsOptions {
  search?: string
  categoryId?: string
  activeOnly?: boolean
  lowStockOnly?: boolean
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<ProductWithCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name, color, icon)
        `)
        .order('name', { ascending: true })

      if (options.activeOnly !== false) {
        query = query.eq('is_active', true)
      }

      if (options.categoryId) {
        query = query.eq('category_id', options.categoryId)
      }

      if (options.search) {
        query = query.or(
          `name.ilike.%${options.search}%,sku.ilike.%${options.search}%,barcode.ilike.%${options.search}%`
        )
      }

      if (options.lowStockOnly) {
        query = query.filter('current_stock', 'lte', 'min_stock')
      }

      const { data, error: queryError } = await query

      if (queryError) throw queryError

      setProducts(data as ProductWithCategory[])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is iets misgegaan')
    } finally {
      setLoading(false)
    }
  }, [options.search, options.categoryId, options.activeOnly, options.lowStockOnly])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return { products, loading, error, refetch: fetchProducts }
}

export function useProduct(id: string | null) {
  const [product, setProduct] = useState<ProductWithCategory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    const fetchProduct = async () => {
      setLoading(true)
      setError(null)

      try {
        const supabase = createClient()
        const { data, error: queryError } = await supabase
          .from('products')
          .select(`
            *,
            category:categories(id, name, color, icon)
          `)
          .eq('id', id)
          .single()

        if (queryError) throw queryError

        setProduct(data as ProductWithCategory)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Product niet gevonden')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  return { product, loading, error }
}

export function useProductMutations() {
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const createProduct = async (
    data: Omit<InsertTables<'products'>, 'user_id'>
  ): Promise<Product | null> => {
    if (!user) {
      throw new Error('Je moet ingelogd zijn om producten aan te maken')
    }

    setLoading(true)
    try {
      const supabase = createClient()

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: product, error } = await (supabase as any)
        .from('products')
        .insert({ ...data, user_id: user.id })
        .select()
        .single()

      if (error) {
        console.error('Supabase error details:', JSON.stringify(error, null, 2))
        throw new Error(error.message || 'Database fout')
      }

      return product
    } catch (err) {
      console.error('Create product error:', err)
      if (err instanceof Error) {
        throw err
      }
      throw new Error('Onbekende fout bij aanmaken product')
    } finally {
      setLoading(false)
    }
  }

  const updateProduct = async (
    id: string,
    data: Partial<Omit<InsertTables<'products'>, 'user_id'>>
  ): Promise<Product | null> => {
    setLoading(true)
    try {
      const supabase = createClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: product, error } = await (supabase as any)
        .from('products')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return product
    } catch (err) {
      console.error('Update product error:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (id: string): Promise<boolean> => {
    setLoading(true)
    try {
      const supabase = createClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('products')
        .update({ is_active: false })
        .eq('id', id)

      if (error) throw error

      return true
    } catch (err) {
      console.error('Delete product error:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const lookupBarcode = async (barcode: string): Promise<Product | null> => {
    try {
      const supabase = createClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase as any)
        .from('products')
        .select()
        .eq('barcode', barcode)
        .eq('is_active', true)
        .single()

      return data
    } catch {
      return null
    }
  }

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    lookupBarcode,
    loading,
  }
}
