import { useForm } from '@tanstack/react-form'
import { useNavigate, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { CaseSubcategoryBasicInfo } from '@/components/web/case-subcategories/case-subcategory-form/case-subcategory-basic-info'
import { SideBarForm } from '@/components/web/case-subcategories/case-subcategory-form/sidebar-form'
import { useCaseSubcategoryQuery } from '@/lib/queries/case-subcategories.query'
import { useUpdateCaseSubcategoryMutation } from '@/lib/mutations/case-subcategories.mutation'
import { CaseSubcategorySchema } from '@/schemas/case-subcategory.schema'
import z from 'zod'

export const Route = createFileRoute('/_esm/case-subcategories/$subcategoryId')(
  {
    component: EditCaseSubcategoryPage,
  },
)

function EditCaseSubcategoryPage() {
  const { subcategoryId } = Route.useParams()
  const navigate = useNavigate()

  const { data: subcategoryResponse, isLoading: subcategoryLoading } =
    useCaseSubcategoryQuery(subcategoryId)
  const updateMutation = useUpdateCaseSubcategoryMutation()

  const subcategory = subcategoryResponse?.data || subcategoryResponse

  const form = useForm({
    defaultValues: {
      name: subcategory?.name || '',
      description: subcategory?.description || '',
      category_id:
        (subcategory?.category as any)?.id || subcategory?.category_id || '',
    } as z.infer<typeof CaseSubcategorySchema>,
    validators: {
      onSubmit: CaseSubcategorySchema,
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

      navigate({ to: '/case-subcategories' })
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
          onClick={() => navigate({ to: '/case-subcategories' })}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="text-2xl font-bold tracking-tight">
          Edit Case Subcategory
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
              <CaseSubcategoryBasicInfo form={form} />
            </div>

            <SideBarForm form={form} />
          </div>
        </form>
      </div>
    </>
  )
}
