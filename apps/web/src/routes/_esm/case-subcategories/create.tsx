import { useForm } from '@tanstack/react-form'
import { useNavigate, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { CaseSubcategoryBasicInfo } from '@/components/web/case-subcategories/case-subcategory-form/case-subcategory-basic-info'
import { SideBarForm } from '@/components/web/case-subcategories/case-subcategory-form/sidebar-form'
import { useCreateCaseSubcategoryMutation } from '@/lib/mutations'
import { CaseSubcategorySchema } from '@/schemas/case-subcategory.schema'
import z from 'zod'

export const Route = createFileRoute('/_esm/case-subcategories/create')({
  component: CreateCaseSubcategoryPage,
})

function CreateCaseSubcategoryPage() {
  const navigate = useNavigate()
  const createMutation = useCreateCaseSubcategoryMutation()

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      category_id: '',
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

      await createMutation.mutateAsync(subcategoryData as any)

      navigate({ to: '/case-subcategories' })
    },
  })

  return (
    <>
      <div className="flex flex-row items-center gap-4 px-4 lg:px-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/case-subcategories' })}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="text-2xl font-bold tracking-tight">
          Create Case Subcategory
          <div className="text-muted-foreground text-sm font-normal">
            Create a new case subcategory
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
              <CaseSubcategoryBasicInfo form={form} />
            </div>

            <SideBarForm form={form} />
          </div>
        </form>
      </div>
    </>
  )
}
