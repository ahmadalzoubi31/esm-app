import { useForm } from '@tanstack/react-form'
import { useNavigate, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { CaseCategoryBasicInfo } from '@/components/web/case-categories/case-category-form/case-category-basic-info'
import { SideBarForm } from '@/components/web/case-categories/case-category-form/sidebar-form'
import { useCreateCaseCategoryMutation } from '@/lib/mutations'
import { CaseCategorySchema } from '@/schemas/case-category.schema'
import z from 'zod'

export const Route = createFileRoute('/_esm/case-categories/create')({
  component: CreateCaseCategoryPage,
})

function CreateCaseCategoryPage() {
  const navigate = useNavigate()
  const createMutation = useCreateCaseCategoryMutation()

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
    } as z.infer<typeof CaseCategorySchema>,
    validators: {
      onSubmit: CaseCategorySchema,
    },
    onSubmit: async ({ value }) => {
      const categoryData = {
        name: value.name,
        description: value.description,
      }

      await createMutation.mutateAsync(categoryData as any)

      navigate({ to: '/case-categories' })
    },
  })

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
          Create Case Category
          <div className="text-muted-foreground text-sm font-normal">
            Create a new case category
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
