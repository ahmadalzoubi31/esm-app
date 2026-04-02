import { api } from '@/lib/api'
import { CategorySchema } from '@repo/shared'
import { createServerFn } from '@tanstack/react-start'

export const getCategoryFn = createServerFn<CategorySchema>({ method: 'GET' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const res = await api.categories.findOne(data.id)
    return res.data
  })
