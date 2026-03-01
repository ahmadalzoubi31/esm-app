import { api } from '@/lib/api'
import { CreateUserDto, UpdateUserDto } from '@/types'
import { createServerFn } from '@tanstack/react-start'

export const createUserFn = createServerFn({ method: 'POST' })
  .inputValidator((data: CreateUserDto) => data)
  .handler(async ({ data }) => {
    const res = await api.users.create(data)
    return res.data
  })

export const getUsersFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const res = await api.users.findAll()
    return res.data
  },
)

export const getUserFn = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const res = await api.users.findOne(data.id)
    return res.data
  })

export const searchUsersFn = createServerFn({ method: 'GET' })
  .inputValidator(
    (data?: string | { filters?: string; search?: string; limit?: string }) =>
      data,
  )
  .handler(async ({ data }) => {
    const res = await api.users.search(data)
    return res.data
  })

export const updateUserFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string; data: UpdateUserDto }) => data)
  .handler(async ({ data }) => {
    const res = await api.users.update(data.id, data.data)
    return res.data
  })

export const deleteUserFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const res = await api.users.remove(data.id)
    return res.data
  })

export const updateBulkUserFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { ids: string[]; data: UpdateUserDto }) => data)
  .handler(async ({ data }) => {
    const res = await api.users.updateBulk(data)
    return res.data
  })

export const deleteBulkUserFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { ids: string[] }) => data)
  .handler(async ({ data }) => {
    const res = await api.users.deleteBulk(data.ids)
    return res.data
  })
