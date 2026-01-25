import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { ResetPasswordDto, SignInDto } from '@/types'
import { toast } from 'sonner'
import { useRouter } from '@tanstack/react-router'
import { authKeys } from '../queries/auth.query'
import { sessionKeys } from '../queries/session.query'

export function useSignInMutation() {
  const router = useRouter()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (dto: SignInDto) => await api.auth.signIn(dto),
    onSuccess: async () => {
      // Fetch the user profile (access token is now in cookie)
      try {
        const profileResponse = await api.auth.getProfile()
        // Cache the profile data
        queryClient.setQueryData(authKeys.profile(), profileResponse)
      } catch (error) {
        console.error('Failed to fetch profile after login:', error)
      }

      toast.success('Logged in successfully')

      // Check if there's a redirect URL in the search params
      const searchParams = new URLSearchParams(window.location.search)
      const redirectUrl = searchParams.get('redirect')

      // Navigate to the redirect URL or default to dashboard
      router.navigate({ to: redirectUrl || '/dashboard' })
    },
    onError: () => {
      toast.error('Failed to log in: Invalid credentials')
    },
  })
}

export function useLogoutMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => await api.auth.logout(),
    onSuccess: () => {
      // Clear cached data (cookies are cleared by server)
      queryClient.setQueryData(authKeys.profile(), null)
      queryClient.removeQueries({ queryKey: authKeys.all })

      // Force full page reload to ensure cookies are cleared
      window.location.href = '/login'
    },
    onError: () => {
      toast.error('Failed to log out')
    },
  })
}

export function useRefreshTokensMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => await api.auth.refreshTokens({}),
    onSuccess: () => {
      // Token is now in cookie, just update cached profile
      queryClient.invalidateQueries({ queryKey: authKeys.profile() })
    },
    onError: () => {
      // Silent failure - set state to unauthenticated
      // Route guards will handle the redirect
    },
  })
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (data: ResetPasswordDto) => api.auth.resetPassword(data),
  })
}

export function useCleanupTokensMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => api.auth.cleanupOldTokens(),
    onSuccess: () => {
      toast.success('Old revoked tokens cleaned up successfully')
      // Clear cached data (cookies are cleared by server)
      queryClient.setQueryData(authKeys.profile(), null)
      queryClient.removeQueries({ queryKey: authKeys.all })
    },
  })
}

export function useLogoutAllMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => await api.auth.logoutAll(),
    onSuccess: () => {
      // Clear cached data (cookies are cleared by server)
      queryClient.setQueryData(authKeys.profile(), null)
      queryClient.removeQueries({ queryKey: authKeys.all })
      queryClient.removeQueries({ queryKey: sessionKeys.all })

      toast.success('Signed out of all devices')

      // Force full page reload to ensure cookies are cleared
      window.location.href = '/login'
    },
    onError: () => {
      toast.error('Failed to sign out of all devices')
    },
  })
}
