import { createMiddleware, createStart } from '@tanstack/react-start'

import { api } from '@/lib/api'

import { redirect } from '@tanstack/react-router'
import { getProfileFn } from './server/auth.server'
import { AuthUser } from '@/types/auth'

const public_paths = [
  '/login',

  '/register',

  '/.well-known/appspecific/com.chrome.devtools.json',

  '/_serverFn/eyJmaWxlIjoiL0BpZC9zcmMvc2VydmVyL2F1dGguc2VydmVyLnRzP3Rzcy1zZXJ2ZXJmbi1zcGxpdCIsImV4cG9ydCI6InNpZ25JbkZuX2NyZWF0ZVNlcnZlckZuX2hhbmRsZXIifQ',
]

const authMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next, context, request }) => {
    const url = new URL(request.url)

    if (public_paths.includes(url.pathname)) {
      return next()
    }

    try {
      const user: AuthUser = await getProfileFn()

      return await next({ context: { user } })
    } catch (error) {
      console.log('🚀 ~ error:', error)
      // 3: If profile fetch fails, redirect to login
      throw redirect({ to: '/login' })
    }
  },
)

export const startInstance = createStart(() => {
  return {
    functionMiddleware: [loggingMiddleware],
  }
})
