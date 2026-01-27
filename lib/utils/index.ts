import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('nl-BE', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatNumber(num: number, decimals = 2): string {
  return new Intl.NumberFormat('nl-BE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(num)
}

export function formatDate(date: string | Date, format: 'short' | 'long' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date

  if (format === 'long') {
    return new Intl.DateTimeFormat('nl-BE', {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(d)
  }

  return new Intl.DateTimeFormat('nl-BE', {
    dateStyle: 'short',
  }).format(d)
}

export function formatRelativeDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInMs = d.getTime() - now.getTime()
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return 'Vandaag'
  if (diffInDays === 1) return 'Morgen'
  if (diffInDays === -1) return 'Gisteren'
  if (diffInDays > 0 && diffInDays <= 7) return `Over ${diffInDays} dagen`
  if (diffInDays < 0 && diffInDays >= -7) return `${Math.abs(diffInDays)} dagen geleden`

  return formatDate(d)
}

export function daysUntilExpiry(expiryDate: string | Date): number {
  const d = typeof expiryDate === 'string' ? new Date(expiryDate) : expiryDate
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  d.setHours(0, 0, 0, 0)
  return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export function getStockStatus(current: number, min: number): 'ok' | 'low' | 'critical' | 'out' {
  if (current <= 0) return 'out'
  if (current <= min * 0.5) return 'critical'
  if (current <= min) return 'low'
  return 'ok'
}

export function getStockStatusColor(status: 'ok' | 'low' | 'critical' | 'out'): string {
  switch (status) {
    case 'ok':
      return 'text-green-600 bg-green-50'
    case 'low':
      return 'text-yellow-600 bg-yellow-50'
    case 'critical':
      return 'text-orange-600 bg-orange-50'
    case 'out':
      return 'text-red-600 bg-red-50'
  }
}

export function getExpiryStatus(daysLeft: number): 'ok' | 'warning' | 'urgent' | 'expired' {
  if (daysLeft < 0) return 'expired'
  if (daysLeft <= 2) return 'urgent'
  if (daysLeft <= 7) return 'warning'
  return 'ok'
}

export function getExpiryStatusColor(status: 'ok' | 'warning' | 'urgent' | 'expired'): string {
  switch (status) {
    case 'ok':
      return 'text-green-600 bg-green-50'
    case 'warning':
      return 'text-yellow-600 bg-yellow-50'
    case 'urgent':
      return 'text-orange-600 bg-orange-50'
    case 'expired':
      return 'text-red-600 bg-red-50'
  }
}

export function generateSKU(name: string, index?: number): string {
  const prefix = name
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 4)
  const suffix = index?.toString().padStart(4, '0') || Math.random().toString(36).substr(2, 4).toUpperCase()
  return `${prefix}-${suffix}`
}

export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
