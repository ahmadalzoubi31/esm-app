'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import type { VisibilityState } from '@tanstack/react-table'
// import {
//   getTablePreference,
//   upsertTablePreference,
// } from '@/lib/services/user-preferences.service'

const STORAGE_PREFIX = 'table-column-prefs:'

interface UseTableColumnPreferencesOptions {
  preferenceKey?: string
  defaultVisibility: VisibilityState
}

export function useTableColumnPreferences({
  preferenceKey,
  defaultVisibility,
}: UseTableColumnPreferencesOptions) {
  const storageKey = preferenceKey ? `${STORAGE_PREFIX}${preferenceKey}` : null

  // Always start with defaults to match server render (prevents hydration mismatch)
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(defaultVisibility)
  const hasLoadedRef = useRef(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Load preferences from localStorage first (fast), then backend (authoritative)
  useEffect(() => {
    if (typeof window === 'undefined' || !preferenceKey || hasLoadedRef.current)
      return

    const loadPreferences = async () => {
      // 1. Try localStorage first for immediate UI feedback
      try {
        if (storageKey) {
          const saved = localStorage.getItem(storageKey)
          if (saved) {
            const parsed = JSON.parse(saved) as VisibilityState
            // Merge with defaults to handle new columns
            setColumnVisibility((prev) => ({ ...prev, ...parsed }))
          }
        }
      } catch (error) {
        console.error(
          'Failed to load column preferences from localStorage:',
          error,
        )
      }

      // 2. Then fetch from backend to sync/update
      try {
        const backendPrefs = {}
        if (backendPrefs && Object.keys(backendPrefs).length > 0) {
          // Wrap in setTimeout to avoid React state update during render cycle
          setTimeout(() => {
            setColumnVisibility((prev) => ({ ...prev, ...backendPrefs }))
          }, 0)

          // Update localStorage with authoritative data
          if (storageKey) {
            localStorage.setItem(storageKey, JSON.stringify(backendPrefs))
          }
        }
      } catch (error) {
        console.warn('Failed to load preferences from backend:', error)
      }

      hasLoadedRef.current = true
    }

    loadPreferences()
  }, [preferenceKey, storageKey])

  // Debounced save to backend and localStorage
  const savePreferences = useCallback(
    async (prefs: VisibilityState) => {
      if (!preferenceKey || !hasLoadedRef.current) return

      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      // Save to localStorage immediately (fast cache)
      if (storageKey) {
        try {
          localStorage.setItem(storageKey, JSON.stringify(prefs))
        } catch (error) {
          console.error('Failed to save to localStorage:', error)
        }
      }

      // Debounce backend save (wait 500ms after last change)
      saveTimeoutRef.current = setTimeout(async () => {
        try {
          //   await upsertTablePreference(preferenceKey, prefs)
        } catch (error) {
          console.error('Failed to save preferences to backend:', error)
          // Continue working with localStorage even if backend fails
        }
      }, 500)
    },
    [preferenceKey, storageKey],
  )

  // Save whenever visibility changes
  useEffect(() => {
    if (!hasLoadedRef.current) return
    savePreferences(columnVisibility)
  }, [columnVisibility, savePreferences])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  return {
    columnVisibility,
    setColumnVisibility,
  }
}
