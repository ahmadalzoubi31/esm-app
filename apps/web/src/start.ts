import { createMiddleware, createStart } from '@tanstack/react-start'

import { api } from '@/lib/api'

import { redirect } from '@tanstack/react-router'

// ### Public paths
const public_paths = [
  '/login',
  '/register',
  '/session-timeout',
  '/.well-known/appspecific/com.chrome.devtools.json',
  '/_serverFn/eyJmaWxlIjoiL0BpZC9zcmMvc2VydmVyL2F1dGguc2VydmVyLnRzP3Rzcy1zZXJ2ZXJmbi1zcGxpdCIsImV4cG9ydCI6InNpZ25JbkZuX2NyZWF0ZVNlcnZlckZuX2hhbmRsZXIifQ',
]

const authMiddleware = createMiddleware().server(async ({ next, request }) => {
  // 1: Check if path is public
  const url = new URL(request.url)

  // 2: Allow public paths
  if (public_paths.includes(url.pathname)) {
    return next()
  }

  // 3: Get cookies of the request headers
  const cookies = request.headers.get('cookie') || ''

  try {
    // 4: Get profile from the cookies
    const { data } = await api.auth.getProfile({
      headers: { cookie: cookies },
    })

    // 5: If profile is not found, redirect to login
    if (!data) {
      throw redirect({ to: '/login' })
    }

    // 6: Return next with user data
    return next({ context: { user: data } })
  } catch (error: any) {
    // if unauthorized error,  show a new page like a session timeout if want to refresh click the button.
    if (error.statusCode === 401) {
      throw redirect({
        to: '/session-timeout',
        search: { from: url.pathname },
      })
    }

    // if other error, redirect to login
    throw redirect({ to: '/login' })
  }
})

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [authMiddleware],
  }
})
