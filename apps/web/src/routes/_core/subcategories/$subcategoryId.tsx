import { useForm } from '@tanstack/react-form'
import { useNavigate, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { SubcategoryBasicInfo } from '@/components/web/subcategories/subcategory-form/subcategory-basic-info'
import { SideBarForm } from '@/components/web/subcategories/subcategory-form/sidebar-form'
import { useSubcategoryQuery } from '@/lib/queries/subcategories.query'
import { useUpdateSubcategoryMutation } from '@/lib/mutations/subcategories.mutation'
import { SubcategorySchema } from '@/schemas/subcategory.schema'
import z from 'zod'

export const Route = createFileRoute('/_core/subcategories/$subcategoryId')({
  component: EditSubcategoryPage,
})

function EditSubcategoryPage() {
  const { subcategoryId } = Route.useParams()
  const navigate = useNavigate()

  const { data: subcategoryResponse, isLoading: subcategoryLoading } =
    useSubcategoryQuery(subcategoryId)
  const updateMutation = useUpdateSubcategoryMutation()

  const subcategory = subcategoryResponse

  const form = useForm({
    defaultValues: {
      name: subcategory?.name || '',
      description: subcategory?.description || '',
      category_id:
        (subcategory?.category as any)?.id || subcategory?.category.id || '',
    } as z.infer<typeof SubcategorySchema>,
    validators: {
      onSubmit: SubcategorySchema,
    },
    onSubmit: async ({ value }) => {
      const subcategoryData = {
        name: value.name,
        description: value.description,
        category_id: value.category_id,
      }

      await updateMutation.mutateAsync({
        id: subcategoryId,
        data: subcategoryData,
      })

      navigate({ to: '/subcategories' })
    },
  })

  if (subcategoryLoading) {
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
          onClick={() => navigate({ to: '/subcategories' })}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="text-2xl font-bold tracking-tight">
          Edit Subcategory
          <div className="text-muted-foreground text-sm font-normal">
            Update subcategory details
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
              <SubcategoryBasicInfo form={form} />
            </div>

            <SideBarForm form={form} />
          </div>
        </form>
      </div>
    </>
  )
}
