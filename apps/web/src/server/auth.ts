import type { AuthUser } from '@/types/auth'
import { createServerFn } from '@tanstack/react-start'
import { getRequest, setResponseHeader } from '@tanstack/react-start/server'
import { api } from '@/lib/api'
import { LoginSchema } from '@/schemas/auth.schema'
import type { ResetPasswordDto } from '@/types'

export const getContextUser = createServerFn().handler(async ({ context }) => {
  return context?.user as AuthUser | undefined
})

export const getProfileFn = createServerFn().handler(
  async (): Promise<AuthUser> => {
    const request = getRequest()
    const cookie = request?.headers.get('cookie') || ''

    const res = await api.auth.getProfile({
      headers: {
        Cookie: cookie,
      },
    })

    return res.data
  },
)

export const signInFn = createServerFn({ method: 'POST' })
  .inputValidator(LoginSchema)
  .handler(async ({ data }) => {
    // 1. Call your API
    const res = await api.auth.signIn(data)
    // 2. Get the cookies from the backend response
    // (Note: You'll need your apiFetch to return the raw headers)
    const setCookie = res.headers?.getSetCookie()
    if (setCookie) {
      // 3. Manually append them to the ServerFn's response to the browser
      setResponseHeader('Set-Cookie', setCookie)
    }
    return res.data
  })

// export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
//   const res = await api.auth.logout()
//   return res.data
// })

// export const logoutAllFn = createServerFn({ method: 'POST' }).handler(
//   async () => {
//     const res = await api.auth.logoutAll()
//     return res.data
//   },
// )

// export const refreshTokensFn = createServerFn({ method: 'POST' }).handler(
//   async () => {
//     const request = getRequest()
//     const cookie = request?.headers.get('cookie') || ''

//     console.log('A1: ', cookie)
//     const res = await api.auth.refreshTokens({
//       headers: {
//         Cookie: cookie,
//       },
//     })
//     console.log('A2: ', res)
//     return res.data
//   },
// )

export const resetPasswordFn = createServerFn({ method: 'POST' })
  .inputValidator((data: ResetPasswordDto) => data)
  .handler(async ({ data }) => {
    const res = await api.auth.resetPassword(data)
    return res.data
  })

export const cleanupOldTokensFn = createServerFn({ method: 'POST' }).handler(
  async () => {
    const res = await api.auth.cleanupOldTokens()
    return res.data
  },
)
