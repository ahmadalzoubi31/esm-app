import { createMiddleware, createStart } from '@tanstack/react-start'
import { api } from '@/lib/api'
import { redirect } from '@tanstack/react-router'

// const loggingMiddleware = createMiddleware({ type: 'request' }).server(
//   async ({ request, next }) => {
//     const url = new URL(request.url)
//     console.log(`[${request.method}] ${url.pathname}`)
//     return next()
//   },
// )
const public_paths = [
  '/login',
  '/register',
  '/.well-known/appspecific/com.chrome.devtools.json',
  '/_serverFn/eyJmaWxlIjoiL0BpZC9zcmMvc2VydmVyL2F1dGguc2VydmVyLnRzP3Rzcy1zZXJ2ZXJmbi1zcGxpdCIsImV4cG9ydCI6InNpZ25JbkZuX2NyZWF0ZVNlcnZlckZuX2hhbmRsZXIifQ',
]
const authMiddleware = createMiddleware({ type: 'request' }).server(
  async ({ request, next }) => {
    const url = new URL(request.url)
    if (public_paths.includes(url.pathname)) {
      return next()
    }

    try {
      // Try to get the user profile
      // Access token is automatically read from cookie by the API client
      const user = await api.auth.getProfile()

      return next({ context: { user: user.data } })
    } catch (error) {
      // If profile fetch fails, redirect to login
      throw redirect({ to: '/login' })
    }
  },
)

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [authMiddleware],
  }
})
