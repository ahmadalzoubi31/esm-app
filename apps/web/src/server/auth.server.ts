import { createServerFn } from '@tanstack/react-start'
import { api } from '@/lib/api'
import { LoginSchema } from '@/schemas/auth.schema'

export const getProfileFn = createServerFn().handler(async () => {
  const res = await api.auth.getProfile()
  console.log('🚀 ~ res:', res)

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
