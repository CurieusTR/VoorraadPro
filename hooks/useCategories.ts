'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './useAuth'
import type { Category, InsertTables, UpdateTables } from '@/lib/supabase/types'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data, error: queryError } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true })

      if (queryError) throw queryError

      setCategories(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is iets misgegaan')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return { categories, loading, error, refetch: fetchCategories }
}

export function useCategoryMutations() {
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const createCategory = async (
    data: Omit<InsertTables<'categories'>, 'user_id'>
  ): Promise<Category | null> => {
    if (!user) {
      throw new Error('Je moet ingelogd zijn om categorieën aan te maken')
    }

    setLoading(true)
    try {
      const supabase = createClient()

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: category, error } = await (supabase as any)
        .from('categories')
        .insert({ ...data, user_id: user.id })
        .select()
        .single()

      if (error) throw error

      return category
    } catch (err) {
      console.error('Create category error:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateCategory = async (
    id: string,
    data: UpdateTables<'categories'>
  ): Promise<Category | null> => {
    setLoading(true)
    try {
      const supabase = createClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: category, error } = await (supabase as any)
        .from('categories')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return category
    } catch (err) {
      console.error('Update category error:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteCategory = async (id: string): Promise<boolean> => {
    setLoading(true)
    try {
      const supabase = createClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any).from('categories').delete().eq('id', id)

      if (error) throw error

      return true
    } catch (err) {
      console.error('Delete category error:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    createCategory,
    updateCategory,
    deleteCategory,
    loading,
  }
}
