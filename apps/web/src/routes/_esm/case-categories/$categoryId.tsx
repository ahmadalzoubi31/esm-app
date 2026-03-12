import { useForm } from '@tanstack/react-form'
import { useNavigate, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { CaseCategoryBasicInfo } from '@/components/web/case-categories/case-category-form/case-category-basic-info'
import { SideBarForm } from '@/components/web/case-categories/case-category-form/sidebar-form'
import { useCaseCategoryQuery } from '@/lib/queries/case-categories.query'
import { useUpdateCaseCategoryMutation } from '@/lib/mutations/case-categories.mutation'
import { CaseCategorySchema } from '@/schemas/case-category.schema'
import z from 'zod'

export const Route = createFileRoute('/_esm/case-categories/$categoryId')({
  component: EditCaseCategoryPage,
})

function EditCaseCategoryPage() {
  const { categoryId } = Route.useParams()
  const navigate = useNavigate()

  const { data: categoryResponse, isLoading: categoryLoading } = useCaseCategoryQuery(categoryId)
  const updateMutation = useUpdateCaseCategoryMutation()

  const category = categoryResponse?.data || categoryResponse

  const form = useForm({
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
    } as z.infer<typeof CaseCategorySchema>,
    validators: {
      onSubmit: CaseCategorySchema,
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

      navigate({ to: '/case-categories' })
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
      <div className="flex flex-row items-center gap-4 px-4 lg:px-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/case-categories' })}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="text-2xl font-bold tracking-tight">
          Edit Case Category
          <div className="text-muted-foreground text-sm font-normal">
            Update category details
          </div>
        </div>
      </div>

      <div className="px-8 lg:px-8">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 mx-auto pb-4 pt-4">
            <div className="space-y-6 lg:col-span-3">
              <CaseCategoryBasicInfo form={form} />
            </div>

            <SideBarForm form={form} />
          </div>
        </form>
      </div>
    </>
  )
}
