import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { api } from '@/lib/api'
import { redirect } from '@tanstack/react-router'

export const getSessionFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const headers = getRequestHeaders()
    const session = await api.session.getSessions()
    if (!session.data) {
      throw redirect({ to: '/login' })
    }

    return session.data
  },
)
