import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { api } from '@/lib/api'
import { LoginSchema } from '@/schemas/auth.schema'

export const getProfileFn = createServerFn().handler(async () => {
  const request = getRequest()
  const cookie = request?.headers.get('cookie') || ''

  const res = await api.auth.getProfile({
    headers: {
      Cookie: cookie,
    },
  })
  return res.data
})

export const signInFn = createServerFn({ method: 'POST' })
  .inputValidator(LoginSchema)
  .handler(async ({ data }) => {
    const res = await api.auth.signIn(data)

    return res.data
  })

export const signOutFn = createServerFn({ method: 'POST' }).handler(
  async () => {
    const res = await api.auth.logout()

    return res.data
  },
)
