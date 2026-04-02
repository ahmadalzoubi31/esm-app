import { api } from '@/lib/api'
import { CategoryReadSchema } from '@repo/shared'
import { createServerFn } from '@tanstack/react-start'

export const getCategoryFn = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const res = await api.categories.findOne(data.id)
    return CategoryReadSchema.parse(res.data) // ← type is inferred from schema ✅
  })
