'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './useAuth'
import type {
  StockMovement,
  StockMovementWithProduct,
  MovementType,
  InsertTables,
} from '@/lib/supabase/types'

interface UseStockMovementsOptions {
  productId?: string
  movementType?: MovementType
  startDate?: Date
  endDate?: Date
  limit?: number
}

export function useStockMovements(options: UseStockMovementsOptions = {}) {
  const [movements, setMovements] = useState<StockMovementWithProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMovements = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      let query = supabase
        .from('stock_movements')
        .select(
          `
          *,
          product:products(id, name, unit, current_stock)
        `
        )
        .order('movement_date', { ascending: false })

      if (options.productId) {
        query = query.eq('product_id', options.productId)
      }

      if (options.movementType) {
        query = query.eq('movement_type', options.movementType)
      }

      if (options.startDate) {
        query = query.gte('movement_date', options.startDate.toISOString())
      }

      if (options.endDate) {
        query = query.lte('movement_date', options.endDate.toISOString())
      }

      if (options.limit) {
        query = query.limit(options.limit)
      }

      const { data, error: queryError } = await query

      if (queryError) throw queryError

      setMovements(data as StockMovementWithProduct[])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is iets misgegaan')
    } finally {
      setLoading(false)
    }
  }, [
    options.productId,
    options.movementType,
    options.startDate,
    options.endDate,
    options.limit,
  ])

  useEffect(() => {
    fetchMovements()
  }, [fetchMovements])

  return { movements, loading, error, refetch: fetchMovements }
}

export function useStockMutations() {
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const createMovement = async (
    data: Omit<InsertTables<'stock_movements'>, 'user_id'>
  ): Promise<StockMovement | null> => {
    if (!user) {
      throw new Error('Je moet ingelogd zijn om mutaties aan te maken')
    }

    setLoading(true)
    try {
      const supabase = createClient()

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: movement, error } = await (supabase as any)
        .from('stock_movements')
        .insert({ ...data, user_id: user.id })
        .select()
        .single()

      if (error) throw error

      return movement
    } catch (err) {
      console.error('Create movement error:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createBulkMovements = async (
    items: Array<Omit<InsertTables<'stock_movements'>, 'user_id'>>
  ): Promise<StockMovement[]> => {
    if (!user) {
      throw new Error('Je moet ingelogd zijn om mutaties aan te maken')
    }

    setLoading(true)
    try {
      const supabase = createClient()

      const dataWithUser = items.map((item) => ({
        ...item,
        user_id: user.id,
      }))

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: movements, error } = await (supabase as any)
        .from('stock_movements')
        .insert(dataWithUser)
        .select()

      if (error) throw error

      return movements || []
    } catch (err) {
      console.error('Create bulk movements error:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    createMovement,
    createBulkMovements,
    loading,
  }
}

// Helper to get movement direction
export function getMovementDirection(type: MovementType): 'in' | 'out' {
  const inTypes: MovementType[] = [
    'purchase',
    'adjustment_plus',
    'transfer_in',
    'return_customer',
    'inventory_count',
  ]
  return inTypes.includes(type) ? 'in' : 'out'
}
