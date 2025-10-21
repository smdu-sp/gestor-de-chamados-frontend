import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns'

// Tailwind CSS class utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date formatting utilities
export const dateUtils = {
  // Format date to readable string
  format: (date: string | Date, formatStr: string = 'PPP') => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return isValid(dateObj) ? format(dateObj, formatStr) : 'Invalid date'
  },

  // Format date to relative time (e.g., "2 hours ago")
  formatRelative: (date: string | Date) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return isValid(dateObj) ? formatDistanceToNow(dateObj, { addSuffix: true }) : 'Invalid date'
  },

  // Format date for datetime-local input
  formatForInput: (date: string | Date) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return isValid(dateObj) ? format(dateObj, "yyyy-MM-dd'T'HH:mm") : ''
  },

  // Check if date is today
  isToday: (date: string | Date) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    const today = new Date()
    return isValid(dateObj) && 
           dateObj.getDate() === today.getDate() &&
           dateObj.getMonth() === today.getMonth() &&
           dateObj.getFullYear() === today.getFullYear()
  },

  // Get time difference in minutes
  getDifferenceInMinutes: (startDate: string | Date, endDate: string | Date = new Date()) => {
    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate
    
    if (!isValid(start) || !isValid(end)) return 0
    
    return Math.floor((end.getTime() - start.getTime()) / (1000 * 60))
  }
}

// String utilities
export const stringUtils = {
  // Capitalize first letter
  capitalize: (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  },

  // Convert to title case
  toTitleCase: (str: string) => {
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    )
  },

  // Truncate string with ellipsis
  truncate: (str: string, length: number = 50) => {
    return str.length > length ? str.substring(0, length) + '...' : str
  },

  // Generate initials from name
  getInitials: (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2)
  },

  // Slugify string for URLs
  slugify: (str: string) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  },

  // Generate random string
  generateId: (length: number = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  },

  // Extract domain from email
  extractDomain: (email: string) => {
    const match = email.match(/@([^@]+)$/)
    return match ? match[1] : ''
  }
}

// Number utilities
export const numberUtils = {
  // Format number with commas
  formatNumber: (num: number) => {
    return new Intl.NumberFormat().format(num)
  },

  // Format currency
  formatCurrency: (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  },

  // Format percentage
  formatPercentage: (value: number, decimals: number = 1) => {
    return `${value.toFixed(decimals)}%`
  },

  // Format file size
  formatFileSize: (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  },

  // Format duration in minutes to human readable
  formatDuration: (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`
    }
    
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    
    if (hours < 24) {
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
    }
    
    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24
    
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`
  },

  // Generate random number in range
  randomInRange: (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  },

  // Round to decimal places
  roundTo: (num: number, decimals: number = 2) => {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)
  }
}

// Array utilities
export const arrayUtils = {
  // Remove duplicates from array
  unique: <T>(array: T[]) => {
    return Array.from(new Set(array))
  },

  // Group array by key
  groupBy: <T, K extends keyof T>(array: T[], key: K) => {
    return array.reduce((groups, item) => {
      const group = item[key] as unknown as string
      if (!groups[group]) {
        groups[group] = []
      }
      groups[group].push(item)
      return groups
    }, {} as Record<string, T[]>)
  },

  // Sort array by key
  sortBy: <T, K extends keyof T>(array: T[], key: K, direction: 'asc' | 'desc' = 'asc') => {
    return [...array].sort((a, b) => {
      const aVal = a[key]
      const bVal = b[key]
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1
      if (aVal > bVal) return direction === 'asc' ? 1 : -1
      return 0
    })
  },

  // Chunk array into smaller arrays
  chunk: <T>(array: T[], size: number) => {
    const chunks: T[][] = []
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
    }
    return chunks
  },

  // Get random item from array
  randomItem: <T>(array: T[]) => {
    return array[Math.floor(Math.random() * array.length)]
  },

  // Move item in array
  moveItem: <T>(array: T[], fromIndex: number, toIndex: number) => {
    const result = [...array]
    const [removed] = result.splice(fromIndex, 1)
    result.splice(toIndex, 0, removed)
    return result
  }
}

// Object utilities
export const objectUtils = {
  // Deep clone object
  deepClone: <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj))
  },

  // Pick specific keys from object
  pick: <T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
    const result = {} as Pick<T, K>
    keys.forEach(key => {
      if (key in obj) {
        result[key] = obj[key]
      }
    })
    return result
  },

  // Omit specific keys from object
  omit: <T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
    const result = { ...obj }
    keys.forEach(key => {
      delete result[key]
    })
    return result
  },

  // Check if object is empty
  isEmpty: (obj: object) => {
    return Object.keys(obj).length === 0
  },

  // Get nested property safely
  get: (obj: any, path: string, defaultValue?: any) => {
    const keys = path.split('.')
    let result = obj
    
    for (const key of keys) {
      if (result == null || typeof result !== 'object') {
        return defaultValue
      }
      result = result[key]
    }
    
    return result !== undefined ? result : defaultValue
  },

  // Set nested property
  set: (obj: any, path: string, value: any) => {
    const keys = path.split('.')
    let current = obj
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i]
      if (!(key in current) || typeof current[key] !== 'object') {
        current[key] = {}
      }
      current = current[key]
    }
    
    current[keys[keys.length - 1]] = value
    return obj
  }
}

// Validation utilities
export const validationUtils = {
  // Email validation
  isValidEmail: (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  // Phone validation (basic)
  isValidPhone: (phone: string) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
  },

  // URL validation
  isValidUrl: (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  },

  // Password strength validation
  validatePassword: (password: string) => {
    const minLength = password.length >= 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    
    const score = [minLength, hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar]
      .filter(Boolean).length
    
    return {
      isValid: score >= 4,
      score,
      requirements: {
        minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChar
      }
    }
  },

  // Required field validation
  isRequired: (value: any) => {
    if (typeof value === 'string') {
      return value.trim().length > 0
    }
    return value != null && value !== ''
  },

  // Min/Max length validation
  validateLength: (value: string, min?: number, max?: number) => {
    const length = value.length
    const errors: string[] = []
    
    if (min !== undefined && length < min) {
      errors.push(`Minimum length is ${min} characters`)
    }
    
    if (max !== undefined && length > max) {
      errors.push(`Maximum length is ${max} characters`)
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

// Local storage utilities
export const storageUtils = {
  // Get item from localStorage with JSON parsing
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue || null
    } catch {
      return defaultValue || null
    }
  },

  // Set item to localStorage with JSON stringifying
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
    // Handle error silently
  }
  },

  // Remove item from localStorage
  remove: (key: string) => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
    // Handle error silently
  }
  },

  // Clear all localStorage
  clear: () => {
    try {
      localStorage.clear()
    } catch (error) {
    // Handle error silently
  }
  }
}

// URL utilities
export const urlUtils = {
  // Build query string from object
  buildQueryString: (params: Record<string, any>) => {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value != null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, v.toString()))
        } else {
          searchParams.append(key, value.toString())
        }
      }
    })
    
    return searchParams.toString()
  },

  // Parse query string to object
  parseQueryString: (queryString: string) => {
    const params = new URLSearchParams(queryString)
    const result: Record<string, string | string[]> = {}
    
    Array.from(params.entries()).forEach(([key, value]) => {
      if (result[key]) {
        if (Array.isArray(result[key])) {
          (result[key] as string[]).push(value)
        } else {
          result[key] = [result[key] as string, value]
        }
      } else {
        result[key] = value
      }
    })
    
    return result
  },

  // Get current page URL
  getCurrentUrl: () => {
    return typeof window !== 'undefined' ? window.location.href : ''
  },

  // Navigate to URL
  navigateTo: (url: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = url
    }
  }
}

// Color utilities
export const colorUtils = {
  // Generate random hex color
  randomHex: () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
  },

  // Convert hex to RGB
  hexToRgb: (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  },

  // Get contrasting text color (black or white) for background
  getContrastColor: (backgroundColor: string) => {
    const rgb = colorUtils.hexToRgb(backgroundColor)
    if (!rgb) return '#000000'
    
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
    return brightness > 128 ? '#000000' : '#ffffff'
  },

  // Generate color from string (consistent color for same string)
  stringToColor: (str: string) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    
    const color = (hash & 0x00FFFFFF).toString(16).toUpperCase()
    return '#' + '00000'.substring(0, 6 - color.length) + color
  }
}

// Debounce and throttle utilities
export const performanceUtils = {
  // Debounce function
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  },

  // Throttle function
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  },

  // Sleep function
  sleep: (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Export all utilities as a single object
export const utils = {
  date: dateUtils,
  string: stringUtils,
  number: numberUtils,
  array: arrayUtils,
  object: objectUtils,
  validation: validationUtils,
  storage: storageUtils,
  url: urlUtils,
  color: colorUtils,
  performance: performanceUtils
}