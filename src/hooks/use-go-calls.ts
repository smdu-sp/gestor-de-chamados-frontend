import { useState, useEffect, useCallback } from 'react'
import { GoCallsService } from '@/services/go-calls.service'
import type { GoCallFilters } from '@/types/go-backend'
import type { PaginationParams, PaginatedResponse } from '@/types/api'

export function useGoCalls(
  initialPagination?: Partial<PaginationParams>,
  initialFilters?: GoCallFilters
) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    ...initialPagination,
  })
  const [filters, setFilters] = useState<GoCallFilters>(initialFilters || {})

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await GoCallsService.getCalls(pagination, filters)
      setData(response.data)
    } catch (err) {
      setError(err as Error)
      setData([])
    } finally {
      setLoading(false)
    }
  }, [pagination, filters])

  const refetch = useCallback(() => {
    fetchData()
  }, [fetchData])

  const updatePagination = useCallback((newPagination: Partial<PaginationParams>) => {
    setPagination(prev => ({ ...prev, ...newPagination }))
  }, [])

  const updateFilters = useCallback((newFilters: Partial<GoCallFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    // Reset to first page when filters change
    setPagination(prev => ({ ...prev, page: 1 }))
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    pagination,
    filters,
    refetch,
    updatePagination,
    updateFilters,
  }
}

export function useGoCall(id: string) {
  const [data, setData] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    if (!id) return

    try {
      setLoading(true)
      setError(null)
      
      const response = await GoCallsService.getCall(id)
      setData(response)
    } catch (err) {
      setError(err as Error)
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  const refetch = useCallback(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch,
  }
}