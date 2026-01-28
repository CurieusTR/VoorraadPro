'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './useAuth'

export interface StockBatch {
  id: string
  product_id: string
  location_id: string | null
  batch_number: string | null
  quantity: number
  expiry_date: string | null
  purchase_date: string | null
  supplier_id: string | null
  unit_price: number | null
  is_active: boolean
  created_at: string
  updated_at: string
  supplier?: {
    id: string
    name: string
  } | null
}

export interface CreateBatchData {
  product_id: string
  location_id?: string | null
  batch_number?: string | null
  quantity: number
  expiry_date?: string | null
  purchase_date?: string | null
  supplier_id?: string | null
  unit_price?: number | null
}

export function useStockBatches(productId?: string) {
  const [batches, setBatches] = useState<StockBatch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBatches = useCallback(async () => {
    if (!productId) {
      setBatches([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error: queryError } = await (supabase as any)
        .from('stock_batches')
        .select(`
          *,
          supplier:suppliers(id, name)
        `)
        .eq('product_id', productId)
        .eq('is_active', true)
        .gt('quantity', 0)
        .order('expiry_date', { ascending: true, nullsFirst: false })
        .order('purchase_date', { ascending: true })

      if (queryError) throw queryError

      setBatches(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is iets misgegaan')
    } finally {
      setLoading(false)
    }
  }, [productId])

  useEffect(() => {
    fetchBatches()
  }, [fetchBatches])

  return { batches, loading, error, refetch: fetchBatches }
}

export function useStockBatchMutations() {
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  // Create a new batch (for incoming stock)
  const createBatch = async (data: CreateBatchData): Promise<StockBatch | null> => {
    if (!user) {
      throw new Error('Je moet ingelogd zijn')
    }

    setLoading(true)
    try {
      const supabase = createClient()

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: batch, error } = await (supabase as any)
        .from('stock_batches')
        .insert({
          ...data,
          purchase_date: data.purchase_date || new Date().toISOString().split('T')[0],
          is_active: true,
        })
        .select(`
          *,
          supplier:suppliers(id, name)
        `)
        .single()

      if (error) throw error

      return batch
    } catch (err) {
      console.error('Create batch error:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Reduce batch quantity (for outgoing stock) - FIFO
  const reduceBatchQuantity = async (
    productId: string,
    quantity: number
  ): Promise<{ batchesUsed: { batchId: string; quantityUsed: number }[] }> => {
    if (!user) {
      throw new Error('Je moet ingelogd zijn')
    }

    setLoading(true)
    try {
      const supabase = createClient()

      // Get batches ordered by FIFO (oldest first by expiry, then by purchase date)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: batches, error: fetchError } = await (supabase as any)
        .from('stock_batches')
        .select('*')
        .eq('product_id', productId)
        .eq('is_active', true)
        .gt('quantity', 0)
        .order('expiry_date', { ascending: true, nullsFirst: false })
        .order('purchase_date', { ascending: true })

      if (fetchError) throw fetchError

      if (!batches || batches.length === 0) {
        // No batches, just reduce from product total (legacy mode)
        return { batchesUsed: [] }
      }

      let remainingQuantity = quantity
      const batchesUsed: { batchId: string; quantityUsed: number }[] = []

      for (const batch of batches) {
        if (remainingQuantity <= 0) break

        const quantityFromBatch = Math.min(batch.quantity, remainingQuantity)
        const newQuantity = batch.quantity - quantityFromBatch

        // Update batch quantity
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: updateError } = await (supabase as any)
          .from('stock_batches')
          .update({
            quantity: newQuantity,
            is_active: newQuantity > 0,
            updated_at: new Date().toISOString()
          })
          .eq('id', batch.id)

        if (updateError) throw updateError

        batchesUsed.push({
          batchId: batch.id,
          quantityUsed: quantityFromBatch,
        })

        remainingQuantity -= quantityFromBatch
      }

      return { batchesUsed }
    } catch (err) {
      console.error('Reduce batch quantity error:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Update a specific batch
  const updateBatch = async (
    batchId: string,
    data: Partial<CreateBatchData>
  ): Promise<StockBatch | null> => {
    setLoading(true)
    try {
      const supabase = createClient()

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: batch, error } = await (supabase as any)
        .from('stock_batches')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', batchId)
        .select(`
          *,
          supplier:suppliers(id, name)
        `)
        .single()

      if (error) throw error

      return batch
    } catch (err) {
      console.error('Update batch error:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    createBatch,
    reduceBatchQuantity,
    updateBatch,
    loading,
  }
}
