import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useRouter } from '@tanstack/react-router'
import { authKeys } from '../queries/auth.query'
import { sessionKeys } from '../queries/session.query'
import {
  signInFn,
  resetPasswordFn,
  cleanupOldTokensFn,
} from '@/server/auth.server'
import type { ResetPasswordDto } from '@/types'
import { LoginSchema } from '@/schemas/auth.schema'
import z from 'zod'
import { queryClient } from '../query-client'
import { api } from '../api'

/**
 * Hook for signing in a user
 */
export function useSignInMutation() {
  const router = useRouter()

  return useMutation({
    mutationFn: (dto: z.infer<typeof LoginSchema>) => signInFn({ data: dto }),
    onSuccess: async () => {
      // Invalidate profile query to fetch new user data
      await queryClient.invalidateQueries({ queryKey: authKeys.profile() })

      toast.success('Logged in successfully')

      // Check if there's a redirect URL in the search params
      const searchParams = new URL(window.location.href).searchParams
      const redirectUrl = searchParams.get('redirect')

      // Navigate to the redirect URL or default to dashboard
      await router.navigate({ to: redirectUrl || '/dashboard' })
    },
    onError: (error) => {
      toast.error('Failed to log in: Unauthorized')
    },
  })
}

/**
 * Hook for logging out the current session
 */
export function useLogoutMutation() {
  const router = useRouter()

  return useMutation({
    mutationKey: authKeys.logout(),
    mutationFn: () => api.auth.logout(),
    onSuccess: async () => {
      // Clear all auth and session related data
      queryClient.removeQueries({ queryKey: authKeys.all })
      queryClient.removeQueries({ queryKey: sessionKeys.all })

      toast.success('Logged out successfully')

      // Navigate to login page
      await router.navigate({ to: '/login' })
    },
    onError: (error) => {
      console.error('Logout error:', error)
      toast.error('Failed to log out')
    },
  })
}

/**
 * Hook for refreshing authentication tokens
 */
export function useRefreshTokensMutation() {
  return useMutation({
    mutationKey: authKeys.refreshTokens(),
    mutationFn: () => api.auth.refreshTokens(),
    onSuccess: () => {
      // Profile data might have changed with new token info
      queryClient.invalidateQueries({ queryKey: authKeys.profile() })
    },
    onError: (error) => {
      // Silent failure - route guards will handle the redirect if session is truly dead
      console.error('Token refresh failed:', error.message)
    },
  })
}

/**
 * Hook for resetting user password
 */
export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (data: ResetPasswordDto) => resetPasswordFn({ data }),
    onSuccess: () => {
      toast.success('Password reset link sent to your email')
    },
    onError: () => {
      toast.error('Failed to request password reset')
    },
  })
}

/**
 * Hook for cleaning up old/revoked tokens
 */
export function useCleanupTokensMutation() {
  return useMutation({
    mutationFn: () => cleanupOldTokensFn(),
    onSuccess: () => {
      toast.success('Old tokens cleaned up successfully')
      // Refresh cache to reflect changes if necessary
      queryClient.invalidateQueries({ queryKey: authKeys.all })
    },
    onError: () => {
      toast.error('Failed to cleanup old tokens')
    },
  })
}

/**
 * Hook for signing out of all devices
 */
export function useLogoutAllMutation() {
  const router = useRouter()

  return useMutation({
    mutationFn: () => api.auth.logoutAll(),
    onSuccess: async () => {
      // Thoroughly clear all cached data
      queryClient.removeQueries({ queryKey: authKeys.all })
      queryClient.removeQueries({ queryKey: sessionKeys.all })

      toast.success('Signed out of all devices')

      // Navigate to login page
      await router.navigate({ to: '/login' })
    },
    onError: () => {
      toast.error('Failed to sign out of all devices')
    },
  })
}
