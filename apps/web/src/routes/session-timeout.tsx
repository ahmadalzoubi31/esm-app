import { useState } from 'react'
import { useRouter, createFileRoute } from '@tanstack/react-router'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, RefreshCw, LogOut } from 'lucide-react'
import { useRefreshTokensMutation } from '@/lib/mutations'

export const Route = createFileRoute('/session-timeout')({
  component: SessionTimeout,
})

function SessionTimeout() {
  const router = useRouter()
  const refreshToken = useRefreshTokensMutation()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true)
      // await api.auth.refreshTokens()
      await refreshToken.mutateAsync()

      toast.success('Session refreshed successfully')
      router.navigate({ to: '/' })
    } catch (err) {
      toast.error('Failed to refresh session. Please log in again.')
      router.navigate({ to: '/login' })
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleLoginRedirect = () => {
    router.navigate({ to: '/login' })
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50/50 p-4 dark:bg-gray-900/50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900/20">
              <RefreshCw className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Session Expired
          </CardTitle>
          <CardDescription className="text-center text-gray-500 dark:text-gray-400">
            Your session has timed out due to inactivity. Would you like to
            refresh your session or log in again?
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="w-full"
            size="lg"
          >
            {isRefreshing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              'Refresh Session'
            )}
          </Button>
        </CardContent>
        <CardFooter>
          <Button
            variant="ghost"
            onClick={handleLoginRedirect}
            className="w-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Return to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
