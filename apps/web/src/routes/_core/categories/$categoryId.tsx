import { useForm } from '@tanstack/react-form'
import { useNavigate, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { CategoryBasicInfo } from '@/components/web/categories/category-form/category-basic-info'
import { SideBarForm } from '@/components/web/categories/category-form/sidebar-form'
import { useCategoryQuery } from '@/lib/queries/categories.query'
import { useUpdateCategoryMutation } from '@/lib/mutations/categories.mutation'
import { CategorySchema } from '@/schemas/category.schema'
import z from 'zod'

export const Route = createFileRoute('/_core/categories/$categoryId')({
  component: EditCategoryPage,
})

function EditCategoryPage() {
  const { categoryId } = Route.useParams()
  const navigate = useNavigate()

  const { data: categoryResponse, isLoading: categoryLoading } =
    useCategoryQuery(categoryId)
  const updateMutation = useUpdateCategoryMutation()

  const category = categoryResponse?.data || categoryResponse

  const form = useForm({
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
    } as z.infer<typeof CategorySchema>,
    validators: {
      onSubmit: CategorySchema,
    },
    onSubmit: async ({ value }) => {
      const categoryData = {
        name: value.name,
        description: value.description,
      }

      await updateMutation.mutateAsync({
        id: categoryId,
        data: categoryData,
      })

      navigate({ to: '/categories' })
    },
  })

  if (categoryLoading) {
    return (
      <div className="flex h-[200px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-row items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/categories' })}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="text-2xl font-bold tracking-tight">
          Edit category
          <div className="text-muted-foreground text-sm font-normal">
            Update category details
          </div>
        </div>
      </div>

      <div className="">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 mx-auto pb-4 pt-4">
            <div className="space-y-6 lg:col-span-3">
              <CategoryBasicInfo form={form} />
            </div>

            <SideBarForm form={form} />
          </div>
        </form>
      </div>
    </>
  )
}
