import { createMiddleware, createStart } from '@tanstack/react-start'

import { redirect } from '@tanstack/react-router'
import { AuthUser } from './types'
import { api } from './lib/api'

// ### Public paths
const public_paths = [
  '/login',
  '/register',
  '/session-timeout',
  '/.well-known/appspecific/com.chrome.devtools.json',
  '/_serverFn/eyJmaWxlIjoiL0BpZC9zcmMvc2VydmVyL2F1dGguc2VydmVyLnRzP3Rzcy1zZXJ2ZXJmbi1zcGxpdCIsImV4cG9ydCI6InNpZ25JbkZuX2NyZWF0ZVNlcnZlckZuX2hhbmRsZXIifQ',
  '/_serverFn/eyJmaWxlIjoiL0BpZC9zcmMvc2VydmVyL2F1dGgudHM_dHNzLXNlcnZlcmZuLXNwbGl0IiwiZXhwb3J0Ijoic2lnbkluRm5fY3JlYXRlU2VydmVyRm5faGFuZGxlciJ9',
]

const authMiddleware = createMiddleware().server(async ({ next, request }) => {
  // 1: Check if path is public
  const url = new URL(request.url)

  // 1.a: log the full path of the request for debugging
  console.log(`Incoming request: ${url.pathname}`)

  // 2: Allow public paths
  if (public_paths.includes(url.pathname)) {
    // 2.a: log public path access for debugging
    console.log(`Public path accessed: true`)
    return next()
  }

  // 3: Get cookies of the request headers
  const cookie = request.headers.get('cookie') || ''

  try {
    // 4: Get profile from the cookies
    const res = await api.auth.getProfile({
      headers: {
        Cookie: cookie,
      },
    })
    const profile: AuthUser = res.data

    // 5: If profile is not found, redirect to login
    if (!profile) {
      throw redirect({ to: '/login' })
    }

    // 6: Return next with user data:: can use the context inside the serverFN just or another middleware
    return next({ context: { user: profile } })
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
