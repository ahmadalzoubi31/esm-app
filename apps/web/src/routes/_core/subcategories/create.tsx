import { useForm } from '@tanstack/react-form'
import { useNavigate, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { SubcategoryBasicInfo } from '@/components/web/subcategories/subcategory-form/subcategory-basic-info'
import { SideBarForm } from '@/components/web/subcategories/subcategory-form/sidebar-form'
import { useCreateSubcategoryMutation } from '@/lib/mutations'
import { SubcategorySchema } from '@/schemas/subcategory.schema'
import z from 'zod'

export const Route = createFileRoute('/_core/subcategories/create')({
  component: CreateSubcategoryPage,
})

function CreateSubcategoryPage() {
  const navigate = useNavigate()
  const createMutation = useCreateSubcategoryMutation()

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      category_id: '',
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

      await createMutation.mutateAsync(subcategoryData as any)

      navigate({ to: '/subcategories' })
    },
  })

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
          Create Subcategory
          <div className="text-muted-foreground text-sm font-normal">
            Create a new case subcategory
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
